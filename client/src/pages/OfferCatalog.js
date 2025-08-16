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
import { useAuth } from '../contexts/AuthContext';

const OfferCatalog = () => {
  const { storeId, sectionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [store, setStore] = useState(null);
  const [section, setSection] = useState(null);

  const resolvedStoreId = storeId || searchParams.get('storeId');
  const resolvedSectionId = sectionId || searchParams.get('sectionId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch store info
        const storeResponse = await api.get(`/stores/${resolvedStoreId}/public`);
        setStore(storeResponse.data.data.store);
        
        // Find section if specified
        if (resolvedSectionId) {
          const foundSection = storeResponse.data.data.sections?.find(s => s.id === resolvedSectionId);
          setSection(foundSection);
        }
        
        // Fetch offers
        const params = {};
        if (resolvedSectionId) params.section_id = resolvedSectionId;
        const offersResponse = await api.get(`/offers/store/${resolvedStoreId}`, { params });
        const offersData = offersResponse.data.data || [];
        
        setOffers(offersData);
        
        // Extract unique categories (normalize to strings to avoid 8 vs "8" duplicates)
        const uniqueCategories = [
          ...new Set(
            offersData
              .map(offer => offer.category)
              .filter(v => v !== null && v !== undefined && v !== '')
              .map(v => String(v).trim())
          )
        ];
        setCategories(uniqueCategories);
        
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load offers');
      } finally {
        setLoading(false);
      }
    };
    if (resolvedStoreId) fetchData();
  }, [resolvedStoreId, resolvedSectionId]);

  // Filter offers based on search and category
  useEffect(() => {
    let filtered = offers;
    
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
  }, [offers, selectedCategory, searchTerm]);

  const isUserAuthenticated = isAuthenticated() && isCustomer();
  const visibleOffers = isUserAuthenticated ? filteredOffers : filteredOffers.slice(0, 3);
  const showGate = !isUserAuthenticated && filteredOffers.length > 3;

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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {section ? `${section.name} Offers` : `${store?.name || 'Store'} Offers`}
                </h1>
                <p className="text-sm text-gray-600">
                  {section ? section.description : `Discover amazing deals at ${store?.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{filteredOffers.length} offers</span>
            </div>
          </div>
        </div>
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
                  <option key={`cat-${category}`} value={category}>{category}</option>
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
                key={`pill-${category}`}
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

        {/* Sign Up Gate */}
        {showGate && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-12 text-center text-white">
              <div className="mb-6">
                <UserPlusIcon className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Unlock All Offers!</h3>
                <p className="text-indigo-100 text-lg">
                  Sign up now to view all {filteredOffers.length} amazing offers and get exclusive deals
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{filteredOffers.length}+</div>
                    <div className="text-sm text-indigo-100">Total Offers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">🎯</div>
                    <div className="text-sm text-indigo-100">Exclusive Deals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">⚡</div>
                    <div className="text-sm text-indigo-100">Instant Access</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/customer/auth', { 
                  state: { 
                    redirectTo: `/offers/${resolvedStoreId}${resolvedSectionId ? `/section/${resolvedSectionId}` : ''}` 
                  } 
                })}
                className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign Up - It's Free! 🚀
              </button>
              
              <p className="text-xs text-indigo-200 mt-4">
                Quick signup with just your name, email, and phone number
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCatalog; 