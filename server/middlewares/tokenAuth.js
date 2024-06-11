// middleware/auth.js
const jwt = require('jsonwebtoken');
const authKeys = require('../utils/authKeys.js');

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(403).json({ message: 'No token found' });
  }

  jwt.verify(token, authKeys.jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    }

    req.user = decoded; // Store decoded token in request
    next();
  });
};

module.exports = verifyToken;
