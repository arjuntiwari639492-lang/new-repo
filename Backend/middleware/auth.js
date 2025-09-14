const jwt = require('jsonwebtoken');

// IMPORTANT: Replace this with a long, random, and secret string
const jwtSecret = '9a3b7c8e1f2d4g5h6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z';

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

