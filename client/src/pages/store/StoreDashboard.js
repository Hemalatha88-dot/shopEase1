import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { 
  ChartBarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ArrowPathIcon,
  QrCodeIcon,
  ClockIcon,
  EyeIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const StoreDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(() => ({
    totalOffers: 0,
    totalSections: 0,
    totalFeedback: 0,
    totalScans: 0,
    totalQRCodes: 0,
    storeName: '',
    scanAnalytics: {
      bySection: {},
      totalScans: 0,
      recentScans: []
    }
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Sales data is now part of the stats object

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize default values
      let storeName = 'Your Store';
      let totalSections = 0;
      let totalOffers = 0;
      let totalFeedback = 0;
      let totalScans = 0;
      let totalQRCodes = 0;
      let salesData = {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        dailySales: []
      };

      try {
        // Fetch sections count
        const sectionsResponse = await api.get('/stores/sections');
        totalSections = sectionsResponse.data?.data?.length || 0;
      } catch (sectionsError) {
        console.warn('Error fetching sections:', sectionsError);
      }

      try {
        // Fetch offers count
        const offersResponse = await api.get(`/offers?storeId=${user?.storeId || user?.id}`);
        totalOffers = offersResponse.data?.data?.length || 0;
      } catch (offersError) {
        console.warn('Error fetching offers:', offersError);
      }

      try {
        // Fetch sales data
        const salesResponse = await api.get(`/analytics/sales?store_id=${user?.storeId || user?.id}`);
        const salesDataList = salesResponse.data?.data || [];
        
        // Process sales data
        if (salesDataList.length > 0) {
          const totalRevenue = salesDataList.reduce((sum, sale) => sum + parseFloat(sale.total_sales || 0), 0);
          const totalOrders = salesDataList.reduce((sum, sale) => sum + (parseInt(sale.total_orders) || 0), 0);
          const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          
          salesData = {
            totalRevenue,
            totalOrders,
            averageOrderValue: avgOrderValue,
            dailySales: salesDataList.map(sale => ({
              date: sale.date,
              total: parseFloat(sale.total_sales || 0),
              orders: parseInt(sale.total_orders || 0)
            })).sort((a, b) => new Date(a.date) - new Date(b.date))
          };
        }
      } catch (salesError) {
        console.warn('Error fetching sales data:', salesError);
      }
      
      // try {
      //   // Fetch feedback count
      //   const feedbackResponse = await api.get(`/feedback?storeId=${user?.storeId || user?.id}`);
      //   totalFeedback = feedbackResponse.data?.data?.length || 0;
      // } catch (feedbackError) {
      //   console.warn('Error fetching feedback:', feedbackError);
      // }

      try {
        // Fetch QR scans data
        const scansResponse = await api.get(`/analytics/qr-scans?store_id=${user?.storeId || user?.id}`);
        const scansData = scansResponse.data?.data || [];
        totalScans = scansData.length;
        
        // Process scan data by section
        const bySection = {};
        scansData.forEach(scan => {
          const sectionName = scan.section_name || 'General';
          bySection[sectionName] = (bySection[sectionName] || 0) + 1;
        });
        
        // Get recent scans (last 5)
        const recentScans = scansData
          .slice(0, 5)
          .map(scan => ({
            id: scan.id,
            section: scan.section_name || 'General',
            time: new Date(scan.scan_time).toLocaleString(),
            device: /Mobile/.test(scan.user_agent) ? 'Mobile' : 'Desktop'
          }));
        
        // Update stats with analytics
        setStats(prev => ({
          ...prev,
          scanAnalytics: {
            bySection,
            totalScans,
            recentScans
          },
          salesData
        }));
        
      } catch (scanError) {
        console.warn('Error fetching QR scan data:', scanError);
      }

      // Commented out until QR codes endpoint is implemented
      // try {
      //   // Fetch total QR codes generated for this store
      //   const qrCodesResponse = await api.get(`/qrcodes?storeId=${user?.storeId || user?.id}`);
      //   totalQRCodes = qrCodesResponse.data?.data?.length || 0;
      // } catch (qrError) {
      //   console.warn('Error fetching QR codes data:', qrError);
      // }

      setStats(prev => ({
        ...prev,
        storeName,
        totalOffers,
        totalSections,
        totalFeedback,
        totalScans,
        totalQRCodes,
        scanAnalytics: prev.scanAnalytics || {
          bySection: {},
          totalScans: 0,
          recentScans: []
        }
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.storeId, user?.id]);

  useEffect(() => {
    if (user?.storeId || user?.id) {
      fetchDashboardStats();
    }
  }, [user?.storeId, user?.id, fetchDashboardStats]);

  const refreshData = () => {
    fetchDashboardStats();
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
      title: 'Create Sub Store',
      description: 'Add a new sub store to your store',
      icon: QrCodeIcon,
      href: '/store-manager/sections',
      color: 'bg-green-500'
    },
    // {
    //   title: 'View Analytics',
    //   description: 'Check your store performance',
    //   icon: ChartBarIcon,
    //   href: '/store-manager/analytics',
    //   color: 'bg-purple-500'
    // },
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
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 w-full max-w-md">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Store Manager'}</h1>
          <p className="text-gray-600">Here's what's happening with {stats.storeName} today</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {/* Total Offers */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Offers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOffers}</p>
                <p className="text-xs text-gray-500 mt-1">Active in your store</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link 
                to="/store-manager/offers" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all offers
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Total Sections */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sub Stores</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSections}</p>
                <p className="text-xs text-gray-500 mt-1">Active Sub Stores</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <QrCodeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link 
                to="/store-manager/sections" 
                className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
              >
                Manage Sub Stores
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Total Feedback */}
        {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Customer Feedback</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalFeedback}</p>
                <p className="text-xs text-gray-500 mt-1">Total received</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link 
                to="/store-manager/feedback" 
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
              >
                View feedback
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div> */}

        {/* Sales Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
          {/* Total Revenue Card */}
          {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${(stats.salesData?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div> */}

          {/* Total Orders Card */}
          {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.salesData?.totalOrders || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div> */}

          {/* Average Order Value */}
          {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${(stats.salesData?.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Per order</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Recent Sales */}
        {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
              <div className="flex gap-3">
                <Link 
                  to="/store-manager/sales" 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Sales Dashboard
                </Link>
                <Link 
                  to="/store-manager/sales" 
                  className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  View all sales
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(stats.salesData?.dailySales || []).slice(0, 5).map((sale, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${sale.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(sale.orders > 0 ? (sale.total / sale.orders) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {(!stats.salesData?.dailySales || stats.salesData.dailySales.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}

        {/* QR Code Analytics */}
        {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"> */}
          {/* <div className="p-5"> */}
            {/* <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">QR Code Analytics</h3>
              <div className="flex gap-3">
                <Link 
                  // to="/store-manager/qrcode-analytics" 
                  to="/store-manager/qrcode"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Detailed Analytics
                </Link>
              </div>
            </div> */}
            
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"> */}
              {/* Total Scans */}
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <EyeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Scans</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.qrAnalytics?.total_scans?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div> */}
              
              {/* Unique Visitors */}
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <UsersIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.qrAnalytics?.unique_visitors?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div> */}
              
              {/* Avg. Scans per Day */}
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <ClockIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Scans/Day</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.qrAnalytics?.avg_scans_per_day?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
            
            {/* <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <Link 
                  to="/store-manager/qr-codes" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Manage QR Codes
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  to="/store-manager/qrcode-analytics" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View all analytics
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div> */}
          {/* </div> */}
        {/* </div> */}

        {/* Sales Data */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${(stats.salesData?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.salesData?.totalOrders || 0} total orders</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-2">Recent Sales</div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(stats.salesData?.dailySales || []).slice(-5).reverse().map((sale, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(sale.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium">
                      ${sale.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <Link 
                // to="/store-manager/analytics" 
                to="/store-manager/sales"
                className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
              >
                View all sales
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* QR Code Scans Analytics */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">QR Code Scans</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.scanAnalytics.totalScans}</p>
                <p className="text-xs text-gray-500 mt-1">Total scans across all sections</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            {/* Scans by Section */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Scans by Sub Store</h4>
              <div className="space-y-2">
                {Object.entries(stats.scanAnalytics.bySection).map(([section, count]) => (
                  <div key={section} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{section}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Scans */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Scans</h4>
              <div className="space-y-2 text-sm">
                {stats.scanAnalytics.recentScans.length > 0 ? (
                  stats.scanAnalytics.recentScans.map(scan => (
                    <div key={scan.id} className="flex justify-between text-gray-600">
                      <span>{scan.section}</span>
                      <span className="text-xs text-gray-500">{scan.device} • {scan.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent scans</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              {/* <Link 
                to="/store-manager/analytics" 
                // to="/store-manager/qrcode-analytics"
                className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center"
              >
                View detailed analytics
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link> */}

              <div className='flex justify-between items-center'>
              <Link 
                  to="/store-manager/qr-codes" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Manage QR Codes
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  to="/store-manager/qrcode-analytics" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View all analytics
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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