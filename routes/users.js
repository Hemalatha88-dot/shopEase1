const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// User registration endpoint
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('mobile').isMobilePhone().withMessage('Valid mobile number is required'),
  body('email').isEmail().optional().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, mobile, email } = req.body;

    // Check if user already exists
    const checkQuery = 'SELECT id, is_verified FROM users WHERE mobile = ?';
    const [existingUsers] = await pool.query(checkQuery, [mobile]);

    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      if (user.is_verified) {
        return res.json({
          success: true,
          message: 'User already verified',
          user_id: user.id,
          verified: true
        });
      } else {
        return res.json({
          success: true,
          message: 'User exists, please verify OTP',
          user_id: user.id,
          verified: false
        });
      }
    }

    // Create new user
    const insertQuery = 'INSERT INTO users (name, mobile, email) VALUES (?, ?, ?)';
    const [result] = await pool.query(insertQuery, [name, mobile, email || null]);

    console.log(`📱 New user registered: ${name} (${mobile})`);

    res.json({
      success: true,
      message: 'User registered successfully. Please verify OTP.',
      user_id: result.insertId,
      verified: false,
      otp_hint: 'Use OTP: 1234'
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// OTP verification endpoint
router.post('/verify-otp', [
  body('mobile').isMobilePhone().withMessage('Valid mobile number is required'),
  body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { mobile, otp } = req.body;

    // Static OTP verification (always 1234)
    if (otp !== '1234') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
        hint: 'Use OTP: 1234'
      });
    }

    // Find user and mark as verified
    const findUserQuery = 'SELECT id, name, email FROM users WHERE mobile = ?';
    const [users] = await pool.query(findUserQuery, [mobile]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    const user = users[0];

    // Update verification status
    const updateQuery = 'UPDATE users SET is_verified = TRUE, otp_verified_at = NOW() WHERE mobile = ?';
    await pool.query(updateQuery, [mobile]);

    console.log(`✅ OTP verified for user: ${user.name} (${mobile})`);

    res.json({
      success: true,
      message: 'OTP verified successfully!',
      user: {
        id: user.id,
        name: user.name,
        mobile: mobile,
        email: user.email,
        verified: true
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message
    });
  }
});

// Check user verification status
router.get('/status/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;

    const query = 'SELECT id, name, email, is_verified, otp_verified_at FROM users WHERE mobile = ?';
    const [users] = await pool.query(query, [mobile]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        mobile: mobile,
        email: user.email,
        verified: user.is_verified,
        verified_at: user.otp_verified_at
      }
    });

  } catch (error) {
    console.error('User status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check user status',
      error: error.message
    });
  }
});

module.exports = router;
