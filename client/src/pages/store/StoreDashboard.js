import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  QrCodeIcon,
  TagIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const StoreDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOffers: 0,
    totalSections: 0,
    totalFeedback: 0,
    totalScans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user?.storeId]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch offers count
      const offersResponse = await axios.get('http://localhost:5000/api/offers');
      const offersCount = offersResponse.data.data?.length || 0;

      // Fetch sections count
      const sectionsResponse = await axios.get('http://localhost:5000/api/stores/sections');
      const sectionsCount = sectionsResponse.data.data?.length || 0;

      // Fetch feedback count
      const feedbackResponse = await axios.get(`http://localhost:5000/api/feedback/store/${user?.storeId}`);
      const feedbackCount = feedbackResponse.data.data?.feedback?.length || 0;

      // Fetch QR scans count (this would need to be implemented in analytics)
      const scansCount = 0; // Placeholder

      setStats({
        totalOffers: offersCount,
        totalSections: sectionsCount,
        totalFeedback: feedbackCount,
        totalScans: scansCount
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add New Offer',
      description: 'Create a new offer for your store',
      icon: PlusIcon,
      href: '/store-manager/offers',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Section',
      description: 'Add a new section to your store',
      icon: QrCodeIcon,
      href: '/store-manager/sections',
      color: 'bg-green-500'
    },
    {
      title: 'View Analytics',
      description: 'Check your store performance',
      icon: ChartBarIcon,
      href: '/store-manager/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage QR Codes',
      description: 'Generate and download QR codes',
      icon: QrCodeIcon,
      href: '/store-manager/qr-codes',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <QrCodeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Store Sections</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSections}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customer Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFeedback}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">QR Scans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="card-hover p-6 text-center group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${action.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TagIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">New offer created</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <QrCodeIcon className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">QR code generated</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">New customer feedback</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default StoreDashboard; 