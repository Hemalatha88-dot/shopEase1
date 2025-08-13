const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateStoreManager } = require('../middleware/auth');

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

// Get all sales for a store (store manager)
router.get('/', authenticateStoreManager, async (req, res) => {
  try {
    const { start_date, end_date, payment_method } = req.query;
    
    let query = `
      SELECT s.*, 
             GROUP_CONCAT(si.product_name) as product_names,
             GROUP_CONCAT(si.quantity) as quantities,
             GROUP_CONCAT(si.price) as prices
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.store_id = ?
    `;
    
    const queryParams = [req.user.storeId];

    if (start_date) {
      query += ' AND s.sale_date >= ?';
      queryParams.push(start_date);
    }
    
    if (end_date) {
      query += ' AND s.sale_date <= ?';
      queryParams.push(end_date);
    }
    
    if (payment_method) {
      query += ' AND s.payment_method = ?';
      queryParams.push(payment_method);
    }

    query += ' GROUP BY s.id ORDER BY s.sale_date DESC, s.created_at DESC';

    const [sales] = await pool.execute(query, queryParams);

    // Process the results to format items as an array of objects
    const formattedSales = sales.map(sale => ({
      ...sale,
      items: sale.product_names ? sale.product_names.split(',').map((name, index) => ({
        product_name: name,
        quantity: parseInt(sale.quantities.split(',')[index]),
        price: parseFloat(sale.prices.split(',')[index])
      })) : []
    }));

    res.json({
      success: true,
      data: formattedSales
    });

  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales data'
    });
  }
});

// Get a single sale by ID
router.get('/:saleId', authenticateStoreManager, async (req, res) => {
  try {
    const { saleId } = req.params;
    
    const [sales] = await pool.execute(
      `SELECT s.*, 
              si.product_name, 
              si.quantity, 
              si.price
       FROM sales s
       LEFT JOIN sale_items si ON s.id = si.sale_id
       WHERE s.id = ? AND s.store_id = ?`,
      [saleId, req.user.storeId]
    );

    if (sales.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Group items by sale
    const sale = {
      id: sales[0].id,
      store_id: sales[0].store_id,
      customer_name: sales[0].customer_name,
      customer_email: sales[0].customer_email,
      customer_phone: sales[0].customer_phone,
      sale_date: sales[0].sale_date,
      subtotal: sales[0].subtotal,
      tax: sales[0].tax,
      discount: sales[0].discount,
      total_amount: sales[0].total_amount,
      payment_method: sales[0].payment_method,
      payment_status: sales[0].payment_status,
      notes: sales[0].notes,
      created_at: sales[0].created_at,
      items: sales[0].product_name ? sales.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price
      })) : []
    };

    res.json({
      success: true,
      data: sale
    });

  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sale details'
    });
  }
});

// Create a new sale
router.post('/', [
  authenticateStoreManager,
  body('customer_name').optional().trim(),
  body('customer_email').optional().isEmail().withMessage('Invalid email format'),
  body('customer_phone').optional().trim(),
  body('sale_date').optional().isISO8601().withMessage('Invalid date format'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a positive number'),
  body('tax').isFloat({ min: 0 }).default(0),
  body('discount').isFloat({ min: 0 }).default(0),
  body('total_amount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('payment_method').isIn(['cash', 'card', 'upi', 'other']).withMessage('Invalid payment method'),
  body('payment_status').isIn(['pending', 'completed', 'failed', 'refunded']).default('completed'),
  body('notes').optional().trim(),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product_name').notEmpty().withMessage('Product name is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
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
      customer_name,
      customer_email,
      customer_phone,
      sale_date,
      subtotal,
      tax,
      discount,
      total_amount,
      payment_method,
      payment_status,
      notes,
      items
    } = req.body;

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert sale record
      const [saleResult] = await connection.execute(
        `INSERT INTO sales (
          store_id, customer_name, customer_email, customer_phone, 
          sale_date, subtotal, tax, discount, total_amount, 
          payment_method, payment_status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.storeId,
          customer_name || null,
          customer_email || null,
          customer_phone || null,
          sale_date || new Date(),
          subtotal,
          tax || 0,
          discount || 0,
          total_amount,
          payment_method,
          payment_status || 'completed',
          notes || null
        ]
      );

      const saleId = saleResult.insertId;

      // Insert sale items
      for (const item of items) {
        await connection.execute(
          'INSERT INTO sale_items (sale_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
          [saleId, item.product_name, item.quantity, item.price]
        );
      }

      // Commit the transaction
      await connection.commit();

      // Get the complete sale record
      const [sale] = await pool.execute(
        'SELECT * FROM sales WHERE id = ?',
        [saleId]
      );

      res.status(201).json({
        success: true,
        message: 'Sale recorded successfully',
        data: sale[0]
      });

    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record sale',
      error: error.message
    });
  }
});

// Upload sales data from Excel
router.post('/upload', authenticateStoreManager, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is required'
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

    // Validate required fields
    const requiredFields = ['sale_date', 'product_name', 'quantity', 'price'];
    const missingFields = requiredFields.filter(field => !data[0].hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Group items by sale (assuming a sale is identified by sale_date and customer)
    const salesMap = new Map();
    
    for (const row of data) {
      const saleKey = `${row.sale_date}_${row.customer_phone || 'unknown'}`;
      
      if (!salesMap.has(saleKey)) {
        salesMap.set(saleKey, {
          sale_date: row.sale_date,
          customer_name: row.customer_name || 'Walk-in Customer',
          customer_email: row.customer_email || null,
          customer_phone: row.customer_phone || null,
          payment_method: row.payment_method || 'cash',
          payment_status: row.payment_status || 'completed',
          notes: row.notes || null,
          items: []
        });
      }
      
      salesMap.get(saleKey).items.push({
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price
      });
    }

    // Process each sale
    const results = {
      imported: [],
      failed: []
    };

    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Process each sale in a transaction
      for (const [key, saleData] of salesMap.entries()) {
        await connection.beginTransaction();
        
        try {
          // Calculate subtotal, tax, discount, total
          const subtotal = saleData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
          const tax = subtotal * 0.1; // 10% tax for example
          const total = subtotal + tax;
          
          // Insert sale record
          const [saleResult] = await connection.execute(
            `INSERT INTO sales (
              store_id, customer_name, customer_email, customer_phone, 
              sale_date, subtotal, tax, total_amount, 
              payment_method, payment_status, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              req.user.storeId,
              saleData.customer_name,
              saleData.customer_email,
              saleData.customer_phone,
              saleData.sale_date,
              subtotal,
              tax,
              total,
              saleData.payment_method,
              saleData.payment_status,
              saleData.notes
            ]
          );
          
          const saleId = saleResult.insertId;
          
          // Insert sale items
          for (const item of saleData.items) {
            await connection.execute(
              'INSERT INTO sale_items (sale_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
              [saleId, item.product_name, item.quantity, item.price]
            );
          }
          
          await connection.commit();
          
          results.imported.push({
            sale_id: saleId,
            sale_date: saleData.sale_date,
            customer: saleData.customer_name,
            total: total
          });
          
        } catch (error) {
          await connection.rollback();
          console.error(`Failed to import sale ${key}:`, error);
          results.failed.push({
            key,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Successfully imported ${results.imported.length} sales`,
        data: results
      });
      
    } catch (error) {
      console.error('Import sales error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to import sales data',
        error: error.message
      });
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
    
  } catch (error) {
    console.error('Upload sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process upload',
      error: error.message
    });
  }
});

// Export sales data to Excel
router.get('/export', authenticateStoreManager, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        s.id as sale_id,
        s.sale_date,
        s.customer_name,
        s.customer_email,
        s.customer_phone,
        si.product_name,
        si.quantity,
        si.price,
        (si.quantity * si.price) as item_total,
        s.subtotal,
        s.tax,
        s.discount,
        s.total_amount,
        s.payment_method,
        s.payment_status,
        s.notes,
        s.created_at
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.store_id = ?
    `;
    
    const queryParams = [req.user.storeId];
    
    if (start_date) {
      query += ' AND s.sale_date >= ?';
      queryParams.push(start_date);
    }
    
    if (end_date) {
      query += ' AND s.sale_date <= ?';
      queryParams.push(end_date);
    }
    
    query += ' ORDER BY s.sale_date DESC, s.id, si.id';
    
    const [sales] = await pool.execute(query, queryParams);
    
    if (sales.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No sales data found for the selected period'
      });
    }
    
    // Convert to Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sales);
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    
    // Generate buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
    // Set headers for file download
    const fileName = `sales_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Send the file
    res.send(excelBuffer);
    
  } catch (error) {
    console.error('Export sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export sales data',
      error: error.message
    });
  }
});

module.exports = router;
