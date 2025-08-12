import React from 'react';
import { 
  TagIcon, 
  SparklesIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const ProductCard = ({ offer }) => {
  const hasValidDates = offer.valid_from || offer.valid_until;
  const isExpiringSoon = offer.valid_until && new Date(offer.valid_until) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {offer.image_url ? (
          <img 
            src={offer.image_url} 
            alt={offer.title} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <SparklesIcon className="h-12 w-12 text-indigo-400 mx-auto mb-2" />
              <span className="text-indigo-600 font-medium">Special Offer</span>
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        {offer.discount_percentage != null && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {offer.discount_percentage}% OFF
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {offer.category && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 backdrop-blur text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <TagIcon className="h-3 w-3 mr-1" />
              {offer.category}
            </div>
          </div>
        )}
        
        {/* Expiring Soon Badge */}
        {isExpiringSoon && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              Ending Soon
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {offer.title}
        </h3>
        
        {offer.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {offer.description}
          </p>
        )}
        
        {/* Pricing Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {offer.offer_price && (
              <span className="text-2xl font-bold text-indigo-600">
                ₹{Number(offer.offer_price).toFixed(2)}
              </span>
            )}
            {offer.original_price && offer.offer_price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{Number(offer.original_price).toFixed(2)}
              </span>
            )}
          </div>
          
          {offer.offer_price && offer.original_price && (
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">
                Save ₹{(Number(offer.original_price) - Number(offer.offer_price)).toFixed(2)}
              </div>
            </div>
          )}
        </div>
        
        {/* Validity Section */}
        {hasValidDates && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center text-xs text-gray-500">
              <ClockIcon className="h-3 w-3 mr-1" />
              {offer.valid_from && offer.valid_until ? (
                <span>
                  Valid: {new Date(offer.valid_from).toLocaleDateString()} - {new Date(offer.valid_until).toLocaleDateString()}
                </span>
              ) : offer.valid_until ? (
                <span>Valid until: {new Date(offer.valid_until).toLocaleDateString()}</span>
              ) : (
                <span>Valid from: {new Date(offer.valid_from).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Subcategory */}
        {offer.subcategory && (
          <div className="mt-2">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {offer.subcategory}
            </span>
          </div>
        )}
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default ProductCard; 