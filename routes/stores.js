const express = require('express');
const QRCode = require('qrcode');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateStoreManager, verifyStoreOwnership } = require('../middleware/auth');

const router = express.Router();

// Get store profile
router.get('/profile', authenticateStoreManager, async (req, res) => {
  try {
    const [stores] = await pool.execute(
      'SELECT id, name, description, address, phone, email, qr_code_main, created_at FROM stores WHERE id = ?',
      [req.user.storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Include storeId in the response for frontend context
    const storeData = {
      ...stores[0],
      storeId: stores[0].id
    };

    res.json({
      success: true,
      data: storeData
    });

  } catch (error) {
    console.error('Get store profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store profile'
    });
  }
});

// Update store profile
router.put('/profile', authenticateStoreManager, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim(),
  body('address').optional().trim(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required')
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

    const { name, description, address, phone } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(req.user.storeId);

    await pool.execute(
      `UPDATE stores SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Store profile updated successfully'
    });

  } catch (error) {
    console.error('Update store profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store profile'
    });
  }
});

// Generate main store QR code
router.post('/qr/main', authenticateStoreManager, async (req, res) => {
  try {
    const storeId = req.user.storeId;
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/store/${storeId}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update store with QR code
    await pool.execute(
      'UPDATE stores SET qr_code_main = ? WHERE id = ?',
      [qrCodeDataUrl, storeId]
    );

    res.json({
      success: true,
      message: 'Main store QR code generated successfully',
      data: {
        qrCode: qrCodeDataUrl,
        qrData: qrData
      }
    });

  } catch (error) {
    console.error('Generate main QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    });
  }
});

// Get store sections
router.get('/sections', authenticateStoreManager, async (req, res) => {
  try {
    const [sections] = await pool.execute(
      'SELECT id, name, description, qr_code, created_at FROM store_sections WHERE store_id = ? ORDER BY created_at DESC',
      [req.user.storeId]
    );

    res.json({
      success: true,
      data: sections
    });

  } catch (error) {
    console.error('Get store sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store sections'
    });
  }
});

// Create store section
router.post('/sections', authenticateStoreManager, [
  body('name').trim().isLength({ min: 2 }).withMessage('Section name must be at least 2 characters'),
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

    const { name, description } = req.body;

    // Insert new section
    const [result] = await pool.execute(
      'INSERT INTO store_sections (store_id, name, description) VALUES (?, ?, ?)',
      [req.user.storeId, name, description]
    );

    const sectionId = result.insertId;

    // Generate QR code for the section
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/store/${req.user.storeId}/section/${sectionId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update section with QR code
    await pool.execute(
      'UPDATE store_sections SET qr_code = ? WHERE id = ?',
      [qrCodeDataUrl, sectionId]
    );

    // Get the created section
    const [sections] = await pool.execute(
      'SELECT id, name, description, qr_code, created_at FROM store_sections WHERE id = ?',
      [sectionId]
    );

    res.status(201).json({
      success: true,
      message: 'Store section created successfully',
      data: sections[0]
    });

  } catch (error) {
    console.error('Create store section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store section'
    });
  }
});

// Update store section
router.put('/sections/:sectionId', authenticateStoreManager, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Section name must be at least 2 characters'),
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

    const { sectionId } = req.params;
    const { name, description } = req.body;

    // Verify section belongs to the store
    const [sections] = await pool.execute(
      'SELECT id FROM store_sections WHERE id = ? AND store_id = ?',
      [sectionId, req.user.storeId]
    );

    if (sections.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(sectionId);

    await pool.execute(
      `UPDATE store_sections SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Store section updated successfully'
    });

  } catch (error) {
    console.error('Update store section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store section'
    });
  }
});

// Delete store section
router.delete('/sections/:sectionId', authenticateStoreManager, async (req, res) => {
  try {
    const { sectionId } = req.params;

    // Verify section belongs to the store
    const [sections] = await pool.execute(
      'SELECT id FROM store_sections WHERE id = ? AND store_id = ?',
      [sectionId, req.user.storeId]
    );

    if (sections.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    // Delete section (cascade will handle related offers)
    await pool.execute(
      'DELETE FROM store_sections WHERE id = ?',
      [sectionId]
    );

    res.json({
      success: true,
      message: 'Store section deleted successfully'
    });

  } catch (error) {
    console.error('Delete store section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete store section'
    });
  }
});

// Get public store info (for QR code landing)
router.get('/:storeId/public', async (req, res) => {
  try {
    const { storeId } = req.params;

    const [stores] = await pool.execute(
      'SELECT id, name, description, address, phone FROM stores WHERE id = ?',
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get store sections
    const [sections] = await pool.execute(
      'SELECT id, name, description FROM store_sections WHERE store_id = ?',
      [storeId]
    );

    res.json({
      success: true,
      data: {
        store: stores[0],
        sections
      }
    });

  } catch (error) {
    console.error('Get public store info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store information'
    });
  }
});

module.exports = router; 