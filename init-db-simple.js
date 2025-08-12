const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Adharva@123'
};

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL server...');
    
    // Connect to MySQL server (without specifying database)
    connection = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const databaseName = process.env.DB_NAME || 'shopease';
    console.log(`📦 Creating database '${databaseName}' if it doesn't exist...`);
    
    await new Promise((resolve, reject) => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log(`✅ Database '${databaseName}' is ready`);

    // Use the database
    await new Promise((resolve, reject) => {
      connection.query(`USE ${databaseName}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create tables
    console.log('🏗️  Creating database tables...');

    // Stores table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS stores (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          qr_code_main VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Stores table created');

    // Store sections table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS store_sections (
          id INT PRIMARY KEY AUTO_INCREMENT,
          store_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          qr_code VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Store sections table created');

    // Offers table
    await new Promise((resolve, reject) => {
      connection.query(`
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
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Offers table created');

    // Customers table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20) UNIQUE NOT NULL,
          is_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Customers table created');

    // QR scans table
    await new Promise((resolve, reject) => {
      connection.query(`
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
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ QR scans table created');

    // Feedback table
    await new Promise((resolve, reject) => {
      connection.query(`
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
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Feedback table created');

    // Sales data table
    await new Promise((resolve, reject) => {
      connection.query(`
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
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Sales data table created');

    // OTP verification table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS otp_verification (
          id INT PRIMARY KEY AUTO_INCREMENT,
          phone VARCHAR(20) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          is_used BOOLEAN DEFAULT FALSE,
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ OTP verification table created');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log(`📊 Database: ${databaseName}`);
    console.log(`🔗 Host: ${dbConfig.host}`);
    console.log(`👤 User: ${dbConfig.user}`);
    console.log('\n🚀 You can now start the ShopEase application!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the initialization
initializeDatabase(); 