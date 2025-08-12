// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';
// import { 
//   QrCodeIcon, 
//   ArrowDownTrayIcon, 
//   PrinterIcon,
//   EyeIcon,
//   PlusIcon,
//   BuildingStorefrontIcon,
//   Squares2X2Icon
// } from '@heroicons/react/24/outline';

// const QRCodeManagement = () => {
//   const { user } = useAuth();
//   const [qrCodes, setQrCodes] = useState({ store: null, sections: [] });
//   const [loading, setLoading] = useState(true);
//   const [generating, setGenerating] = useState(false);
//   const [generatingMain, setGeneratingMain] = useState(false);
//   const [generatingSections, setGeneratingSections] = useState({});
//   const [error, setError] = useState('');
//   const [selectedQR, setSelectedQR] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   useEffect(() => {
//     const storeId = user?.storeId || user?.id;
//     if (storeId) {
//       fetchQRCodes();
//     }
//   }, [user?.storeId, user?.id]);

//   const fetchQRCodes = async () => {
//     const storeId = user?.storeId || user?.id;
//     if (!storeId) {
//       setError('Store ID not found. Please login again.');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log('Fetching QR codes for store:', storeId);
//       const response = await api.get(`/qr/store/${storeId}`);
//       setQrCodes(response.data.data);
//       setError('');
//     } catch (error) {
//       setError(`Failed to fetch QR codes: ${error.response?.data?.message || error.message}`);
//       console.error('Error fetching QR codes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateSectionQR = async (sectionId) => {
//     const storeId = user?.storeId || user?.id;
//     if (!storeId) {
//       setError('Store ID not found');
//       return;
//     }

//     try {
//       setGeneratingSections(prev => ({ ...prev, [sectionId]: true }));
//       const response = await api.post(`/qr/store/${storeId}/section/${sectionId}/generate`);
      
//       // Update the section QR in state
//       setQrCodes(prev => ({
//         ...prev,
//         sections: prev.sections.map(section => 
//           section.id === sectionId 
//             ? { ...section, qr_code: response.data.data.qr_code }
//             : section
//         )
//       }));
      
//       setError('');
//     } catch (error) {
//       console.error('Generate section QR error:', error);
//       setError(error.response?.data?.message || 'Failed to generate section QR code');
//     } finally {
//       setGeneratingSections(prev => ({ ...prev, [sectionId]: false }));
//     }
//   };

//   const generateStoreQR = async () => {
//     try {
//       setGenerating(true);
//       await api.post(`/qr/store/${user?.storeId}`);
//       await fetchQRCodes();
//     } catch (error) {
//       setError('Failed to generate store QR code');
//       console.error('Error generating store QR:', error);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const generateAllSectionQRs = async () => {
//     const storeId = user?.storeId || user?.id;
//     if (!storeId) {
//       setError('Store ID not found');
//       return;
//     }

//     try {
//       setGenerating(true);
//       await api.post(`/qr/bulk-generate/${storeId}`);
//       await fetchQRCodes();
//     } catch (error) {
//       setError('Failed to generate QR codes');
//       console.error('Error generating bulk QRs:', error);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const generateMainStoreQR = async () => {
//     const storeId = user?.storeId || user?.id;
//     if (!storeId) {
//       setError('Store ID not found');
//       return;
//     }

//     try {
//       setGeneratingMain(true);
//       const response = await api.post(`/qr/store/${storeId}/generate-main`);
      
//       // Update the main store QR in state
//       setQrCodes(prev => ({
//         ...prev,
//         mainStore: response.data.data
//       }));
      
//       setError('');
//     } catch (error) {
//       console.error('Generate main store QR error:', error);
//       setError(error.response?.data?.message || 'Failed to generate main store QR code');
//     } finally {
//       setGeneratingMain(false);
//     }
//   };

//   const downloadQR = (type, id, name) => {
//     const url = `http://localhost:5000/api/qr/download/${type}/${id}`;
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${name.replace(/\s+/g, '_')}_QR.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const previewQR = (qrData, title) => {
//     setSelectedQR({ qrCode: qrData, title });
//     setShowPreview(true);
//   };

//   if (loading) {
//     return (
//       <div className="p-6 lg:p-8">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading QR codes...</p>
//             <p className="text-xs text-gray-400 mt-2">
//               Debug: User loaded: {user ? 'Yes' : 'No'}, Store ID: {user?.storeId || user?.id || 'Not found'}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user?.storeId) {
//     return (
//       <div className="p-6 lg:p-8">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
//           <p className="text-yellow-700 mb-4">
//             Unable to load store information. Please ensure you are logged in as a store manager.
//           </p>
//           <p className="text-sm text-yellow-600">
//             Debug info: User: {user ? 'Found' : 'Not found'}, Store ID: {user?.storeId || user?.id || 'Missing'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 lg:p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Management</h1>
//         <p className="text-gray-600">Generate, manage, and download QR codes for your store and sections</p>
//       </div>

//       {error && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//           <p className="text-red-600">{error}</p>
//         </div>
//       )}

//       {/* Store QR Code Section */}
//       <div className="bg-white rounded-xl shadow-sm border mb-8">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <BuildingStorefrontIcon className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">Main Store QR Code</h2>
//                 <p className="text-sm text-gray-500">For store entrance and general access</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               {!qrCodes.store?.qr_code_main && (
//                 <button
//                   onClick={generateStoreQR}
//                   disabled={generating}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
//                 >
//                   <PlusIcon className="h-4 w-4" />
//                   <span>Generate</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {qrCodes.store?.qr_code_main ? (
//           <div className="p-6">
//             <div className="flex items-center space-x-6">
//               <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
//                 <img 
//                   src={qrCodes.store.qr_code_main} 
//                   alt="Store QR Code" 
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-medium text-gray-900 mb-2">{qrCodes.store.name}</h3>
//                 <p className="text-sm text-gray-500 mb-4">
//                   Customers scan this QR code at your store entrance to access all offers
//                 </p>
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => previewQR(qrCodes.store.qr_code_main, `${qrCodes.store.name} - Main Store`)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
//                   >
//                     <EyeIcon className="h-4 w-4" />
//                     <span>Preview</span>
//                   </button>
//                   <button
//                     onClick={() => downloadQR('store', qrCodes.store.id, qrCodes.store.name)}
//                     className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
//                   >
//                     <ArrowDownTrayIcon className="h-4 w-4" />
//                     <span>Download</span>
//                   </button>
//                   <button
//                     onClick={() => window.print()}
//                     className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
//                   >
//                     <PrinterIcon className="h-4 w-4" />
//                     <span>Print</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="p-6 text-center text-gray-500">
//             <QrCodeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//             <p>No store QR code generated yet</p>
//           </div>
//         )}
//       </div>

//       {/* Section QR Codes */}
//       <div className="bg-white rounded-xl shadow-sm border">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Squares2X2Icon className="h-6 w-6 text-purple-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">Section QR Codes</h2>
//                 <p className="text-sm text-gray-500">For specific store sections and departments</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               {qrCodes.sections.length > 0 && (
//                 <button
//                   onClick={generateAllSectionQRs}
//                   disabled={generating}
//                   className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
//                 >
//                   <PlusIcon className="h-4 w-4" />
//                   <span>Generate All</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           {qrCodes.sections.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {qrCodes.sections.map((section) => (
//                 <div key={section.id} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-center space-x-4">
//                     {section.qr_code ? (
//                       <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//                         <img 
//                           src={section.qr_code} 
//                           alt={`${section.name} QR Code`} 
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                     ) : (
//                       <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <QrCodeIcon className="h-8 w-8 text-gray-300" />
//                       </div>
//                     )}
                    
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-gray-900 truncate">{section.name}</h3>
//                       <p className="text-sm text-gray-500 mt-1">Section-specific offers</p>
                      
//                       <div className="flex items-center space-x-2 mt-3">
//                         {section.qr_code ? (
//                           <>
//                             <button
//                               onClick={() => previewQR(section.qr_code, section.name)}
//                               className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center space-x-1"
//                             >
//                               <EyeIcon className="h-3 w-3" />
//                               <span>Preview</span>
//                             </button>
//                             <button
//                               onClick={() => downloadQR('section', section.id, section.name)}
//                               className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1"
//                             >
//                               <ArrowDownTrayIcon className="h-3 w-3" />
//                               <span>Download</span>
//                             </button>
//                           </>
//                         ) : (
//                           <button
//                             onClick={() => generateSectionQR(section.id)}
//                             disabled={generating}
//                             className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-1"
//                           >
//                             <PlusIcon className="h-3 w-3" />
//                             <span>Generate</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 py-8">
//               <Squares2X2Icon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//               <p className="mb-2">No sections found</p>
//               <p className="text-sm">Create sections first to generate section-specific QR codes</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* QR Preview Modal */}
//       {showPreview && selectedQR && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">{selectedQR.title}</h3>
//               <div className="w-64 h-64 mx-auto border border-gray-200 rounded-lg overflow-hidden mb-4">
//                 <img 
//                   src={selectedQR.qrCode} 
//                   alt="QR Code Preview" 
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//               <div className="flex items-center justify-center space-x-3">
//                 <button
//                   onClick={() => setShowPreview(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => {
//                     const link = document.createElement('a');
//                     link.href = selectedQR.qrCode;
//                     link.download = `${selectedQR.title.replace(/\s+/g, '_')}_QR.png`;
//                     link.click();
//                   }}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
//                 >
//                   <ArrowDownTrayIcon className="h-4 w-4" />
//                   <span>Download</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRCodeManagement; 







// // client/src/pages/store/QRCodeManagement.js
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../utils/api';
// import { 
//   QrCodeIcon, 
//   ArrowDownTrayIcon,
//   PrinterIcon,
//   PlusIcon
// } from '@heroicons/react/24/outline';

// const QRCodeManagement = () => {
//   const { user } = useAuth();
//   const [store, setStore] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generating, setGenerating] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch QR codes
//   const fetchQRCodes = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/qr/store/${user.storeId || user.id}`);
//       setStore(response.data.data.store);
//       setSections(response.data.data.sections);
//     } catch (error) {
//       setError('Failed to load QR codes');
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate main store QR
//   const generateStoreQR = async () => {
//     try {
//       setGenerating(true);
//       await api.post(`/qr/store/${user.storeId || user.id}/generate-main`);
//       await fetchQRCodes(); // Refresh the list
//     } catch (error) {
//       setError('Failed to generate store QR');
//       console.error('Error:', error);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // Generate section QR
//   const generateSectionQR = async (sectionId) => {
//     try {
//       setGenerating(true);
//       await api.post(
//         `/qr/store/${user.storeId || user.id}/section/${sectionId}/generate`
//       );
//       await fetchQRCodes(); // Refresh the list
//     } catch (error) {
//       setError('Failed to generate section QR');
//       console.error('Error:', error);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // Download QR code
//   const downloadQR = (qrCode, fileName) => {
//     if (!qrCode) return;
    
//     const link = document.createElement('a');
//     link.href = qrCode;
//     link.download = `${fileName.replace(/\s+/g, '_')}_qr.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Print QR code
//   const printQR = (qrCode, title) => {
//     if (!qrCode) return;
    
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print QR Code - ${title}</title>
//           <style>
//             body { text-align: center; padding: 20px; }
//             h1 { margin-bottom: 10px; }
//             img { max-width: 300px; height: auto; margin: 20px 0; }
//             .store-name { font-size: 18px; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           <h1>${title}</h1>
//           <div class="store-name">${store?.name || 'Store'}</div>
//           <img src="${qrCode}" alt="${title} QR Code" />
//           <p>Scan this QR code to view ${title.toLowerCase()}</p>
//           <script>
//             window.onload = function() {
//               window.print();
//               setTimeout(function() { window.close(); }, 1000);
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   useEffect(() => {
//     if (user) {
//       fetchQRCodes();
//     }
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">QR Code Management</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

//       {/* Main Store QR */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Main Store QR Code</h2>
//           <button
//             onClick={generateStoreQR}
//             disabled={generating}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//           >
//             {generating ? 'Generating...' : (
//               <>
//                 <PlusIcon className="h-5 w-5 mr-2" />
//                 Generate QR Code
//               </>
//             )}
//           </button>
//         </div>
        
//         {store?.qr_code ? (
//           <div className="flex flex-col items-center">
//             <img 
//               src={store.qr_code} 
//               alt="Store QR Code" 
//               className="w-48 h-48 mb-4"
//             />
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => downloadQR(store.qr_code, `${store.name}_store`)}
//                 className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
//                 Download
//               </button>
//               <button
//                 onClick={() => printQR(store.qr_code, 'Store QR Code')}
//                 className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 <PrinterIcon className="h-5 w-5 mr-2" />
//                 Print
//               </button>
//             </div>
//             <p className="mt-2 text-sm text-gray-500">
//               URL: {`${window.location.origin}/store/${store.id}`}
//             </p>
//           </div>
//         ) : (
//           <div className="text-center py-8 bg-gray-50 rounded-lg">
//             <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <p className="mt-2 text-sm text-gray-500">
//               No QR code generated yet. Click "Generate QR Code" to create one.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Section QR Codes */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold mb-6">Store Section QR Codes</h2>
        
//         {sections.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {sections.map((section) => (
//               <div key={section.id} className="border rounded-lg p-4">
//                 <h3 className="font-medium mb-3">{section.name}</h3>
                
//                 {section.qr_code ? (
//                   <div className="flex flex-col items-center">
//                     <img 
//                       src={section.qr_code} 
//                       alt={`${section.name} QR Code`} 
//                       className="w-32 h-32 mb-3"
//                     />
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => downloadQR(section.qr_code, `${section.name}_section`)}
//                         className="p-1 text-blue-600 hover:text-blue-800"
//                         title="Download"
//                       >
//                         <ArrowDownTrayIcon className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => printQR(section.qr_code, `${section.name} Section QR Code`)}
//                         className="p-1 text-gray-600 hover:text-gray-800"
//                         title="Print"
//                       >
//                         <PrinterIcon className="h-5 w-5" />
//                       </button>
//                     </div>
//                     <p className="mt-2 text-xs text-gray-500 break-all text-center">
//                       {`${window.location.origin}/store/${store?.id}/section/${section.id}`}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="text-center py-4">
//                     <button
//                       onClick={() => generateSectionQR(section.id)}
//                       disabled={generating}
//                       className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
//                     >
//                       <PlusIcon className="h-4 w-4 mr-1" />
//                       Generate QR Code
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 bg-gray-50 rounded-lg">
//             <p className="text-gray-500">No sections found. Add sections to generate QR codes.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QRCodeManagement;







import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const QRCodeManagement = () => {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fetchQRCodes = async () => {
  //   try {
  //     const response = await api.get(`/qr/store/${user.storeId || user.id}`);
  //     setStore(response.data.data.store);
  //     setSections(response.data.data.sections);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchQRCodes = useCallback(async () => {
    try {
      const response = await api.get(`/qr/store/${user.storeId || user.id}`);
      setStore(response.data.data.store);
      setSections(response.data.data.sections);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user.storeId, user.id]);

  // const generateQR = async (type, id) => {
  //   try {
  //     if (type === 'store') {
  //       await api.post(`/qr/store/${user.storeId || user.id}/generate-main`);
  //     } else {
  //       await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`);
  //     }
  //     await fetchQRCodes();
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

const generateQR = async (type, id) => {
  try {
    let url;
    if (type === 'store') {
      url = `${window.location.origin}/store/${user.storeId || user.id}`;
      await api.post(`/qr/store/${user.storeId || user.id}/generate-main`, { url });
    } else {
      url = `${window.location.origin}/store/${user.storeId || user.id}/section/${id}`;
      await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`, { url });
    }
    await fetchQRCodes();
  } catch (error) {
    console.error('Error generating QR:', error);
  }
};

  useEffect(() => {
    if (user) fetchQRCodes();
  }, [user, fetchQRCodes]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">QR Code Management</h1>
      
      {/* Main Store QR */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Main Store QR</h2>
        {store?.qr_code ? (
          <div className="flex flex-col items-center">
            <img src={store.qr_code} alt="Store QR" className="w-48 h-48" />
            <button 
              onClick={() => window.open(store.qr_code, '_blank')}
              className="mt-2 flex items-center text-blue-600"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
              Download
            </button>
          </div>
        ) : (
          <button 
            onClick={() => generateQR('store')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate Store QR
          </button>
        )}
      </div>

      {/* Section QR Codes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Section QR Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map(section => (
            <div key={section.id} className="border p-4 rounded">
              <h3 className="font-medium mb-2">{section.name}</h3>
              {section.qr_code ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={section.qr_code} 
                    alt={`${section.name} QR`} 
                    className="w-32 h-32"
                  />
                  <button 
                    onClick={() => window.open(section.qr_code, '_blank')}
                    className="mt-2 text-sm text-blue-600"
                  >
                    Download
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => generateQR('section', section.id)}
                  className="text-sm text-blue-600"
                >
                  Generate QR
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodeManagement;