const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Adharva@123',
  database: process.env.DB_NAME || 'shopease'
};

async function createUsersTable() {
  const connection = mysql.createConnection(dbConfig);

  try {
    console.log('🔌 Connecting to MySQL database...');
    
    // Create users table for shopper authentication
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          mobile VARCHAR(20) UNIQUE NOT NULL,
          email VARCHAR(255),
          is_verified BOOLEAN DEFAULT FALSE,
          otp_verified_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    console.log('✅ Users table created successfully');

    // Add some sample users for testing
    const sampleUsers = [
      ['John Doe', '+1-555-0101', 'john@example.com', true],
      ['Jane Smith', '+1-555-0102', 'jane@example.com', true],
      ['Mike Johnson', '+1-555-0103', 'mike@example.com', false]
    ];

    for (const user of sampleUsers) {
      await new Promise((resolve, reject) => {
        connection.query(`
          INSERT IGNORE INTO users (name, mobile, email, is_verified) 
          VALUES (?, ?, ?, ?)
        `, user, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    console.log('✅ Sample users added');

    console.log('🎉 Users table setup completed successfully!');
    console.log('📋 Features:');
    console.log('   - User registration and OTP verification');
    console.log('   - Static OTP: 1234 for all verifications');
    console.log('   - Mobile number uniqueness enforced');
    console.log('   - Verification status tracking');

  } catch (error) {
    console.error('❌ Error creating users table:', error);
  } finally {
    connection.end();
    console.log('🔌 Database connection closed');
  }
}

createUsersTable();
