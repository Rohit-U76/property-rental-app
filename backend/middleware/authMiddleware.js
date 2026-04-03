const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and sets user information in request
 * Protects routes from unauthorized access
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token not provided. Please login.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked',
      });
    }

    // Set user info in request for use in controllers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

/**
 * Role-based Authorization Middleware
 * Restricts access to specific user roles
 * Usage: authorize(['Admin', 'Property Owner'])
 */
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

/**
 * Tenant-only Middleware
 * Ensures only Tenants can access the resource
 */
exports.tenantOnly = (req, res, next) => {
  if (req.user.role !== 'Tenant') {
    return res.status(403).json({
      success: false,
      message: 'This resource is only available for Tenants',
    });
  }
  next();
};

/**
 * Property Owner-only Middleware
 * Ensures only Property Owners can access the resource
 */
exports.ownerOnly = (req, res, next) => {
  if (req.user.role !== 'Property Owner' && req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'This resource is only available for Property Owners',
    });
  }
  next();
};

/**
 * Admin-only Middleware
 * Ensures only Admins can access the resource
 */
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'This resource is only available for Administrators',
    });
  }
  next();
};
