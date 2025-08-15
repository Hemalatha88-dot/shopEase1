import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  SparklesIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useShopperContext } from '../contexts/ShopperContext';

const OfferCatalog = () => {
  const { storeId, sectionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { customer, isAuthenticated, logoutCustomer } = useShopperContext();

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('all');
  const [store, setStore] = useState(null);
  const [section, setSection] = useState(null);
  const [showScrollPopup, setShowScrollPopup] = useState(false);
  const [scrolledItems, setScrolledItems] = useState(0);

  const resolvedStoreId = storeId || searchParams.get('storeId');
  const resolvedSectionId = sectionId || searchParams.get('sectionId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all offers from all stores
        const offersResponse = await api.get('/offers/all');
        const offersData = offersResponse.data.data || [];
        
        setOffers(offersData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(offersData.map(offer => offer.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Extract unique stores
        const uniqueStores = [...new Set(offersData.map(offer => ({
          id: offer.store_id,
          name: offer.store_name
        })).filter(store => store.name))];
        setStores(uniqueStores);
        
        // If we have a specific store ID from URL, set it as selected
        if (resolvedStoreId) {
          setSelectedStore(resolvedStoreId);
        }
        
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load offers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [resolvedStoreId, sectionId]);

  // Filter offers based on search, category, and store
  useEffect(() => {
    let filtered = offers;
    
    if (selectedStore !== 'all') {
      filtered = filtered.filter(offer => offer.store_id.toString() === selectedStore.toString());
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOffers(filtered);
  }, [offers, selectedCategory, selectedStore, searchTerm]);

  const isUserAuthenticated = isAuthenticated;
  // Show only 3 offers initially for unauthenticated users
  const visibleOffers = isUserAuthenticated ? filteredOffers : filteredOffers.slice(0, 3);
  const hasMoreOffers = filteredOffers.length > 3;

  // Scroll detection for registration popup
  useEffect(() => {
    if (isAuthenticated || showScrollPopup || !hasMoreOffers) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show popup when user scrolls down significantly (more than 60% of viewport)
      const scrollThreshold = windowHeight * 0.6;
      
      // Or when user reaches near the end of visible offers
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      
      if (scrollPosition > scrollThreshold || scrollPercentage > 0.5) {
        setShowScrollPopup(true);
        setScrolledItems(3); // Show that they've seen 3 items
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, showScrollPopup, hasMoreOffers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading amazing offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load offers</h2>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              All Store Offers
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Discover amazing deals from all our partner stores
            </p>
          </div>
        </div>
        
        {/* Temporary Test Button - Remove in production */}
        {isAuthenticated && (
          <button
            onClick={() => {
              logoutCustomer();
              window.location.reload();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Test Logout (Demo)
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Store Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Stores</option>
                {stores.map(store => (
                  // <option key={store.id} value={store.id}>{store.name}</option>
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <TagIcon className="inline h-4 w-4 mr-1" />
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Offers Grid */}
        {visibleOffers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {visibleOffers.map((offer, index) => (
                <div
                  key={offer.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard offer={offer} />
                </div>
              ))}
            </div>
            
            {/* Load More Section for Unauthenticated Users */}
            {!isUserAuthenticated && hasMoreOffers && (
              <div className="text-center py-8 mb-8">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                  <div className="mb-4">
                    <div className="text-4xl mb-2">🎁</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {filteredOffers.length - 3} More Amazing Offers Waiting!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Register now to unlock all exclusive deals and special discounts
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowScrollPopup(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    View All {filteredOffers.length} Offers 🚀
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Quick signup • Just name, email & mobile • OTP verification
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No offers are currently available'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Scroll-Triggered Registration Popup */}
        {showScrollPopup && !isUserAuthenticated && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-slideUp">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <SparklesIcon className="h-6 w-6 text-white mr-2" />
                    <h3 className="text-lg font-bold text-white">Unlock More Offers!</h3>
                  </div>
                  <button
                    onClick={() => setShowScrollPopup(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="text-4xl mb-2">🎁</div>
                  <p className="text-gray-700 text-sm mb-4">
                    You've browsed {scrolledItems} offers! Register now to unlock all {filteredOffers.length} exclusive deals and special discounts.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-lg font-bold text-green-600">{filteredOffers.length}</div>
                      <div className="text-gray-600">Total Offers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">🔥</div>
                      <div className="text-gray-600">Hot Deals</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">⚡</div>
                      <div className="text-gray-600">Instant Access</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowScrollPopup(false);
                      navigate('/customer/auth', { 
                        state: { 
                          redirectTo: `/offers/${resolvedStoreId}${resolvedSectionId ? `/section/${resolvedSectionId}` : ''}` 
                        } 
                      });
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Register Now - It's Free! 🚀
                  </button>
                  
                  <button
                    onClick={() => setShowScrollPopup(false)}
                    className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  Quick signup • Just name, email & mobile • OTP verification
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCatalog; 