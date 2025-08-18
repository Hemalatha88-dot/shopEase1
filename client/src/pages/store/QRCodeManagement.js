// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../utils/api';
// import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// const QRCodeManagement = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [store, setStore] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // const fetchQRCodes = async () => {
//   //   try {
//   //     const response = await api.get(`/qr/store/${user.storeId || user.id}`);
//   //     setStore(response.data.data.store);
//   //     setSections(response.data.data.sections);
//   //   } catch (error) {
//   //     console.error('Error:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const fetchQRCodes = useCallback(async () => {
//     try {
//       const response = await api.get(`/qr/store/${user.storeId || user.id}`);
//       setStore(response.data.data.store);
//       setSections(response.data.data.sections);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user.storeId, user.id]);

//   // const generateQR = async (type, id) => {
//   //   try {
//   //     if (type === 'store') {
//   //       await api.post(`/qr/store/${user.storeId || user.id}/generate-main`);
//   //     } else {
//   //       await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`);
//   //     }
//   //     await fetchQRCodes();
//   //   } catch (error) {
//   //     console.error('Error:', error);
//   //   }
//   // };

// const generateQR = async (type, id) => {
//   try {
//     let url;
//     // Use a more reliable method to get the frontend URL
//     const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin || 'http://localhost:3000';
    
//     if (type === 'store') {
//       url = `${frontendUrl}/store/${user.storeId || user.id}`;
//       await api.post(`/qr/store/${user.storeId || user.id}/generate-main`, { url });
//     } else {
//       url = `${frontendUrl}/store/${user.storeId || user.id}/section/${id}`;
//       await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`, { url });
//     }
//     await fetchQRCodes();
//   } catch (error) {
//     console.error('Error generating QR:', error);
//   }
// };

// // Handle QR code clicks for navigation
// const handleQRCodeClick = (type, id) => {
//   try {
//     if (type === 'store') {
//       // Navigate to main store page
//       navigate(`/store/${user.storeId || user.id}`);
//     } else {
//       // Navigate to section-specific page
//       navigate(`/store/${user.storeId || user.id}/section/${id}`);
//     }
//   } catch (error) {
//     console.error('Navigation error:', error);
//     // Fallback: open in new tab
//     const url = type === 'store' 
//       ? `/store/${user.storeId || user.id}`
//       : `/store/${user.storeId || user.id}/section/${id}`;
//     window.open(url, '_blank');
//   }
// };

//   useEffect(() => {
//     if (user) fetchQRCodes();
//   }, [user, fetchQRCodes]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">QR Code Management</h1>
//         <button 
//           onClick={async () => {
//             try {
//               await generateQR('store');
//               for (const section of sections) {
//                 if (section.qr_code) {
//                   await generateQR('section', section.id);
//                 }
//               }
//             } catch (error) {
//               console.error('Error regenerating all QR codes:', error);
//             }
//           }}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Regenerate All QR Codes
//         </button>
//       </div>
      
//       {/* Main Store QR */}
//       <div className="mb-8 p-4 border rounded">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Main Store QR</h2>
//           {store?.qr_code && (
//             <button 
//               onClick={() => generateQR('store')}
//               className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
//             >
//               Regenerate
//             </button>
//           )}
//         </div>
//         {store?.qr_code && (
//           <p className="text-sm text-gray-600 mb-3 text-center">
//             💡 Click on the QR code to navigate to the store page
//           </p>
//         )}
//         {store?.qr_code ? (
//           <div className="flex flex-col items-center">
//             <img 
//               src={store.qr_code} 
//               alt="Store QR" 
//               className="w-48 h-48 cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300 rounded-lg" 
//               onClick={() => handleQRCodeClick('store')}
//               title="Click to navigate to store page"
//             />
//             <p className="text-xs text-gray-500 mt-1 text-center">Click to navigate</p>
//             <button 
//               onClick={() => {
//                 const link = document.createElement('a');
//                 link.href = store.qr_code;
//                 link.download = `store-qr-code-${user.storeId || user.id}.png`;
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//               }}
//               className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
//             >
//               <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
//               Download
//             </button>
//           </div>
//         ) : (
//           <button 
//             onClick={() => generateQR('store')}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Generate Store QR
//           </button>
//         )}
//       </div>

//       {/* Section QR Codes */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Section QR Codes</h2>
//         {sections.some(section => section.qr_code) && (
//           <p className="text-sm text-gray-600 mb-3 text-center">
//             💡 Click on any QR code to navigate to that section's page
//           </p>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {sections.map(section => (
//             <div key={section.id} className="border p-4 rounded">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-medium">{section.name}</h3>
//                 {section.qr_code && (
//                   <button 
//                     onClick={() => generateQR('section', section.id)}
//                     className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
//                   >
//                     Regenerate
//                   </button>
//                 )}
//               </div>
//               {section.qr_code ? (
//                 <div className="flex flex-col items-center">
//                   <img 
//                     src={section.qr_code} 
//                     alt={`${section.name} QR`} 
//                     className="w-32 h-32 cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300 rounded-lg"
//                     onClick={() => handleQRCodeClick('section', section.id)}
//                     title={`Click to navigate to ${section.name} section`}
//                   />
//                   <p className="text-xs text-gray-500 mt-1 text-center">Click to navigate</p>
//                   <button 
//                     onClick={() => {
//                       const link = document.createElement('a');
//                       link.href = section.qr_code;
//                       link.download = `section-${section.id}-qr-code.png`;
//                       document.body.appendChild(link);
//                       link.click();
//                       document.body.removeChild(link);
//                     }}
//                     className="mt-2 text-sm text-blue-600 hover:text-blue-800"
//                   >
//                     Download
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => generateQR('section', section.id)}
//                   className="text-sm text-blue-600"
//                 >
//                   Generate QR
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QRCodeManagement;






import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api'; // Assuming this is your axios instance
import { QrCodeIcon } from '@heroicons/react/24/outline'; // Only QrCodeIcon is needed here

const QRCodeManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for displaying errors

    // Define your local IP here for frontend consistency
    // This will be passed to the backend for QR code generation
    const LOCAL_FRONTEND_URL = 'http://192.168.0.103:3000'; 

    const fetchQRCodes = useCallback(async () => {
        if (!user || !user.storeId) { // Ensure user and a selected store are available
            setLoading(false);
            setError('Please select a store to manage its QR codes.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            // Fetch QR codes from the backend for the user's current store
            const response = await api.get(`/qr/store/${user.storeId}`);
            setStore(response.data.data.store);
            setSections(response.data.data.sections);
        } catch (err) {
            console.error('Error fetching QR codes:', err);
            setError('Failed to load QR codes. Make sure your store is selected and has sections.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const generateQR = async (type, id) => {
        if (!user || !user.storeId) {
            setError('Authentication error: Please log in and ensure a store is selected.');
            return;
        }
        try {
            setError(null);
            let targetUrl;

            // Construct the URL that the QR code will point to
            if (type === 'store') {
                targetUrl = `${LOCAL_FRONTEND_URL}/store/${user.storeId}/public`; // Point to public store page
                await api.post(`/qr/store/${user.storeId}/generate-main`, { url: targetUrl });
            } else { // type === 'section'
                targetUrl = `${LOCAL_FRONTEND_URL}/store/${user.storeId}/section/${id}/public`; // Point to public section page
                await api.post(`/qr/store/${user.storeId}/section/${id}/generate`, { url: targetUrl });
            }
            
            await fetchQRCodes(); // Refresh QR codes after generation
            alert(`Successfully generated QR code for ${type}!`);
        } catch (err) {
            console.error(`Error generating ${type} QR:`, err);
            setError(`Failed to generate ${type} QR code. Ensure your backend is running.`);
        }
    };

    const handleQRCodeClick = (type, id) => {
        // This is for local navigation within your app, not for the scanned QR code
        const path = type === 'store'
            ? `/store/${user.storeId}`
            : `/store/${user.storeId}/section/${id}`;
        navigate(path);
    };

    useEffect(() => {
        // user.storeId must be available for this component to work correctly in a multi-store setup
        // This usually means the user has to select a store context after logging in
        if (user && user.storeId) {
            fetchQRCodes();
        } else if (user && !user.storeId) {
            setLoading(false);
            setError('You need to select a store before managing QR codes. Please go to your store management page.');
        }
    }, [user, fetchQRCodes]);

    if (loading) return <div className="text-center p-8">Loading QR Codes...</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
                QR Code Management
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {error}
                </div>
            )}

            {/* Main Store QR Code Section */}
            <div className="mb-10 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Main Store QR Code</h2>
                {store && store.qr_code ? (
                    <div>
                        <div onClick={() => handleQRCodeClick('store')} className="cursor-pointer inline-block border p-2 rounded-md hover:shadow-xl transition-shadow">
                            <img src={store.qr_code} alt="Store QR Code" className="w-64 h-64" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Click the QR code to navigate within the app.</p>
                    </div>
                ) : <p className="text-gray-500">No QR code generated for the main store yet. Generate it below.</p>}
                
                <button
                    onClick={() => generateQR('store')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    <QrCodeIcon className="h-5 w-5 inline-block mr-2" />
                    {store?.qr_code ? 'Regenerate Store QR' : 'Generate Store QR'}
                </button>
            </div>

            {/* Section QR Codes Section */}
            <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Sub Store QR Codes</h2>
                {sections.length === 0 ? (
                    <p className="text-gray-500">No sections found for this store. Create sections first.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sections.map(section => (
                            <div key={section.id} className="text-center">
                                <h3 className="text-lg font-medium mb-2 text-gray-800">{section.name}</h3>
                                {section.qr_code ? (
                                    <div onClick={() => handleQRCodeClick('section', section.id)} className="cursor-pointer inline-block border p-2 rounded-md hover:shadow-xl transition-shadow">
                                        <img src={section.qr_code} alt={`Section ${section.name} QR Code`} className="w-48 h-48 mx-auto" />
                                    </div>
                                ) : <p className="text-gray-500 h-48 flex items-center justify-center">No QR code yet.</p>}
                                <button
                                    onClick={() => generateQR('section', section.id)}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 text-sm"
                                >
                                    <QrCodeIcon className="h-4 w-4 inline-block mr-1" />
                                    {section.qr_code ? 'Regenerate QR' : 'Generate QR'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRCodeManagement;




// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../utils/api';
// import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// const QRCodeManagement = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [store, setStore] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchQRCodes = useCallback(async () => {
//         if (!user) return;
//         try {
//             const response = await api.get(`/qr/store/${user.storeId || user.id}`);
//             setStore(response.data.data.store);
//             setSections(response.data.data.sections);
//         } catch (error) {
//             console.error('Error fetching QR codes:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [user]);

//     const generateQR = async (type, id) => {
//         try {
//             let url;
//             // Build frontend base from env or current origin for LAN compatibility
//             const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

//             if (type === 'store') {
//                 url = `${frontendUrl}/store/${user.storeId || user.id}`;
//                 await api.post(`/qr/store/${user.storeId || user.id}/generate-main`, { url });
//             } else {
//                 url = `${frontendUrl}/store/${user.storeId || user.id}/section/${id}`;
//                 await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`, { url });
//             }

//             // Refresh the QR codes after generating a new one
//             await fetchQRCodes();
//         } catch (error) {
//             console.error('Error generating QR:', error);
//         }
//     };

//     const handleQRCodeClick = (type, id) => {
//         try {
//             const path = type === 'store'
//                 ? `/store/${user.storeId || user.id}`
//                 : `/store/${user.storeId || user.id}/section/${id}`;
//             navigate(path);
//         } catch (error) {
//             console.error('Navigation error:', error);
//         }
//     };

//     useEffect(() => {
//         fetchQRCodes();
//     }, [fetchQRCodes]);

//     if (loading) return <div className="text-center p-8">Loading QR Codes...</div>;

//     return (
//         <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
//                 QR Code Management
//             </h1>

//             {/* Store QR Code Section */}
//             <div className="mb-10 p-6 bg-white shadow-lg rounded-lg">
//                 <h2 className="text-2xl font-semibold mb-4 text-gray-700">Main Store QR Code</h2>
//                 {store && store.qr_code ? (
//                     <div>
//                         <div onClick={() => handleQRCodeClick('store')} className="cursor-pointer inline-block border p-2 rounded-md hover:shadow-xl transition-shadow">
//                             <img src={store.qr_code} alt="Store QR Code" className="w-64 h-64" />
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600">Click the QR code to navigate.</p>
//                     </div>
//                 ) : <p className="text-gray-500">No QR code generated for the main store yet.</p>}
                
//                 <button
//                     onClick={() => generateQR('store')}
//                     className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
//                 >
//                     <QrCodeIcon className="h-5 w-5 inline-block mr-2" />
//                     {store?.qr_code ? 'Regenerate Store QR' : 'Generate Store QR'}
//                 </button>
//             </div>

//             {/* Section QR Codes Section */}
//             <div className="p-6 bg-white shadow-lg rounded-lg">
//                 <h2 className="text-2xl font-semibold mb-6 text-gray-700">Section QR Codes</h2>
//                 {sections.length === 0 ? (
//                     <p className="text-gray-500">No sections found for this store.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {sections.map(section => (
//                             <div key={section.id} className="text-center">
//                                 <h3 className="text-lg font-medium mb-2 text-gray-800">{section.name}</h3>
//                                 {section.qr_code ? (
//                                     <div onClick={() => handleQRCodeClick('section', section.id)} className="cursor-pointer inline-block border p-2 rounded-md hover:shadow-xl transition-shadow">
//                                         <img src={section.qr_code} alt={`Section ${section.name} QR Code`} className="w-48 h-48 mx-auto" />
//                                     </div>
//                                 ) : <p className="text-gray-500 h-48 flex items-center justify-center">No QR code yet.</p>}
//                                 <button
//                                     onClick={() => generateQR('section', section.id)}
//                                     className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 text-sm"
//                                 >
//                                     <QrCodeIcon className="h-4 w-4 inline-block mr-1" />
//                                     {section.qr_code ? 'Regenerate QR' : 'Generate QR'}
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QRCodeManagement;





// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../utils/api';
// import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// const QRCodeManagement = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [store, setStore] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchQRCodes = useCallback(async () => {
//         if (!user) return;
//         try {
//             const response = await api.get(`/qr/store/${user.storeId || user.id}`);
//             setStore(response.data.data.store);
//             setSections(response.data.data.sections);
//         } catch (error) {
//             console.error('Error fetching QR codes:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [user]);

//     const generateQR = async (type, id) => {
//         try {
//             let url;
//             // Use your specific local IP address
//             const frontendUrl = 'http://192.168.1.18:3000';

//             if (type === 'store') {
//                 url = `${frontendUrl}/store/${user.storeId || user.id}`;
//                 await api.post(`/qr/store/${user.storeId || user.id}/generate-main`, { url });
//             } else {
//                 url = `${frontendUrl}/store/${user.storeId || user.id}/section/${id}`;
//                 await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`, { url });
//             }

//             // Refresh the QR codes after generating a new one
//             await fetchQRCodes();
//         } catch (error) {
//             console.error('Error generating QR:', error);
//         }
//     };

//     const handleQRCodeClick = (type, id) => {
//         try {
//             const path = type === 'store'
//                 ? `/store/${user.storeId || user.id}`
//                 : `/store/${user.storeId || user.id}/section/${id}`;
//             navigate(path);
//         } catch (error) {
//             console.error('Navigation error:', error);
//         }
//     };

//     useEffect(() => {
//         fetchQRCodes();
//     }, [fetchQRCodes]);

//     if (loading) return <div className="text-center p-8">Loading QR Codes...</div>;

//     return (
//         <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
//             <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
//                 QR Code Management
//             </h1>

//             {/* Store QR Code Section */}
//             <div className="mb-10 p-6 bg-white shadow-lg rounded-lg">
//                 <h2 className="text-2xl font-semibold mb-4 text-gray-700">Main Store QR Code</h2>
//                 {store && store.qr_code ? (
//                     <div>
//                         <div onClick={() => handleQRCodeClick('store')} className="cursor-pointer inline-block border p-2 rounded-md hover:shadow-xl transition-shadow">
//                             <img src={store.qr_code} alt="Store QR Code" className="w-64 h-64" />
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600">Click the QR code to navigate.</p>
//                     </div>
//                 ) : <p className="text-gray-500">No QR code generated for the main store yet.</p>}
                
//                 <button
//                     onClick={() => generateQR('store')}
//                     className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
//                 >
//                     <QrCodeIcon className="h-5 w-5 inline-block mr-2" />
//                     {store?.qr_code ? 'Regenerate Store QR' : 'Generate Store QR'}
//                 </button>
//             </div>

//             {/* Section QR Codes Section */}
//             <div className="p-6 bg-white shadow-lg rounded-lg">
//                 <h2 className="text-2xl font-semibold mb-6 text-gray-700">Section QR Codes</h2>
//                 {sections.length === 0 ? (
//                     <p className="text-gray-500">No sections found for this store.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {sections.map(section => (
//                             <div key={section.id} className="text-center">
//                                 <h3 className="text-lg font-medium mb-2 text-gray-800">{section.name}</h3>
//                                 {section.qr_code ? (
//                                     <div onClick={() => handleQRCodeClick('section', section.id)} className="cursor-pointer inline-block border p-2 rounded-md hover:shadow-xl transition-shadow">
//                                         <img src={section.qr_code} alt={`Section ${section.name} QR Code`} className="w-48 h-48 mx-auto" />
//                                     </div>
//                                 ) : <p className="text-gray-500 h-48 flex items-center justify-center">No QR code yet.</p>}
//                                 <button
//                                     onClick={() => generateQR('section', section.id)}
//                                     className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 text-sm"
//                                 >
//                                     <QrCodeIcon className="h-4 w-4 inline-block mr-1" />
//                                     {section.qr_code ? 'Regenerate QR' : 'Generate QR'}
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QRCodeManagement;






// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../utils/api';
// import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// const QRCodeManagement = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [store, setStore] = useState(null);
//     const [sections, setSections] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchQRCodes = useCallback(async () => {
//         try {
//             const response = await api.get(`/qr/store/${user.storeId || user.id}`);
//             setStore(response.data.data.store);
//             setSections(response.data.data.sections);
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [user.storeId, user.id]);

//     const generateQR = async (type, id) => {
//         try {
//             let url;
//             // Hardcode IP based URL
//             const frontendUrl = 'http://192.168.1.18:3000';

//             if (type === 'store') {
//                 url = `${frontendUrl}/store/${user.storeId || user.id}`;
//                 await api.post(`/qr/store/${user.storeId || user.id}/generate-main`, { url });
//             } else {
//                 url = `${frontendUrl}/store/${user.storeId || user.id}/section/${id}`;
//                 await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`, { url });
//             }

//             await fetchQRCodes();
//         } catch (error) {
//             console.error('Error generating QR:', error);
//         }
//     };

//     const handleQRCodeClick = (type, id) => {
//         try {
//             if (type === 'store') {
//                 navigate(`/store/${user.storeId || user.id}`);
//             } else {
//                 navigate(`/store/${user.storeId || user.id}/section/${id}`);
//             }
//         } catch (error) {
//             console.error('Navigation error:', error);
//             const url = type === 'store' ? `/store/${user.storeId || user.id}` : `/store/${user.storeId || user.id}/section/${id}`;
//             window.open(url, '_blank');
//         }
//     };

//     useEffect(() => {
//         if (user) fetchQRCodes();
//     }, [user, fetchQRCodes]);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <div>
//             <h1>QR Code Management</h1>
//             {store && store.qr_code && (
//                 <div onClick={() => handleQRCodeClick('store')}>
//                     <img src={store.qr_code} alt="Store QR Code" />
//                     <p>Click to navigate to store page</p>
//                 </div>
//             )}
//             <div>
//                 {sections.map(section => (
//                     <div key={section.id} onClick={() => handleQRCodeClick('section', section.id)}>
//                         <img src={section.qr_code} alt={`Section ${section.name} QR Code`} />
//                         <p>Click to navigate to section {section.name}</p>
//                     </div>
//                 ))}
//             </div>
//             <button onClick={() => generateQR('store')}>Generate Store QR</button>
//             {sections.map(section => (
//                 <button key={section.id} onClick={() => generateQR('section', section.id)}>
//                     Generate Section {section.name} QR
//                 </button>
//             ))}
//         </div>
//     );
// };

// export default QRCodeManagement;
