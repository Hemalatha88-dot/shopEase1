const { pool } = require('../config/database');

// Sample sales data
const sampleSales = [
  {
    store_id: 1, // Make sure this store_id exists in your stores table
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '1234567890',
    sale_date: new Date('2025-08-10T10:30:00'),
    subtotal: 45.97,
    tax: 4.60,
    discount: 0,
    total_amount: 50.57,
    payment_method: 'card',
    payment_status: 'completed',
    items: [
      { product_name: 'T-Shirt', quantity: 2, price: 15.99 },
      { product_name: 'Jeans', quantity: 1, price: 29.99 }
    ]
  },
  {
    store_id: 1,
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    customer_phone: '0987654321',
    sale_date: new Date('2025-08-11T14:15:00'),
    subtotal: 89.97,
    tax: 9.00,
    discount: 10.00,
    total_amount: 88.97,
    payment_method: 'upi',
    payment_status: 'completed',
    items: [
      { product_name: 'Dress', quantity: 1, price: 49.99 },
      { product_name: 'Shoes', quantity: 1, price: 39.98 }
    ]
  },
  {
    store_id: 1,
    customer_name: 'Walk-in Customer',
    sale_date: new Date('2025-08-12T16:45:00'),
    subtotal: 24.99,
    tax: 2.50,
    discount: 0,
    total_amount: 27.49,
    payment_method: 'cash',
    payment_status: 'completed',
    items: [
      { product_name: 'Hat', quantity: 1, price: 24.99 }
    ]
  }
];

async function seedSalesData() {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // First, clear existing data (optional, comment out if you want to keep existing data)
    await connection.execute('DELETE FROM sale_items');
    await connection.execute('DELETE FROM sales');

    console.log('Seeding sales data...');

    for (const sale of sampleSales) {
      // Insert sale record
      const [saleResult] = await connection.execute(
        `INSERT INTO sales (
          store_id, customer_name, customer_email, customer_phone, 
          sale_date, subtotal, tax, discount, total_amount, 
          payment_method, payment_status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sale.store_id,
          sale.customer_name,
          sale.customer_email || null,
          sale.customer_phone || null,
          sale.sale_date,
          sale.subtotal,
          sale.tax || 0,
          sale.discount || 0,
          sale.total_amount,
          sale.payment_method,
          sale.payment_status || 'completed',
          sale.notes || null
        ]
      );

      const saleId = saleResult.insertId;

      // Insert sale items
      for (const item of sale.items) {
        await connection.execute(
          'INSERT INTO sale_items (sale_id, product_name, quantity, price) VALUES (?, ?, ?, ?)',
          [saleId, item.product_name, item.quantity, item.price]
        );
      }

      console.log(`✅ Added sale #${saleId} for ${sale.customer_name}`);
    }

    await connection.commit();
    console.log('✅ Sales data seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error seeding sales data:', error);
    throw error;
  } finally {
    connection.release();
    process.exit();
  }
}

// Run the seeder
seedSalesData().catch(console.error);
