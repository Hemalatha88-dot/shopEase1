import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const StoreLanding = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // track QR scan (anonymous)
        await api.post('/analytics/qr-scan', { store_id: storeId });
        const { data } = await api.get(`/stores/${storeId}/public`);
        setStore(data.data.store);
        setSections(data.data.sections || []);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load store');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Welcome to {store?.name}
            </h1>
            {store?.description && (
              <p className="text-xl text-indigo-100 mb-6 max-w-3xl mx-auto">
                {store.description}
              </p>
            )}
            {store?.address && (
              <div className="flex items-center justify-center text-indigo-100 mb-8">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{store.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link
            to={`/offers/${storeId}`}
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore Offers</h3>
              <p className="text-gray-600 mb-4">Discover amazing deals and promotions available in our store</p>
              <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-indigo-800">
                View All Offers
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            to={`/feedback/${storeId}`}
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Give Feedback</h3>
              <p className="text-gray-600 mb-4">Share your experience and help us improve our service</p>
              <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-indigo-800">
                Share Feedback
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Store Sections */}
      {sections.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Department</h2>
            <p className="text-lg text-gray-600">Explore offers from specific sections of our store</p>
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.map((section, index) => (
              <Link 
                key={section.id} 
                to={`/offers/${storeId}/section/${section.id}`} 
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                    index % 4 === 0 ? 'bg-red-100 text-red-600' :
                    index % 4 === 1 ? 'bg-blue-100 text-blue-600' :
                    index % 4 === 2 ? 'bg-green-100 text-green-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    <ShoppingBagIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {section.name}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{section.description}</p>
                  )}
                  <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-800">
                    View Offers
                    <svg className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Store Info Footer */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Store Information</h3>
              {store?.address && (
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="text-gray-300">{store.address}</span>
                </div>
              )}
              {store?.phone && (
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="text-gray-300">{store.phone}</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to={`/offers/${storeId}`} className="block text-gray-300 hover:text-white transition-colors">
                  Browse All Offers
                </Link>
                <Link to={`/feedback/${storeId}`} className="block text-gray-300 hover:text-white transition-colors">
                  Leave Feedback
                </Link>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4">Experience</h3>
              <div className="flex items-center justify-center md:justify-end mb-2">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-gray-300">Scan QR codes for instant offers</span>
              </div>
              <p className="text-sm text-gray-400">Powered by ShopEase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLanding; 