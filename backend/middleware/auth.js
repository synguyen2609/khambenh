const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Authorization denied.'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.'
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Middleware to allow only doctors
exports.doctorOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Doctor privileges required.'
    });
  }
  next();
};

// Middleware to allow only patients
exports.patientOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Patient privileges required.'
    });
  }
  next();
};

// Middleware to allow only admin
exports.adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Middleware to allow admin or doctor
exports.adminOrDoctorMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin or Doctor privileges required.'
    });
  }
  next();
};



