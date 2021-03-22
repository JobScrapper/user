const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

module.exports = {
  generateToken,
  verifyToken
}