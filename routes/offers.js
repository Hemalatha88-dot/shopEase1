const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateStoreManager, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Get all offers for a store (store manager)
router.get('/', authenticateStoreManager, async (req, res) => {
  try {
    const { category, section_id, is_active } = req.query;
    
    let query = `
      SELECT o.*, ss.name as section_name 
      FROM offers o 
      LEFT JOIN store_sections ss ON o.section_id = ss.id 
      WHERE o.store_id = ?
    `;
    const queryParams = [req.user.storeId];

    if (category) {
      query += ' AND o.category = ?';
      queryParams.push(category);
    }
    if (section_id) {
      query += ' AND o.section_id = ?';
      queryParams.push(section_id);
    }
    if (is_active !== undefined) {
      query += ' AND o.is_active = ?';
      queryParams.push(is_active === 'true');
    }

    query += ' ORDER BY o.created_at DESC';

    const [offers] = await pool.execute(query, queryParams);

    res.json({
      success: true,
      data: offers
    });

  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers'
    });
  }
});

// Get public offers for a store (customers)
router.get('/store/:storeId', optionalAuth, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { section_id, category, limit } = req.query;
    
    // Use simple query without prepared statements to avoid parameter issues
    let query = `
      SELECT o.*, ss.name as section_name 
      FROM offers o 
      LEFT JOIN store_sections ss ON o.section_id = ss.id 
      WHERE o.store_id = ${parseInt(storeId)} AND o.is_active = 1
    `;

    if (section_id) {
      query += ` AND o.section_id = ${parseInt(section_id)}`;
    }
    
    if (category) {
      query += ` AND o.category = '${category.replace(/'/g, "''")}'`; // Basic SQL injection protection
    }

    query += ' ORDER BY o.created_at DESC';
    
    // Only add LIMIT if it's explicitly provided
    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    console.log('Executing query:', query);

    const [offers] = await pool.query(query);

    res.json({
      success: true,
      data: offers,
      count: offers.length
    });

  } catch (error) {
    console.error('Get public offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error: error.message
    });
  }
});

// Get all offers from all stores (public endpoint for shopper UI)
router.get('/all', async (req, res) => {
  try {
    const { category, limit } = req.query;
    
    let query = `
      SELECT o.*, ss.name as section_name, s.name as store_name 
      FROM offers o 
      LEFT JOIN store_sections ss ON o.section_id = ss.id 
      LEFT JOIN stores s ON o.store_id = s.id
      WHERE o.is_active = 1
    `;
    const queryParams = [];

    if (category && category !== 'all') {
      query += ' AND o.category = ?';
      queryParams.push(category);
    }

    query += ' ORDER BY o.created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit));
    }

    const [offers] = await pool.execute(query, queryParams);

    res.json({
      success: true,
      data: offers,
      count: offers.length
    });

  } catch (error) {
    console.error('Get all offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error: error.message
    });
  }
});

// Create a new offer
router.post('/', authenticateStoreManager, [
  body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('subcategory').optional().trim(),
  body('original_price').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('offer_price').optional().isFloat({ min: 0 }).withMessage('Offer price must be a positive number'),
  body('discount_percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
  body('image_url').optional().isURL().withMessage('Valid image URL is required'),
  body('section_id').optional().isInt().withMessage('Valid section ID is required'),
  body('valid_from').optional().isISO8601().withMessage('Valid from date must be in ISO format'),
  body('valid_until').optional().isISO8601().withMessage('Valid until date must be in ISO format')
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

    const {
      title, description, category, subcategory, original_price, offer_price,
      discount_percentage, image_url, section_id, valid_from, valid_until
    } = req.body;

    // Convert undefined values to null for database insertion
    const cleanData = {
      title: title !== undefined ? title : null,
      description: description !== undefined ? description : null,
      category: category !== undefined ? category : null,
      subcategory: subcategory !== undefined ? subcategory : null,
      original_price: original_price !== undefined ? original_price : null,
      offer_price: offer_price !== undefined ? offer_price : null,
      discount_percentage: discount_percentage !== undefined ? discount_percentage : null,
      image_url: image_url !== undefined ? image_url : null,
      section_id: section_id !== undefined ? section_id : null,
      valid_from: valid_from !== undefined ? valid_from : null,
      valid_until: valid_until !== undefined ? valid_until : null
    };

    // Verify section belongs to the store if provided
    if (cleanData.section_id) {
      const [sections] = await pool.execute(
        'SELECT id FROM store_sections WHERE id = ? AND store_id = ?',
        [cleanData.section_id, req.user.storeId]
      );

      if (sections.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid section ID'
        });
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO offers (
        store_id, section_id, title, description, category, subcategory,
        original_price, offer_price, discount_percentage, image_url,
        valid_from, valid_until
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.storeId, cleanData.section_id, cleanData.title, cleanData.description,
        cleanData.category, cleanData.subcategory, cleanData.original_price, cleanData.offer_price,
        cleanData.discount_percentage, cleanData.image_url, cleanData.valid_from, cleanData.valid_until
      ]
    );

    const offerId = result.insertId;

    // Get the created offer
    const [offers] = await pool.execute(
      'SELECT * FROM offers WHERE id = ?',
      [offerId]
    );

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offers[0]
    });

  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create offer'
    });
  }
});

// Update an offer
router.put('/:offerId', authenticateStoreManager, [
  body('title').optional().trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('subcategory').optional().trim(),
  body('original_price').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('offer_price').optional().isFloat({ min: 0 }).withMessage('Offer price must be a positive number'),
  body('discount_percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
  body('image_url').optional().isURL().withMessage('Valid image URL is required'),
  body('section_id').optional().isInt().withMessage('Valid section ID is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
  body('valid_from').optional().isISO8601().withMessage('Valid from date must be in ISO format'),
  body('valid_until').optional().isISO8601().withMessage('Valid until date must be in ISO format')
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

    const { offerId } = req.params;
    const updateData = req.body;

    // Verify offer belongs to the store
    const [offers] = await pool.execute(
      'SELECT id FROM offers WHERE id = ? AND store_id = ?',
      [offerId, req.user.storeId]
    );

    if (offers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Verify section belongs to the store if provided
    if (updateData.section_id) {
      const [sections] = await pool.execute(
        'SELECT id FROM store_sections WHERE id = ? AND store_id = ?',
        [updateData.section_id, req.user.storeId]
      );

      if (sections.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid section ID'
        });
      }
    }

    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(offerId);

    await pool.execute(
      `UPDATE offers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Offer updated successfully'
    });

  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update offer'
    });
  }
});

// Toggle offer status
router.patch('/:offerId/toggle-status', authenticateStoreManager, async (req, res) => {
  try {
    const { offerId } = req.params;

    // Verify offer belongs to the store
    const [offers] = await pool.execute(
      'SELECT id, is_active FROM offers WHERE id = ? AND store_id = ?',
      [offerId, req.user.storeId]
    );

    if (offers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const currentStatus = offers[0].is_active;
    const newStatus = !currentStatus;

    await pool.execute(
      'UPDATE offers SET is_active = ? WHERE id = ?',
      [newStatus, offerId]
    );

    res.json({
      success: true,
      message: 'Offer status updated successfully',
      data: { is_active: newStatus }
    });

  } catch (error) {
    console.error('Toggle offer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update offer status'
    });
  }
});

// Delete an offer
router.delete('/:offerId', authenticateStoreManager, async (req, res) => {
  try {
    const { offerId } = req.params;

    // Verify offer belongs to the store
    const [offers] = await pool.execute(
      'SELECT id FROM offers WHERE id = ? AND store_id = ?',
      [offerId, req.user.storeId]
    );

    if (offers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await pool.execute(
      'DELETE FROM offers WHERE id = ?',
      [offerId]
    );

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });

  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete offer'
    });
  }
});

// Bulk import offers from Excel
router.post('/bulk-import', authenticateStoreManager, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is required'
      });
    }

    // Get section_id from form data
    const { section_id } = req.body;
    if (!section_id) {
      return res.status(400).json({
        success: false,
        message: 'Section selection is required for bulk upload'
      });
    }

    // Validate that the section belongs to the store
    const [sections] = await pool.execute(
      'SELECT id FROM store_sections WHERE id = ? AND store_id = ?',
      [section_id, req.user.storeId]
    );

    if (sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section selected'
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty'
      });
    }

    const requiredFields = ['title', 'category'];
    const optionalFields = ['description', 'subcategory', 'original_price', 'offer_price', 'discount_percentage', 'image_url'];

    const importedOffers = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // Excel rows start from 1, and we have header

      try {
        // Validate required fields
        for (const field of requiredFields) {
          if (!row[field]) {
            errors.push(`Row ${rowNumber}: ${field} is required`);
            continue;
          }
        }

        // Insert offer with section_id from form data
        const [result] = await pool.execute(
          `INSERT INTO offers (
            store_id, section_id, title, description, category, subcategory,
            original_price, offer_price, discount_percentage, image_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.user.storeId,
            section_id, // Use section_id from form data (selected by admin)
            row.title,
            row.description || null,
            row.category,
            row.subcategory || null,
            row.original_price || null,
            row.offer_price || null,
            row.discount_percentage || null,
            row.image_url || null
          ]
        );

        importedOffers.push({
          id: result.insertId,
          title: row.title,
          category: row.category
        });

      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Successfully imported ${importedOffers.length} offers`,
      data: {
        imported: importedOffers,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import offers'
    });
  }
});

// Get offer categories for a store
router.get('/categories', authenticateStoreManager, async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM offers WHERE store_id = ? AND category IS NOT NULL ORDER BY category',
      [req.user.storeId]
    );

    res.json({
      success: true,
      data: categories.map(cat => cat.category)
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router; 