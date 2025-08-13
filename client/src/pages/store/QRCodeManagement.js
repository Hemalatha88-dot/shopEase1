import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const QRCodeManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    // Use a more reliable method to get the frontend URL
    const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin || 'http://localhost:3000';
    
    if (type === 'store') {
      url = `${frontendUrl}/store/${user.storeId || user.id}`;
      await api.post(`/qr/store/${user.storeId || user.id}/generate-main`, { url });
    } else {
      url = `${frontendUrl}/store/${user.storeId || user.id}/section/${id}`;
      await api.post(`/qr/store/${user.storeId || user.id}/section/${id}/generate`, { url });
    }
    await fetchQRCodes();
  } catch (error) {
    console.error('Error generating QR:', error);
  }
};

// Handle QR code clicks for navigation
const handleQRCodeClick = (type, id) => {
  try {
    if (type === 'store') {
      // Navigate to main store page
      navigate(`/store/${user.storeId || user.id}`);
    } else {
      // Navigate to section-specific page
      navigate(`/store/${user.storeId || user.id}/section/${id}`);
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback: open in new tab
    const url = type === 'store' 
      ? `/store/${user.storeId || user.id}`
      : `/store/${user.storeId || user.id}/section/${id}`;
    window.open(url, '_blank');
  }
};

  useEffect(() => {
    if (user) fetchQRCodes();
  }, [user, fetchQRCodes]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">QR Code Management</h1>
        <button 
          onClick={async () => {
            try {
              await generateQR('store');
              for (const section of sections) {
                if (section.qr_code) {
                  await generateQR('section', section.id);
                }
              }
            } catch (error) {
              console.error('Error regenerating all QR codes:', error);
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Regenerate All QR Codes
        </button>
      </div>
      
      {/* Main Store QR */}
      <div className="mb-8 p-4 border rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Main Store QR</h2>
          {store?.qr_code && (
            <button 
              onClick={() => generateQR('store')}
              className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Regenerate
            </button>
          )}
        </div>
        {store?.qr_code && (
          <p className="text-sm text-gray-600 mb-3 text-center">
            💡 Click on the QR code to navigate to the store page
          </p>
        )}
        {store?.qr_code ? (
          <div className="flex flex-col items-center">
            <img 
              src={store.qr_code} 
              alt="Store QR" 
              className="w-48 h-48 cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300 rounded-lg" 
              onClick={() => handleQRCodeClick('store')}
              title="Click to navigate to store page"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">Click to navigate</p>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = store.qr_code;
                link.download = `store-qr-code-${user.storeId || user.id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
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
        {sections.some(section => section.qr_code) && (
          <p className="text-sm text-gray-600 mb-3 text-center">
            💡 Click on any QR code to navigate to that section's page
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map(section => (
            <div key={section.id} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{section.name}</h3>
                {section.qr_code && (
                  <button 
                    onClick={() => generateQR('section', section.id)}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Regenerate
                  </button>
                )}
              </div>
              {section.qr_code ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={section.qr_code} 
                    alt={`${section.name} QR`} 
                    className="w-32 h-32 cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300 rounded-lg"
                    onClick={() => handleQRCodeClick('section', section.id)}
                    title={`Click to navigate to ${section.name} section`}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">Click to navigate</p>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = section.qr_code;
                      link.download = `section-${section.id}-qr-code.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
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