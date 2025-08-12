const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Adharva@123',
  database: process.env.DB_NAME || 'shopease'
};

console.log('🔧 Testing database connection...');
console.log('📊 Config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? '***' : 'not set'
});

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Database connected successfully');
  
  // Test the offers query
  connection.query('SELECT COUNT(*) as count FROM offers WHERE store_id = 1 AND is_active = 1', (err, results) => {
    if (err) {
      console.error('❌ Query failed:', err.message);
    } else {
      console.log('✅ Query successful:', results);
    }
    
    connection.end();
  });
});
