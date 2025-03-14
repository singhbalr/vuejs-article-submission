const jwt = require('jsonwebtoken');
const { User } = require('../models/index'); // Make sure the path is correct

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    if (user.status !== 'Active') {
      return res.status(401).json({ success: false, message: 'User account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.type} is not authorized to access this route`
      });
    }
    next();
  };
};