const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils.js');
const jwt = require('jsonwebtoken');
const authKeys = require('../utils/authKeys.js');
const speakeasy = require('speakeasy');
const cookieParser = require('cookie-parser');
const QRCode = require('qrcode');
const passport = require('passport');
const verifyToken = require ('../middlewares/tokenAuth.js')


router.use(cookieParser());

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

router.post('/logout', (req, res) => {
  res.cookie('authToken', '', { expires: new Date(0), httpOnly: true, path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPass = await hashPassword(password);
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    let user = new User({
      email,
      password: hashedPass,
      twofasecret: secret,
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
}); 

router.get('/generate-2fa', verifyToken, async (req, res) => {
  const userEmail = req.user.email;
  console.log(userEmail)

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpauthUrl = speakeasy.otpauthURL({
      secret: user.twofasecret,
      label: userEmail,
      issuer: 'stepCon',
      encoding: 'base32',
    });

    QRCode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code', error: err.message });
      }

      res.json({ qrCodeUrl: dataUrl });
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.post('/verify-2fa', verifyToken, async (req, res) => {
  const { totpCode } = req.body;
  const userEmail = req.user.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twofasecret,
      encoding: 'base32',
      token: totpCode,
    });

    if (verified) {
      res.status(200).json({ message: '2FA verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA code' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

 router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id, email: user.email }, authKeys.jwtSecretKey, {
        expiresIn: '3h',
      });

      res.cookie('authToken', token, {
        httpOnly: true,
       
        maxAge: 3 * 60 * 60 * 1000, // 3 hours
        sameSite: 'Strict',
      });

      res.status(200).json({ message: 'User logged in successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error logging in', error: err.message });
  }
}); 

module.exports = router;
