const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify store manager role
const authenticateStoreManager = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== 'store_manager') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Store manager role required.'
      });
    }
    next();
  });
};

// Middleware to verify customer role
const authenticateCustomer = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer role required.'
      });
    }
    next();
  });
};

// Middleware to verify store ownership
const verifyStoreOwnership = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;
    
    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    // Check if store exists and belongs to the authenticated user
    const [stores] = await pool.execute(
      'SELECT id FROM stores WHERE id = ? AND id = ?',
      [storeId, req.user.storeId]
    );

    if (stores.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Store not found or not owned by you.'
      });
    }

    next();
  } catch (error) {
    console.error('Store ownership verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Optional authentication middleware (for public routes that can work with or without auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = {
  authenticateToken,
  authenticateStoreManager,
  authenticateCustomer,
  verifyStoreOwnership,
  optionalAuth
}; 