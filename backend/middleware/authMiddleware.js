const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else if (process.env.DEFAULT_USER_ID) {
    // For no-auth flow, fallback to default user if no token provided
    req.user = await User.findById(process.env.DEFAULT_USER_ID).select('-passwordHash');
    if(req.user) {
       next();
    } else {
        res.status(401);
        next(new Error('Not authorized, no token and default user missing'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

module.exports = { protect };
