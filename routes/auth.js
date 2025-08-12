const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// Store Manager Registration
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number is required'),
  body('address').optional().trim(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, address, description } = req.body;

    // Check if store already exists
    const [existingStores] = await pool.execute(
      'SELECT id FROM stores WHERE email = ?',
      [email]
    );


    if (existingStores.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Store with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new store
    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, password, phone, address, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, address || null, description || null]
    );

    const storeId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { storeId, email, role: 'store_manager' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Store registered successfully',
      data: {
        storeId,
        name,
        email,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Store Manager Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find store by email
    const [stores] = await pool.execute(
      'SELECT id, name, email, password FROM stores WHERE email = ?',
      [email]
    );

    if (stores.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const store = stores[0];

    // Verify password (supports legacy plaintext rows and auto-migrates)
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, store.password || '');
    } catch (e) {
      isPasswordValid = false;
    }

    if (!isPasswordValid) {
      // Fallback: if password was stored in plaintext (legacy), accept and migrate
      if (store.password && store.password === password) {
        const newHash = await bcrypt.hash(password, 12);
        await pool.execute('UPDATE stores SET password = ? WHERE id = ?', [newHash, store.id]);
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { storeId: store.id, email: store.email, role: 'store_manager' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        storeId: store.id,
        name: store.name,
        email: store.email,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Customer Registration
router.post('/customer/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone('any').withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, phone } = req.body;

    // Check if customer already exists
    const [existingCustomers] = await pool.execute(
      'SELECT id FROM customers WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingCustomers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email or phone already exists'
      });
    }

    // Insert new customer
    const [result] = await pool.execute(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );

    const customerId = result.insertId;

    // Generate OTP (for demo, using fixed OTP)
    const otp = '123456'; // In production, generate random OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await pool.execute(
      'INSERT INTO otp_verification (phone, otp, expires_at) VALUES (?, ?, ?)',
      [phone, otp, expiresAt]
    );

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully. OTP sent to your phone.',
      data: {
        customerId,
        phone,
        otp // Remove this in production
      }
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Verify OTP
router.post('/customer/verify-otp', [
  body('phone').isMobilePhone('any').withMessage('Valid phone number is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { phone, otp } = req.body;

    // Find valid OTP
    const [otpRecords] = await pool.execute(
      'SELECT * FROM otp_verification WHERE phone = ? AND otp = ? AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [phone, otp]
    );

    if (otpRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    await pool.execute(
      'UPDATE otp_verification SET is_used = TRUE WHERE id = ?',
      [otpRecords[0].id]
    );

    // Update customer as verified
    await pool.execute(
      'UPDATE customers SET is_verified = TRUE WHERE phone = ?',
      [phone]
    );

    // Get customer details
    const [customers] = await pool.execute(
      'SELECT id, name, email, phone FROM customers WHERE phone = ?',
      [phone]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = customers[0];

    // Generate JWT token
    const token = jwt.sign(
      { customerId: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        token
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
});

// Resend OTP
router.post('/customer/resend-otp', [
  body('phone').isMobilePhone('any').withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { phone } = req.body;

    // Check if customer exists
    const [customers] = await pool.execute(
      'SELECT id FROM customers WHERE phone = ?',
      [phone]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Generate new OTP
    const otp = '123456'; // In production, generate random OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store new OTP
    await pool.execute(
      'INSERT INTO otp_verification (phone, otp, expires_at) VALUES (?, ?, ?)',
      [phone, otp, expiresAt]
    );

    res.json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        phone,
        otp // Remove this in production
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
});

module.exports = router; 