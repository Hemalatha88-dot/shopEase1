const mysql = require('mysql2');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Adharva@123',
  database: process.env.DB_NAME || 'shopease'
};

async function addSampleData() {
  const connection = mysql.createConnection(dbConfig);

  try {
    console.log('🔌 Connecting to MySQL database...');
    
    // Insert sample store
    await new Promise((resolve, reject) => {
      connection.query(`
        INSERT IGNORE INTO stores (id, name, description, address, phone, email, password) 
        VALUES (1, 'Demo SuperMart', 'Your friendly neighborhood supermarket with amazing deals and fresh products', '123 Main Street, Downtown', '+1-555-0123', 'info@demosupermart.com', '$2b$10$dummy.hash.for.demo.store.password')
      `, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    console.log('✅ Sample store added');

    // Insert sample sections
    const sections = [
      [1, 1, 'Electronics', 'Latest gadgets and electronics'],
      [2, 1, 'Groceries', 'Fresh fruits, vegetables and daily essentials'],
      [3, 1, 'Clothing', 'Fashion and apparel for all ages'],
      [4, 1, 'Home & Garden', 'Everything for your home and garden']
    ];

    for (const section of sections) {
      await new Promise((resolve, reject) => {
        connection.query(`
          INSERT IGNORE INTO store_sections (id, store_id, name, description) 
          VALUES (?, ?, ?, ?)
        `, section, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    console.log('✅ Sample sections added');

    // Insert sample offers
    const offers = [
      [1, 1, 1, 'Smartphone 50% Off', 'Latest Android smartphone with amazing features', 'Electronics', 'Smartphones', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 599.99, 299.99, 50, 1, '2024-12-31', '2025-01-31'],
      [2, 1, 1, 'Wireless Headphones Deal', 'Premium noise-canceling wireless headphones', 'Electronics', 'Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 199.99, 149.99, 25, 1, '2024-12-31', '2025-01-31'],
      [3, 1, 2, 'Fresh Fruits Bundle', 'Organic seasonal fruits basket', 'Groceries', 'Fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 29.99, 19.99, 33, 1, '2024-12-31', '2025-01-15'],
      [4, 1, 2, 'Dairy Products Combo', 'Fresh milk, cheese, and yogurt combo pack', 'Groceries', 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 24.99, 18.99, 24, 1, '2024-12-31', '2025-01-31'],
      [5, 1, 3, 'Winter Jacket Sale', 'Warm and stylish winter jackets for all', 'Clothing', 'Outerwear', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 89.99, 59.99, 33, 1, '2024-12-31', '2025-02-28'],
      [6, 1, 3, 'Sneakers Collection', 'Comfortable and trendy sneakers', 'Clothing', 'Footwear', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 79.99, 59.99, 25, 1, '2024-12-31', '2025-01-31'],
      [7, 1, 4, 'Garden Tools Set', 'Complete gardening tools for your garden', 'Home & Garden', 'Tools', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 149.99, 99.99, 33, 1, '2024-12-31', '2025-03-31'],
      [8, 1, 4, 'Indoor Plants Bundle', 'Beautiful indoor plants to brighten your home', 'Home & Garden', 'Plants', 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400', 49.99, 34.99, 30, 1, '2024-12-31', '2025-02-28']
    ];

    for (const offer of offers) {
      await new Promise((resolve, reject) => {
        connection.query(`
          INSERT IGNORE INTO offers (id, store_id, section_id, title, description, category, subcategory, image_url, original_price, offer_price, discount_percentage, is_active, valid_from, valid_until) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, offer, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    }
    console.log('✅ Sample offers added');

    console.log('🎉 Sample data added successfully!');
    console.log('📊 Added:');
    console.log('   - 1 Demo store');
    console.log('   - 4 Store sections');
    console.log('   - 8 Sample offers');
    console.log('🚀 You can now test the ShopEase application!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    connection.end();
    console.log('🔌 Database connection closed');
  }
}

addSampleData();
