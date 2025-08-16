import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBagIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const QRCodeLanding = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [store, setStore] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await api.get(`/stores/${storeId}`);
        if (response.data.success) {
          setStore(response.data.data);
        } else {
          setError('Store not found');
        }
      } catch (err) {
        setError('Failed to load store details');
        console.error('Error fetching store:', err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreDetails();
    } else {
      setLoading(false);
      setError('Invalid store URL');
    }
  }, [storeId]);

  const handleExploreOffers = () => {
    navigate(`/offers/${storeId}`);
  };

  const handleGiveFeedback = () => {
    navigate(`/feedback/${storeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading store information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {store?.name || 'Welcome to ShopEase'}
              </h1>
              {store?.tagline && (
                <p className="text-gray-600 mt-1">{store.tagline}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-indigo-100 mb-6">
              <ShoppingBagIcon className="h-16 w-16 text-indigo-600" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome to {store?.name || 'our store'}
            </h2>
            
            <p className="text-gray-600 mb-8">
              Discover amazing offers and share your feedback with us
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleExploreOffers}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Explore Offers
              </button>
              
              <button
                onClick={handleGiveFeedback}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-gray-600" />
                Give Feedback
              </button>
            </div>
            
            <p className="mt-6 text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Not {store?.name || 'this store'}? Scan the correct QR code</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            Powered by <span className="font-medium text-indigo-600">ShopEase</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QRCodeLanding;
