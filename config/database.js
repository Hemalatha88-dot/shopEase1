const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Adharva@123',
  database: process.env.DB_NAME || 'shopease',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create stores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        qr_code_main VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create store_sections table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS store_sections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        store_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        qr_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);

    // Create offers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS offers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        store_id INT NOT NULL,
        section_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        original_price DECIMAL(10,2),
        offer_price DECIMAL(10,2),
        discount_percentage INT,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        valid_from DATE,
        valid_until DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES store_sections(id) ON DELETE SET NULL
      )
    `);

    // Create customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create qr_scans table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS qr_scans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        store_id INT NOT NULL,
        section_id INT,
        customer_id INT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES store_sections(id) ON DELETE SET NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
      )
    `);

    // Create feedback table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT PRIMARY KEY AUTO_INCREMENT,
        store_id INT NOT NULL,
        customer_id INT,
        overall_rating INT,
        service_rating INT,
        product_rating INT,
        cleanliness_rating INT,
        value_rating INT,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
      )
    `);

    // Create sales_data table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sales_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        store_id INT NOT NULL,
        date DATE NOT NULL,
        total_sales DECIMAL(12,2),
        total_orders INT,
        average_order_value DECIMAL(10,2),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);

    // Create otp_verification table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS otp_verification (
        id INT PRIMARY KEY AUTO_INCREMENT,
        phone VARCHAR(20) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 