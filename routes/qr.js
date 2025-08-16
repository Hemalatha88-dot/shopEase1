// const express = require('express');
// const QRCode = require('qrcode');
// const { pool } = require('../config/database');
// const { authenticateToken, authenticateStoreManager } = require('../middleware/auth');
// const router = express.Router();

// // const router = express.Router();

// // // Generate QR code for store
// // router.post('/store/:storeId', async (req, res) => {
// //   try {
// //     const { storeId } = req.params;
// //     const { size = 300, margin = 2 } = req.query;

// //     // Verify store exists
// //     const [stores] = await pool.execute(
// //       'SELECT id, name FROM stores WHERE id = ?',
// //       [storeId]
// //     );

// //     if (stores.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Store not found'
// //       });
// //     }

// //     const store = stores[0];
// //     // Ensure we have a valid frontend URL
// //     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
// //     const qrData = `${frontendUrl}/store/${storeId}`;
// //     console.log('Generating QR code with URL:', qrData); // Debug log

// //     // Generate QR code
// //     const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
// //       width: parseInt(size),
// //       margin: parseInt(margin),
// //       color: {
// //         dark: '#000000',
// //         light: '#FFFFFF'
// //       }
// //     });

// //     // Update store with QR code
// //     await pool.execute(
// //       'UPDATE stores SET qr_code_main = ? WHERE id = ?',
// //       [qrCodeDataUrl, storeId]
// //     );

// //     res.json({
// //       success: true,
// //       message: 'QR code generated successfully',
// //       data: {
// //         storeId: store.id,
// //         storeName: store.name,
// //         qrCode: qrCodeDataUrl,
// //         qrData: qrData
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Generate store QR code error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate QR code'
// //     });
// //   }
// // });

// // // Generate QR code for store section
// // router.post('/section/:sectionId', authenticateStoreManager, async (req, res) => {
// //   try {
// //     const { sectionId } = req.params;
// //     const { size = 300, margin = 2 } = req.query;

// //     // Verify section belongs to the store
// //     const [sections] = await pool.execute(
// //       'SELECT id, name, store_id FROM store_sections WHERE id = ? AND store_id = ?',
// //       [sectionId, req.user.storeId]
// //     );

// //     if (sections.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Section not found'
// //       });
// //     }

// //     const section = sections[0];
// //     const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/store/${section.store_id}/section/${sectionId}`;

// //     // Generate QR code
// //     const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
// //       width: parseInt(size),
// //       margin: parseInt(margin),
// //       color: {
// //         dark: '#000000',
// //         light: '#FFFFFF'
// //       }
// //     });

// //     // Update section with QR code
// //     await pool.execute(
// //       'UPDATE store_sections SET qr_code = ? WHERE id = ?',
// //       [qrCodeDataUrl, sectionId]
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Section QR code generated successfully',
// //       data: {
// //         sectionId: section.id,
// //         sectionName: section.name,
// //         storeId: section.store_id,
// //         qrCode: qrCodeDataUrl,
// //         qrData: qrData
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Generate section QR code error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate QR code'
// //     });
// //   }
// // });

// // // Get all QR codes for a store
// // router.get('/store/:storeId', authenticateStoreManager, async (req, res) => {
// //   try {
// //     const { storeId } = req.params;

// //     // Verify store ownership
// //     if (parseInt(storeId) !== req.user.storeId) {
// //       return res.status(403).json({
// //         success: false,
// //         message: 'Access denied'
// //       });
// //     }

// //     // Get store QR code
// //     const [stores] = await pool.execute(
// //       'SELECT id, name, qr_code_main FROM stores WHERE id = ?',
// //       [storeId]
// //     );

// //     // Get section QR codes
// //     const [sections] = await pool.execute(
// //       'SELECT id, name, qr_code FROM store_sections WHERE store_id = ?',
// //       [storeId]
// //     );

// //     res.json({
// //       success: true,
// //       data: {
// //         store: stores[0],
// //         sections: sections
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Get QR codes error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch QR codes'
// //     });
// //   }
// // });

// // // Generate QR code for feedback
// // router.post('/feedback/:storeId', async (req, res) => {
// //   try {
// //     const { storeId } = req.params;
// //     const { size = 300, margin = 2 } = req.query;

// //     // Verify store exists
// //     const [stores] = await pool.execute(
// //       'SELECT id, name FROM stores WHERE id = ?',
// //       [storeId]
// //     );

// //     if (stores.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Store not found'
// //       });
// //     }

// //     const store = stores[0];
// //     const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/feedback/${storeId}`;

// //     // Generate QR code
// //     const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
// //       width: parseInt(size),
// //       margin: parseInt(margin),
// //       color: {
// //         dark: '#000000',
// //         light: '#FFFFFF'
// //       }
// //     });

// //     res.json({
// //       success: true,
// //       message: 'Feedback QR code generated successfully',
// //       data: {
// //         storeId: store.id,
// //         storeName: store.name,
// //         qrCode: qrCodeDataUrl,
// //         qrData: qrData
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Generate feedback QR code error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate QR code'
// //     });
// //   }
// // });

// // // Bulk generate QR codes for all sections
// // router.post('/bulk-generate/:storeId', authenticateStoreManager, async (req, res) => {
// //   try {
// //     const { storeId } = req.params;
// //     const { size = 300, margin = 2 } = req.query;

// //     // Verify store ownership
// //     if (parseInt(storeId) !== req.user.storeId) {
// //       return res.status(403).json({
// //         success: false,
// //         message: 'Access denied'
// //       });
// //     }

// //     // Get all sections for the store
// //     const [sections] = await pool.execute(
// //       'SELECT id, name FROM store_sections WHERE store_id = ?',
// //       [storeId]
// //     );

// //     const generatedQRCodes = [];

// //     // Generate QR codes for each section
// //     for (const section of sections) {
// //       const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/store/${storeId}/section/${section.id}`;

// //       const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
// //         width: parseInt(size),
// //         margin: parseInt(margin),
// //         color: {
// //           dark: '#000000',
// //           light: '#FFFFFF'
// //         }
// //       });

// //       // Update section with QR code
// //       await pool.execute(
// //         'UPDATE store_sections SET qr_code = ? WHERE id = ?',
// //         [qrCodeDataUrl, section.id]
// //       );

// //       generatedQRCodes.push({
// //         sectionId: section.id,
// //         sectionName: section.name,
// //         qrCode: qrCodeDataUrl,
// //         qrData: qrData
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       message: `Generated QR codes for ${generatedQRCodes.length} sections`,
// //       data: generatedQRCodes
// //     });

// //   } catch (error) {
// //     console.error('Bulk generate QR codes error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate QR codes'
// //     });
// //   }
// // });

// // // Download QR code as PNG
// // router.get('/download/:type/:id', async (req, res) => {
// //   try {
// //     const { type, id } = req.params;
// //     const { size = 300, margin = 2 } = req.query;

// //     let qrData = '';
// //     let filename = '';

// //     switch (type) {
// //       case 'store':
// //         const [stores] = await pool.execute(
// //           'SELECT id, name FROM stores WHERE id = ?',
// //           [id]
// //         );

// //         if (stores.length === 0) {
// //           return res.status(404).json({
// //             success: false,
// //             message: 'Store not found'
// //           });
// //         }

// //         qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/store/${id}`;
// //         filename = `store_${id}_qr.png`;
// //         break;

// //       case 'section':
// //         const [sections] = await pool.execute(
// //           'SELECT id, name, store_id FROM store_sections WHERE id = ?',
// //           [id]
// //         );

// //         if (sections.length === 0) {
// //           return res.status(404).json({
// //             success: false,
// //             message: 'Section not found'
// //           });
// //         }

// //         qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/store/${sections[0].store_id}/section/${id}`;
// //         filename = `section_${id}_qr.png`;
// //         break;

// //       case 'feedback':
// //         const [feedbackStores] = await pool.execute(
// //           'SELECT id, name FROM stores WHERE id = ?',
// //           [id]
// //         );

// //         if (feedbackStores.length === 0) {
// //           return res.status(404).json({
// //             success: false,
// //             message: 'Store not found'
// //           });
// //         }

// //         qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/feedback/${id}`;
// //         filename = `feedback_${id}_qr.png`;
// //         break;

// //       default:
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Invalid QR code type'
// //         });
// //     }

// //     // Generate QR code as buffer
// //     const qrBuffer = await QRCode.toBuffer(qrData, {
// //       width: parseInt(size),
// //       margin: parseInt(margin),
// //       color: {
// //         dark: '#000000',
// //         light: '#FFFFFF'
// //       }
// //     });

// //     // Set response headers for download
// //     res.setHeader('Content-Type', 'image/png');
// //     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
// //     res.setHeader('Content-Length', qrBuffer.length);

// //     res.send(qrBuffer);

// //   } catch (error) {
// //     console.error('Download QR code error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate QR code for download'
// //     });
// //   }
// // });

// // module.exports = router; 





// // Generate main store QR
// // router.post('/store/:storeId/generate-main', authenticateStoreManager, async (req, res) => {
// //   try {
// //     const { storeId } = req.params;
// //     const storeUrl = `${process.env.FRONTEND_URL}/store/${storeId}`;
    
// //     // Generate QR code
// //     const qrCode = await QRCode.toDataURL(storeUrl);
    
// //     // Save to database
// //     await pool.query(
// //       'UPDATE stores SET qr_code_main = ? WHERE id = ?',
// //       [qrCode, storeId]
// //     );
    
// //     res.json({
// //       success: true,
// //       data: { qr_code: qrCode }
// //     });
// //   } catch (error) {
// //     console.error('Generate main QR error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate main store QR code'
// //     });
// //   }
// // });


// // router.post('/store/:storeId/generate-main', authenticateStoreManager, async (req, res) => {
// //   try {
// //     const { storeId } = req.params;
// //     const storeUrl = `${process.env.FRONTEND_URL}/store/${storeId}`;
// //     const qrCode = await QRCode.toDataURL(storeUrl);
    
// //     await pool.query(
// //       'UPDATE stores SET qr_code_main = ? WHERE id = ?',
// //       [qrCode, storeId]
// //     );
    
// //     res.json({ success: true, data: { qr_code: qrCode } });
// //   } catch (error) {
// //     console.error('Error:', error);
// //     res.status(500).json({ success: false, message: 'Failed to generate QR' });
// //   }
// // });


// // Generate main store QR code
// router.post('/store/:storeId/generate-main', authenticateToken, async (req, res) => {
//   try {
//     const { storeId } = req.params;
//     let { url } = req.body;
    
//     // If URL is not provided, use the default format
//     if (!url) {
//       const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//       url = `${frontendUrl}/store/${storeId}`;
//     }
    
//     // Ensure the URL is properly formatted
//     try {
//       // If URL is just a path, prepend the frontend URL
//       if (url.startsWith('/')) {
//         const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//         url = `${frontendUrl}${url}`;
//       }
      
//       // Ensure the URL has a protocol
//       if (!url.match(/^https?:\/\//)) {
//         url = `http://${url}`;
//       }
//     } catch (error) {
//       console.error('Error formatting URL:', error);
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid URL format'
//       });
//     }

//     console.log('Generating QR code for URL:', url);
    
//     // Generate QR code
//     const qrCode = await QRCode.toDataURL(url);
    
//     // Save to database
//     await pool.query(
//       'UPDATE stores SET qr_code_main = ? WHERE id = ?',
//       [qrCode, storeId]
//     );

//     res.json({ 
//       success: true, 
//       data: { 
//         qr_code: qrCode,
//         url: url  // Return the final URL for debugging
//       } 
//     });
//   } catch (error) {
//     console.error('Error generating QR:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error generating QR code' 
//     });
//   }
// });

// // In your QR scanning component
// const handleScan = (data) => {
//   if (data) {
//     console.log('Scanned URL:', data); // Check what URL is being scanned
//     // Rest of your scan handling logic
//   }
// };

// // Generate section QR
// router.post('/store/:storeId/section/:sectionId/generate', 
//   authenticateStoreManager, 
//   async (req, res) => {
//     try {
//       const { storeId, sectionId } = req.params;
//       let { url } = req.body;
      
//       // If URL is not provided, use the default format
//       if (!url) {
//         const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//         url = `${frontendUrl}/store/${storeId}/section/${sectionId}`;
//       }
      
//       // Ensure the URL is properly formatted
//       if (!url.startsWith('http')) {
//         url = `http://${url}`;
//       }
      
//       // Generate QR code
//       const qrCode = await QRCode.toDataURL(url);
      
//       // Save to database
//       await pool.query(
//         'UPDATE store_sections SET qr_code = ? WHERE id = ? AND store_id = ?',
//         [qrCode, sectionId, storeId]
//       );
      
//       res.json({
//         success: true,
//         data: { 
//           qr_code: qrCode,
//           url: url  // Return the generated URL for debugging
//         }
//       });
//     } catch (error) {
//       console.error('Generate section QR error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to generate section QR code'
//       });
//     }
//   }
// );

// // Get all QR codes for a store
// router.get('/store/:storeId', authenticateStoreManager, async (req, res) => {
//   try {
//     const { storeId } = req.params;
    
//     // Get store info with main QR
//     const [storeRows] = await pool.query(
//       'SELECT id, name, qr_code_main FROM stores WHERE id = ?',
//       [storeId]
//     );
    
//     if (storeRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Store not found'
//       });
//     }
    
//     // Get all sections with QR codes
//     const [sections] = await pool.query(
//       'SELECT id, name, qr_code FROM store_sections WHERE store_id = ?',
//       [storeId]
//     );
    
//     res.json({
//       success: true,
//       data: {
//         store: {
//           id: storeRows[0].id,
//           name: storeRows[0].name,
//           qr_code: storeRows[0].qr_code_main
//         },
//         sections: sections.map(section => ({
//           id: section.id,
//           name: section.name,
//           qr_code: section.qr_code
//         }))
//       }
//     });
//   } catch (error) {
//     console.error('Get QR codes error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch QR codes'
//     });
//   }
// });

// module.exports = router;







const express = require('express');
const QRCode = require('qrcode');
const { pool } = require('../config/database');
const { authenticateToken, authenticateStoreManager } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /qr/store/:storeId/generate-main
 * @desc    Generates and stores the main QR code for a specific store.
 * @access  Private (requires authentication to generate)
 */
router.post('/store/:storeId/generate-main', authenticateToken, async (req, res) => {
    try {
        const { storeId } = req.params;
        let { url } = req.body;

        // If URL is not provided by the frontend, construct it using the current IP address
        if (!url) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://192.168.0.110:3000'; // Set your actual local IP here
            url = `${frontendUrl}/store/${storeId}/public`; // QR code points to a public view of the store
        }

        // Ensure the URL has a protocol, useful if only a path was provided
        if (!url.match(/^https?:\/\//)) {
            url = `http://${url}`;
        }

        console.log('Generating QR code for URL:', url); // For debugging purposes

        // Generate QR code data URL (Base64 encoded image)
        const qrCode = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        // Save the generated QR code to the database
        await pool.query(
            'UPDATE stores SET qr_code_main = ? WHERE id = ?',
            [qrCode, storeId]
        );

        res.json({
            success: true,
            message: 'Main store QR code generated successfully',
            data: { qr_code: qrCode, url: url } // Return generated QR code and its URL
        });
    } catch (error) {
        console.error('Error generating main store QR:', error);
        res.status(500).json({ success: false, message: 'Failed to generate main store QR code' });
    }
});

/**
 * @route   POST /qr/store/:storeId/section/:sectionId/generate
 * @desc    Generates and stores the QR code for a specific section within a store.
 * @access  Private (requires authentication to generate)
 */
router.post('/store/:storeId/section/:sectionId/generate', authenticateStoreManager, async (req, res) => {
    try {
        const { storeId, sectionId } = req.params;
        let { url } = req.body;

        if (!url) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://192.168.0.110:3000'; // Set your actual local IP here
            url = `${frontendUrl}/store/${storeId}/section/${sectionId}/public`; // QR code points to a public view of the section
        }

        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }

        console.log('Generating QR code for Section URL:', url); // For debugging purposes

        const qrCode = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        // Save the generated QR code to the store_sections table
        await pool.query(
            'UPDATE store_sections SET qr_code = ? WHERE id = ? AND store_id = ?',
            [qrCode, sectionId, storeId]
        );

        res.json({
            success: true,
            message: 'Section QR code generated successfully',
            data: { qr_code: qrCode, url: url }
        });
    } catch (error) {
        console.error('Error generating section QR:', error);
        res.status(500).json({ success: false, message: 'Failed to generate section QR code' });
    }
});

/**
 * @route   GET /qr/store/:storeId
 * @desc    Gets all QR codes (main store and sections) for a given store.
 * @access  Private (requires authentication, as it's for management)
 */
router.get('/store/:storeId', authenticateStoreManager, async (req, res) => {
    try {
        const { storeId } = req.params;

        // Fetch main store details including its QR code
        const [storeRows] = await pool.query(
            'SELECT id, name, qr_code_main FROM stores WHERE id = ?',
            [storeId]
        );
        if (storeRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        // Fetch all sections for the store including their QR codes
        const [sections] = await pool.query(
            'SELECT id, name, qr_code FROM store_sections WHERE store_id = ?',
            [storeId]
        );

        res.json({
            success: true,
            data: {
                store: {
                    id: storeRows[0].id,
                    name: storeRows[0].name,
                    qr_code: storeRows[0].qr_code_main // Main store QR code
                },
                sections: sections.map(section => ({
                    id: section.id,
                    name: section.name,
                    qr_code: section.qr_code // Section specific QR code
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching QR codes for store:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch QR codes' });
    }
});

module.exports = router;



//16-08-2025

// const express = require('express');
// const QRCode = require('qrcode');
// const { pool } = require('../config/database');
// const { authenticateToken, authenticateStoreManager } = require('../middleware/auth');

// const router = express.Router();

// // Generate main store QR code
// router.post('/store/:storeId/generate-main', authenticateToken, async (req, res) => {
//     try {
//         const { storeId } = req.params;
//         let { url } = req.body;

//         // If URL is not provided, build from request origin or env FRONTEND_URL
//         if (!url) {
//             const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000';
//             url = `${frontendUrl}/store/${storeId}`;

//             // Ensure the URL is properly formatted
//             if (url.startsWith('/')) {
//                 const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000';
//                 url = `${frontendUrl}${url}`;
//             }
//             if (!url.match(/^https?:\/\//)) {
//                 url = `http://${url}`;
//             }
//         }

//         console.log('Generating QR code for URL:', url);
//         const qrCode = await QRCode.toDataURL(url);

//         // Save to database
//         await pool.query(
//             'UPDATE stores SET qr_code_main = ? WHERE id = ?',
//             [qrCode, storeId]
//         );

//         res.json({
//             success: true,
//             data: {
//                 qr_code: qrCode,
//                 url: url
//             }
//         });
//     } catch (error) {
//         console.error('Error generating QR:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error generating QR code'
//         });
//     }
// });

// // Generate section QR
// router.post('/store/:storeId/section/:sectionId/generate',
//     authenticateStoreManager,
//     async (req, res) => {
//         try {
//             const { storeId, sectionId } = req.params;
//             let { url } = req.body;

//             // If URL is not provided, build from request origin or env FRONTEND_URL
//             if (!url) {
//                 const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000';
//                 url = `${frontendUrl}/store/${storeId}/section/${sectionId}`;
//             }

//             // Ensure the URL is properly formatted
//             if (!url.startsWith('http')) {
//                 url = `http://${url}`;
//             }

//             // Generate QR code
//             const qrCode = await QRCode.toDataURL(url);

//             // Save to database
//             await pool.query(
//                 'UPDATE store_sections SET qr_code = ? WHERE id = ? AND store_id = ?',
//                 [qrCode, sectionId, storeId]
//             );

//             res.json({
//                 success: true,
//                 data: {
//                     qr_code: qrCode,
//                     url: url
//                 }
//             });
//         } catch (error) {
//             console.error('Generate section QR error:', error);
//             res.status(500).json({
//                 success: false,
//                 message: 'Failed to generate section QR code'
//             });
//         }
//     }
// );

// // Get all QR codes for a store
// router.get('/store/:storeId', authenticateStoreManager, async (req, res) => {
//     try {
//         const { storeId } = req.params;

//         // Get store info with main QR
//         const [storeRows] = await pool.query(
//             'SELECT id, name, qr_code_main FROM stores WHERE id = ?',
//             [storeId]
//         );
//         if (storeRows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Store not found'
//             });
//         }

//         // Get all sections with QR codes
//         const [sections] = await pool.query(
//             'SELECT id, name, qr_code FROM store_sections WHERE store_id = ?',
//             [storeId]
//         );

//         res.json({
//             success: true,
//             data: {
//                 store: {
//                     id: storeRows[0].id,
//                     name: storeRows[0].name,
//                     qr_code: storeRows[0].qr_code_main
//                 },
//                 sections: sections.map(section => ({
//                     id: section.id,
//                     name: section.name,
//                     qr_code: section.qr_code
//                 }))
//             }
//         });
//     } catch (error) {
//         console.error('Get QR codes error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch QR codes'
//         });
//     }
// });

// module.exports = router;







// const express = require('express');
// const QRCode = require('qrcode');
// const { pool } = require('../config/database');
// const { authenticateToken, authenticateStoreManager } = require('../middleware/auth');

// const router = express.Router();

// // Generate QR code for store
// router.post('/store/:storeId/generate-main', authenticateToken, async (req, res) => {
//     try {
//         const { storeId } = req.params;
//         let { url } = req.body;

//         // Use IP based URL if not provided
//         if (!url) {
//             const frontendUrl = 'http://192.168.1.18:3000';
//             url = `${frontendUrl}/store/${storeId}`;

//             // Ensure URL formatting
//             if (url.startsWith('/')) {
//                 url = `${frontendUrl}${url}`;
//             }
//             if (!url.match(/^https?:\/\//)) {
//                 url = `http://${url}`;
//             }
//         }

//         console.log('Generating QR code for URL:', url);
//         const qrCode = await QRCode.toDataURL(url);
//         await pool.query('UPDATE stores SET qr_code_main = ? WHERE id = ?', [qrCode, storeId]);

//         res.json({
//             success: true,
//             data: { qr_code: qrCode, url: url }
//         });
//     } catch (error) {
//         console.error('Error generating QR:', error);
//         res.status(500).json({ success: false, message: 'Error generating QR code' });
//     }
// });

// // Generate QR code for section
// router.post('/store/:storeId/section/:sectionId/generate', authenticateStoreManager, async (req, res) => {
//     try {
//         const { storeId, sectionId } = req.params;
//         let { url } = req.body;

//         if (!url) {
//             const frontendUrl = 'http://192.168.1.18:3000';
//             url = `${frontendUrl}/store/${storeId}/section/${sectionId}`;
//             if (!url.startsWith('http')) {
//                 url = `http://${url}`;
//             }
//         }

//         const qrCode = await QRCode.toDataURL(url);
//         await pool.query('UPDATE store_sections SET qr_code = ? WHERE id = ? AND store_id = ?', [qrCode, sectionId, storeId]);

//         res.json({ success: true, data: { qr_code: qrCode, url: url } });
//     } catch (error) {
//         console.error('Generate section QR error:', error);
//         res.status(500).json({ success: false, message: 'Failed to generate section QR code' });
//     }
// });

// // Get all QR codes for a store
// router.get('/store/:storeId', authenticateStoreManager, async (req, res) => {
//     try {
//         const { storeId } = req.params;
//         const [storeRows] = await pool.query('SELECT id, name, qr_code_main FROM stores WHERE id = ?', [storeId]);

//         if (storeRows.length === 0) {
//             return res.status(404).json({ success: false, message: 'Store not found' });
//         }

//         const [sections] = await pool.query('SELECT id, name, qr_code FROM store_sections WHERE store_id = ?', [storeId]);

//         res.json({
//             success: true,
//             data: {
//                 store: {
//                     id: storeRows[0].id,
//                     name: storeRows[0].name,
//                     qr_code: storeRows[0].qr_code_main
//                 },
//                 sections: sections.map(section => ({
//                     id: section.id,
//                     name: section.name,
//                     qr_code: section.qr_code
//                 }))
//             }
//         });
//     } catch (error) {
//         console.error('Get QR codes error:', error);
//         res.status(500).json({ success: false, message: 'Failed to fetch QR codes' });
//     }
// });

// module.exports = router;
