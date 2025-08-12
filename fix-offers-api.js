// Quick fix for the offers API endpoint
const fs = require('fs');
const path = require('path');

const fixedOfferRoute = `
// Get public offers for a store (customers) - FIXED VERSION
router.get('/store/:storeId', optionalAuth, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { section_id, category, limit = 10 } = req.query;
    
    // Simple working query without parameter binding issues
    let baseQuery = \`
      SELECT o.id, o.title, o.description, o.category, o.subcategory,
             o.original_price, o.offer_price, o.discount_percentage,
             o.image_url, o.valid_from, o.valid_until, o.created_at,
             ss.name as section_name
      FROM offers o 
      LEFT JOIN store_sections ss ON o.section_id = ss.id 
      WHERE o.store_id = \${parseInt(storeId)} AND o.is_active = 1
    \`;

    if (section_id && !isNaN(section_id)) {
      baseQuery += \` AND o.section_id = \${parseInt(section_id)}\`;
    }
    
    if (category && category.trim()) {
      const safeCategory = category.replace(/['"\\\\]/g, '');
      baseQuery += \` AND o.category = '\${safeCategory}'\`;
    }

    baseQuery += \` ORDER BY o.created_at DESC LIMIT \${Math.min(parseInt(limit) || 10, 50)}\`;

    console.log('🔍 Executing offers query for store:', storeId);
    
    const connection = await pool.getConnection();
    const [offers] = await connection.query(baseQuery);
    connection.release();

    console.log(\`✅ Found \${offers.length} offers for store \${storeId}\`);

    res.json({
      success: true,
      data: offers,
      count: offers.length,
      store_id: parseInt(storeId)
    });

  } catch (error) {
    console.error('❌ Get public offers error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});
`;

console.log('🔧 Fixed offers API route created');
console.log('📋 To apply the fix:');
console.log('1. Replace the /store/:storeId route in routes/offers.js with the fixed version');
console.log('2. Restart the backend server');
console.log('3. Test: curl http://localhost:5000/api/offers/store/1');
