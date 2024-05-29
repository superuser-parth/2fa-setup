const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils.js');
const jwt = require('jsonwebtoken');
const authKeys = require('../utils/authKeys.js');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

router.post('/register', async (req, res) => {
  const data = req.body;

  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' }); // Changed to res.json
    }

    const hashedPass = await hashPassword(data.password); // Added await for async hashPassword
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    let user = new User({
      email: data.email,
      password: hashedPass,
      twofasecret: secret
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return res.status(400).json({ message: 'Error creating user', err }); // Improved error message
  }
});

router.get('/generate-2fa', async (req, res) => {
  const token = req.headers.authorization

  let decoded;
  try {
    decoded = jwt.verify(token, authKeys.jwtSecretKey); // Use your actual secret
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }

  const userEmail = decoded.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpauthUrl = speakeasy.otpauthURL({
      secret: user.twofasecret,
      label: userEmail,
      issuer: 'stepCon',
      encoding: 'base32'
    });

    QRCode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code', error: err.message });
      }

      res.json({ qrCodeUrl: dataUrl });
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.post('/verify-2fa', async (req, res) => {
  const token = req.headers.authorization
  const { totpCode } = req.body;

  try {
    // Decode JWT token to get user email (assuming you are using JWT)
    const decodedToken = jwt.verify(token, authKeys.jwtSecretKey); 
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twofasecret,
      encoding: 'base32',
      token: totpCode
    });

    if (verified) {
      return res.status(200).json({ message: '2FA verification successful' });
    } else {
      return res.status(400).json({ message: 'Invalid 2FA code' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
    const data = req.body;
  
    try {
      const user = await User.findOne({ email: data.email }); // Added await
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await comparePasswords(data.password, user.password); // Added await
      if (passwordMatch) {
        const token = jwt.sign({ userId: user._id, email: user.email }, authKeys.jwtSecretKey, {
          expiresIn: '3h',
        });
        return res.status(200).json({ message: 'User logged in successfully', token }); // Added token to response
      } else {
        return res.status(401).json({ message: 'Incorrect password' }); // Added response for incorrect password
      }
    } catch (err) {
      return res.status(400).json({ message: 'Error logging in', error: err.message }); // Improved error message
    }
  });

module.exports = router;
