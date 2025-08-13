const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
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

// Track QR scan
router.post('/qr-scan', async (req, res) => {
  try {
    const { store_id, section_id, customer_id } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    // Verify store exists
    const [stores] = await pool.execute(
      'SELECT id FROM stores WHERE id = ?',
      [store_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Verify section belongs to store if provided
    if (section_id) {
      const [sections] = await pool.execute(
        'SELECT id FROM store_sections WHERE id = ? AND store_id = ?',
        [section_id, store_id]
      );

      if (sections.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid section ID'
        });
      }
    }

    // Insert QR scan record
    await pool.execute(
      'INSERT INTO qr_scans (store_id, section_id, customer_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [store_id, section_id || null, customer_id || null, ip_address, user_agent]
    );

    res.json({
      success: true,
      message: 'QR scan tracked successfully'
    });

  } catch (error) {
    console.error('Track QR scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track QR scan'
    });
  }
});

// Upload sales data
router.post('/sales-upload', authenticateStoreManager, upload.single('file'), async (req, res) => {
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

    const requiredFields = ['date', 'total_sales'];
    const optionalFields = ['total_orders', 'average_order_value'];

    const importedSales = [];
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

        // Validate date format
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${rowNumber}: Invalid date format`);
          continue;
        }

        // Check if sales data already exists for this date
        const [existingSales] = await pool.execute(
          'SELECT id FROM sales_data WHERE store_id = ? AND date = ?',
          [req.user.storeId, row.date]
        );

        if (existingSales.length > 0) {
          errors.push(`Row ${rowNumber}: Sales data already exists for this date`);
          continue;
        }

        // Insert sales data
        const [result] = await pool.execute(
          `INSERT INTO sales_data (
            store_id, date, total_sales, total_orders, average_order_value
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            req.user.storeId,
            row.date,
            row.total_sales,
            row.total_orders || null,
            row.average_order_value || null
          ]
        );

        importedSales.push({
          id: result.insertId,
          date: row.date,
          total_sales: row.total_sales
        });

      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Successfully imported ${importedSales.length} sales records`,
      data: {
        imported: importedSales,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Sales upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload sales data'
    });
  }
});

// Get analytics dashboard data
router.get('/dashboard', authenticateStoreManager, async (req, res) => {
  console.log('Dashboard request received:', { query: req.query, user: req.user });
  try {
    const { start_date, end_date } = req.query;
    const storeId = req.user.storeId;

    // Build date filter
    let dateFilter = '';
    const dateParams = [];
    if (start_date && end_date) {
      dateFilter = 'AND DATE(created_at) BETWEEN ? AND ?';
      dateParams.push(start_date, end_date);
    } else if (start_date) {
      dateFilter = 'AND DATE(created_at) >= ?';
      dateParams.push(start_date);
    } else if (end_date) {
      dateFilter = 'AND DATE(created_at) <= ?';
      dateParams.push(end_date);
    }

    // QR Scan Analytics
    console.log('Fetching QR scan analytics...');
    let qrScanQuery = `
      SELECT 
        COUNT(*) as total_scans,
        COUNT(DISTINCT DATE(scan_time)) as scan_days,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(DISTINCT customer_id) as authenticated_scans
      FROM qr_scans 
      WHERE store_id = ?
    `;

    // Add date filter if provided
    if (dateFilter) {
      qrScanQuery += ` AND DATE(scan_time) BETWEEN ? AND ?`;
    }

    console.log('Executing QR scan query:', qrScanQuery, { storeId, dateFilter, dateParams });
    let qrScanStats;
    try {
      [qrScanStats] = await pool.execute(
        qrScanQuery,
        dateFilter ? [storeId, ...dateParams] : [storeId]
      );
      console.log('QR scan query results:', qrScanStats);
    } catch (dbError) {
      console.error('Database error in QR scan query:', dbError);
      throw dbError;
    }

    // Section-wise QR scans
    let sectionScansQuery = `
      SELECT 
        ss.name as section_name,
        COUNT(qs.id) as scan_count
      FROM store_sections ss
      LEFT JOIN qr_scans qs ON ss.id = qs.section_id 
      WHERE ss.store_id = ?
    `;

    // Add date filter if provided
    if (dateFilter) {
      sectionScansQuery += ` AND DATE(qs.scan_time) BETWEEN ? AND ?`;
    }

    sectionScansQuery += `
      GROUP BY ss.id, ss.name
      ORDER BY scan_count DESC
    `;

    const [sectionScans] = await pool.execute(
      sectionScansQuery,
      dateFilter ? [storeId, ...dateParams] : [storeId]
    );

    // Hourly scan distribution
    let hourlyScansQuery = `
      SELECT 
        HOUR(scan_time) as hour,
        COUNT(*) as scan_count
      FROM qr_scans 
      WHERE store_id = ?
    `;

    // Add date filter if provided
    if (dateFilter) {
      hourlyScansQuery += ` AND DATE(scan_time) BETWEEN ? AND ?`;
    }

    hourlyScansQuery += `
      GROUP BY HOUR(scan_time)
      ORDER BY hour
    `;

    const [hourlyScans] = await pool.execute(
      hourlyScansQuery,
      dateFilter ? [storeId, ...dateParams] : [storeId]
    );

    // Sales Analytics
    const [salesStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_days,
        SUM(total_sales) as total_revenue,
        AVG(total_sales) as avg_daily_sales,
        SUM(total_orders) as total_orders,
        AVG(average_order_value) as avg_order_value
      FROM sales_data 
      WHERE store_id = ? ${dateFilter}`,
      [storeId, ...dateParams]
    );

    // Daily sales trend
    const [dailySales] = await pool.execute(
      `SELECT 
        date,
        total_sales,
        total_orders,
        average_order_value
      FROM sales_data 
      WHERE store_id = ? ${dateFilter}
      ORDER BY date DESC
      LIMIT 30`,
      [storeId, ...dateParams]
    );

    // Conversion rate (scans vs sales)
    const [conversionData] = await pool.execute(
      `SELECT 
        DATE(qs.scan_time) as date,
        COUNT(DISTINCT qs.ip_address) as daily_scans,
        COALESCE(sd.total_sales, 0) as daily_sales
      FROM qr_scans qs
      LEFT JOIN sales_data sd ON DATE(qs.scan_time) = sd.date AND sd.store_id = qs.store_id
      WHERE qs.store_id = ? ${dateFilter}
      GROUP BY DATE(qs.scan_time)
      ORDER BY date DESC
      LIMIT 30`,
      [storeId, ...dateParams]
    );

    // Feedback Analytics
    const [feedbackStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_feedback,
        AVG(overall_rating) as avg_rating,
        COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive_feedback,
        COUNT(CASE WHEN overall_rating <= 2 THEN 1 END) as negative_feedback
      FROM feedback 
      WHERE store_id = ? ${dateFilter}`,
      [storeId, ...dateParams]
    );

    // Calculate conversion rate
    const totalScans = qrScanStats[0].total_scans;
    const totalRevenue = salesStats[0].total_revenue || 0;
    const conversionRate = totalScans > 0 ? (totalRevenue / totalScans * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        qrScans: {
          summary: qrScanStats[0],
          sectionBreakdown: sectionScans,
          hourlyDistribution: hourlyScans
        },
        sales: {
          summary: salesStats[0],
          dailyTrend: dailySales
        },
        conversion: {
          rate: conversionRate,
          dailyData: conversionData
        },
        feedback: feedbackStats[0]
      }
    });

  } catch (error) {
    console.error('Get analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Get QR scan analytics
router.get('/qr-scans', authenticateStoreManager, async (req, res) => {
  try {
    const { start_date, end_date, section_id } = req.query;
    const storeId = req.user.storeId;

    let query = `
      SELECT 
        qs.*,
        ss.name as section_name,
        c.name as customer_name
      FROM qr_scans qs
      LEFT JOIN store_sections ss ON qs.section_id = ss.id
      LEFT JOIN customers c ON qs.customer_id = c.id
      WHERE qs.store_id = ?
    `;
    const queryParams = [storeId];

    if (start_date && end_date) {
      query += ' AND DATE(qs.scan_time) BETWEEN ? AND ?';
      queryParams.push(start_date, end_date);
    }
    if (section_id) {
      query += ' AND qs.section_id = ?';
      queryParams.push(section_id);
    }

    query += ' ORDER BY qs.scan_time DESC LIMIT 100';

    const [scans] = await pool.execute(query, queryParams);

    res.json({
      success: true,
      data: scans
    });

  } catch (error) {
    console.error('Get QR scans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch QR scan data'
    });
  }
});

// Get sales analytics
router.get('/sales', authenticateStoreManager, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const storeId = req.user.storeId;

    let query = `
      SELECT *
      FROM sales_data
      WHERE store_id = ?
    `;
    const queryParams = [storeId];

    if (start_date && end_date) {
      query += ' AND date BETWEEN ? AND ?';
      queryParams.push(start_date, end_date);
    }

    query += ' ORDER BY date DESC';

    const [sales] = await pool.execute(query, queryParams);

    res.json({
      success: true,
      data: sales
    });

  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales data'
    });
  }
});

// Export analytics data
router.get('/export', authenticateStoreManager, async (req, res) => {
  try {
    const { start_date, end_date, type } = req.query;
    const storeId = req.user.storeId;

    let data = [];

    switch (type) {
      case 'qr_scans':
        let scanQuery = `
          SELECT 
            qs.scan_time,
            ss.name as section_name,
            c.name as customer_name,
            c.email as customer_email,
            qs.ip_address
          FROM qr_scans qs
          LEFT JOIN store_sections ss ON qs.section_id = ss.id
          LEFT JOIN customers c ON qs.customer_id = c.id
          WHERE qs.store_id = ?
        `;
        const scanParams = [storeId];

        if (start_date && end_date) {
          scanQuery += ' AND DATE(qs.scan_time) BETWEEN ? AND ?';
          scanParams.push(start_date, end_date);
        }

        scanQuery += ' ORDER BY qs.scan_time DESC';

        const [scans] = await pool.execute(scanQuery, scanParams);
        data = scans.map(scan => ({
          'Scan Time': new Date(scan.scan_time).toLocaleString(),
          'Section': scan.section_name || 'Main Store',
          'Customer Name': scan.customer_name || 'Anonymous',
          'Customer Email': scan.customer_email || 'N/A',
          'IP Address': scan.ip_address
        }));
        break;

      case 'sales':
        let salesQuery = `
          SELECT *
          FROM sales_data
          WHERE store_id = ?
        `;
        const salesParams = [storeId];

        if (start_date && end_date) {
          salesQuery += ' AND date BETWEEN ? AND ?';
          salesParams.push(start_date, end_date);
        }

        salesQuery += ' ORDER BY date DESC';

        const [sales] = await pool.execute(salesQuery, salesParams);
        data = sales.map(sale => ({
          'Date': sale.date,
          'Total Sales': sale.total_sales,
          'Total Orders': sale.total_orders || 'N/A',
          'Average Order Value': sale.average_order_value || 'N/A'
        }));
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type. Use "qr_scans" or "sales"'
        });
    }

    res.json({
      success: true,
      message: 'Analytics data ready for export',
      data: data
    });

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics data'
    });
  }
});

module.exports = router; 