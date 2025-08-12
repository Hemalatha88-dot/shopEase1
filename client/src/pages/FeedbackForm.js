import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  StarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../services/api';

const FeedbackForm = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [feedback, setFeedback] = useState({
    overall_rating: 0,
    service_rating: 0,
    product_rating: 0,
    cleanliness_rating: 0,
    value_rating: 0,
    comments: ''
  });

  const ratingCategories = [
    {
      key: 'overall_rating',
      label: 'Overall Experience',
      description: 'How was your overall shopping experience?',
      icon: FaceSmileIcon,
      color: 'text-purple-600'
    },
    {
      key: 'service_rating',
      label: 'Customer Service',
      description: 'How helpful and friendly was our staff?',
      icon: HeartIcon,
      color: 'text-pink-600'
    },
    {
      key: 'product_rating',
      label: 'Product Quality',
      description: 'How satisfied are you with our products?',
      icon: StarIcon,
      color: 'text-yellow-600'
    },
    {
      key: 'cleanliness_rating',
      label: 'Store Cleanliness',
      description: 'How clean and organized was our store?',
      icon: BuildingStorefrontIcon,
      color: 'text-green-600'
    },
    {
      key: 'value_rating',
      label: 'Value for Money',
      description: 'How do you rate our pricing and value?',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-blue-600'
    }
  ];

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get(`/stores/${storeId}/public`);
        setStore(data.data.store);
      } catch (e) {
        setError('Failed to load store information');
      } finally {
        setLoading(false);
      }
    };
    
    if (storeId) fetchStore();
  }, [storeId]);

  const handleRatingChange = (category, rating) => {
    setFeedback(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (feedback.overall_rating === 0) {
      setError('Please provide at least an overall rating');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/feedback', {
        store_id: storeId,
        ...feedback
      });
      
      setSubmitted(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, size = 'h-8 w-8' }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`${size} transition-all duration-200 transform hover:scale-110 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            {star <= rating ? (
              <StarIconSolid className={size} />
            ) : (
              <StarIcon className={size} />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You! 🙏</h1>
            <p className="text-lg text-gray-600 mb-4">
              Your feedback has been submitted successfully
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">We appreciate your time!</h3>
            <p className="text-sm text-gray-600">
              Your feedback helps us improve our service and provide better experiences for all customers.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/offers/${storeId}`)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Browse More Offers
            </button>
            <button
              onClick={() => navigate(`/store/${storeId}`)}
              className="w-full bg-white text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Share Your Feedback</h1>
                <p className="text-sm text-gray-600">
                  Help us improve your experience at {store?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Info Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-8 py-6 text-center text-white">
            <BuildingStorefrontIcon className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">{store?.name}</h2>
            {store?.address && (
              <p className="text-indigo-100">{store.address}</p>
            )}
            <p className="text-indigo-100 mt-2">
              We value your opinion and would love to hear about your experience!
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Rating Categories */}
              <div className="space-y-8">
                {ratingCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.key} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg bg-gray-50 ${category.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {category.label}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {category.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <StarRating
                              rating={feedback[category.key]}
                              onRatingChange={(rating) => handleRatingChange(category.key, rating)}
                            />
                            {feedback[category.key] > 0 && (
                              <span className="text-sm font-medium text-gray-700">
                                {feedback[category.key]} / 5
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comments Section */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Additional Comments (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Share any specific feedback, suggestions, or compliments
                </p>
                <textarea
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us more about your experience..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting || feedback.overall_rating === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Feedback...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <HeartIcon className="h-5 w-5 mr-2" />
                      Submit Feedback
                    </div>
                  )}
                </button>
                
                {feedback.overall_rating === 0 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Please provide at least an overall rating to submit
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your feedback is anonymous and will be used to improve our services. 
            We respect your privacy and will not share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm; 