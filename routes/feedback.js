const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateStoreManager, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Existing routes...

// Get feedback for a store (store manager)
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10, rating_filter } = req.query;

    console.log('Fetching feedback for store:', storeId, 'with params:', { page, limit, rating_filter });

    // Validate storeId is a number
    const storeIdNum = parseInt(storeId, 10);
    if (isNaN(storeIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid store ID',
        details: 'Store ID must be a number'
      });
    }

    // Verify store exists
    try {
      const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeIdNum]);
      if (stores.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }
    } catch (storeError) {
      console.error('Error verifying store:', storeError);
      return res.status(500).json({
        success: false,
        message: 'Error verifying store',
        error: process.env.NODE_ENV === 'development' ? storeError.message : undefined
      });
    }

    // Convert query params to numbers with validation
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Build base query with parameter handling
    let query = `
      SELECT f.*, 
             c.name as customer_name, 
             c.email as customer_email,
             c.phone as customer_phone
      FROM feedback f
      LEFT JOIN customers c ON f.customer_id = c.id
      WHERE f.store_id = ?
    `;
    
    const queryParams = [storeIdNum];

    // Add rating filter if provided
    if (rating_filter) {
      const rating = parseInt(rating_filter, 10);
      if (![1, 2, 3, 4, 5].includes(rating)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid rating filter',
          details: 'Rating must be between 1 and 5'
        });
      }
      query += ' AND f.overall_rating = ?';
      queryParams.push(rating);
    }

    // Add sorting and pagination with parameter handling
    query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limitNum, offset);

    console.log('Executing query:', query);
    console.log('With params:', queryParams);

    let feedback = [];
    try {
      // Execute the query with parameter handling
      const [results] = await pool.query(query, queryParams);
      feedback = Array.isArray(results) ? results : [];
      console.log('Feedback query successful, rows:', feedback.length);
    } catch (queryError) {
      console.error('Error executing feedback query:', queryError);
      return res.status(500).json({
        success: false,
        message: 'Database query error',
        error: process.env.NODE_ENV === 'development' ? queryError.message : undefined,
        query: process.env.NODE_ENV === 'development' ? query : undefined
      });
    }

    // Get total count with direct value interpolation
    let countQuery = `SELECT COUNT(*) as total FROM feedback WHERE store_id = ${storeIdNum}`;
    
    if (rating_filter) {
      const rating = parseInt(rating_filter, 10);
      countQuery += ` AND overall_rating = ${rating}`;
    }

    let total = 0;
    try {
      const [countResult] = await pool.query(countQuery);
      total = countResult[0]?.total || 0;
      console.log('Total feedback count:', total);
    } catch (countError) {
      console.error('Error getting feedback count:', countError);
      console.error('Count query was:', countQuery);
      // Continue with total = 0 if count fails
    }

    // Format response
    res.json({
      success: true,
      data: feedback.map(fb => ({
        ...fb,
        // Ensure all expected fields are present
        customer_name: fb.customer_name || 'Anonymous',
        customer_email: fb.customer_email || '',
        customer_phone: fb.customer_phone || '',
        created_at: fb.created_at ? new Date(fb.created_at).toISOString() : new Date().toISOString()
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Export the router
module.exports = router;
