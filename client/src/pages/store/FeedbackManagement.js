import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  StarIcon as StarIconSolid,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const FeedbackManagement = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRatings: {
      overall: 0,
      service: 0,
      product: 0,
      cleanliness: 0,
      value: 0
    }
  });

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/feedback/store/${user?.storeId || user?.id}`);
      setFeedback(response.data.data || []);
      calculateStats(response.data.data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (feedbackData) => {
    if (!feedbackData.length) return;
    
    const totals = feedbackData.reduce((acc, curr) => ({
      overall: acc.overall + (curr.overall_rating || 0),
      service: acc.service + (curr.service_rating || 0),
      product: acc.product + (curr.product_rating || 0),
      cleanliness: acc.cleanliness + (curr.cleanliness_rating || 0),
      value: acc.value + (curr.value_rating || 0)
    }), { overall: 0, service: 0, product: 0, cleanliness: 0, value: 0 });

    setStats({
      totalFeedback: feedbackData.length,
      averageRatings: {
        overall: (totals.overall / feedbackData.length).toFixed(1),
        service: (totals.service / feedbackData.length).toFixed(1),
        product: (totals.product / feedbackData.length).toFixed(1),
        cleanliness: (totals.cleanliness / feedbackData.length).toFixed(1),
        value: (totals.value / feedbackData.length).toFixed(1)
      }
    });
  };

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIconSolid
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}. <button onClick={fetchFeedback} className="font-medium text-red-700 underline hover:text-red-600">Try again</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600 mt-2">View and analyze customer feedback and ratings</p>
        </div>
        <button
          onClick={fetchFeedback}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Feedback</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalFeedback}</p>
        </div>
        
        {Object.entries(stats.averageRatings).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 capitalize">Avg. {key}</h3>
            <div className="mt-2 flex items-center">
              {renderStars(parseFloat(value))}
              <span className="ml-2 text-gray-900 font-bold">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Feedback */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Feedback</h3>
        </div>
        
        {feedback.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No feedback available yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {feedback.map((item) => (
              <li key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {renderStars(item.overall_rating)}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {item.overall_rating.toFixed(1)} out of 5
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <ClockIcon className="inline-block h-4 w-4 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                    
                    {item.comments && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{item.comments}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {item.service_rating > 0 && (
                        <div>
                          <p className="text-gray-500">Service</p>
                          <div className="flex">
                            {renderStars(item.service_rating)}
                          </div>
                        </div>
                      )}
                      {item.product_rating > 0 && (
                        <div>
                          <p className="text-gray-500">Products</p>
                          <div className="flex">
                            {renderStars(item.product_rating)}
                          </div>
                        </div>
                      )}
                      {item.cleanliness_rating > 0 && (
                        <div>
                          <p className="text-gray-500">Cleanliness</p>
                          <div className="flex">
                            {renderStars(item.cleanliness_rating)}
                          </div>
                        </div>
                      )}
                      {item.value_rating > 0 && (
                        <div>
                          <p className="text-gray-500">Value</p>
                          <div className="flex">
                            {renderStars(item.value_rating)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement; 