import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import SalesMetrics from '../../components/SalesMetrics';
import {
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  // ShoppingCartIcon,
  EyeIcon,
  // UserGroupIcon,
  // ChartBarIcon,
  ClockIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  TagIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [showSalesUpload, setShowSalesUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // Generate static analytics data
  const generateStaticAnalytics = useCallback((startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate ? new Date(endDate) : now;
    
    // Calculate days between dates
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const daysInRange = Math.min(Math.max(daysDiff, 1), 90); // Limit to 90 days max for performance
    
    // Generate hourly data for the current day
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      scans: Math.floor(Math.random() * 50) + 10,
      sales: Math.floor(Math.random() * 30) + 5,
    }));

    // Generate daily data for the selected date range
    const dailyData = Array.from({ length: daysInRange }, (_, i) => {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      return {
        date: currentDate.toISOString().split('T')[0],
        scans: Math.floor(Math.random() * 100) + 50,
        sales: Math.floor(Math.random() * 70) + 30,
      };
    });

    // Section-wise data
    const sections = [
      { name: 'Electronics', color: '#8884d8' },
      { name: 'Fashion', color: '#82ca9d' },
      { name: 'Home & Kitchen', color: '#ffc658' },
      { name: 'Beauty', color: '#ff8042' },
      { name: 'Sports', color: '#0088FE' },
    ];

    const sectionData = sections.map(section => ({
      ...section,
      scans: Math.floor(Math.random() * 500) + 100,
      sales: Math.floor(Math.random() * 10000) + 2000,
    }));

    // Calculate metrics
    const totalScans = sectionData.reduce((sum, section) => sum + section.scans, 0);
    const totalSales = sectionData.reduce((sum, section) => sum + section.sales, 0);
    const conversionRate = totalScans > 0 ? (totalSales / totalScans * 100).toFixed(1) : 0;
    const avgOrderValue = (totalSales / (totalScans * 0.3)).toFixed(2); // Assuming 30% conversion

    return {
      total_scans: totalScans,
      unique_visitors: Math.floor(totalScans * 0.7),
      total_sales: totalSales,
      total_orders: Math.floor(totalScans * 0.3), // 30% conversion rate
      conversion_rate: conversionRate,
      avg_order_value: avgOrderValue,
      hourly_data: hourlyData,
      daily_data: dailyData,
      section_data: sectionData,
      last_updated: new Date().toISOString(),
    };
  }, []);

  const fetchSalesData = useCallback(async () => {
    try {
      setSalesLoading(true);
      const params = new URLSearchParams();
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);
      
      const response = await api.get(`/sales?${params}`);
      setSalesData(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
      setError('Failed to load sales data. Some metrics may be incomplete.');
      setSalesData([]);
    } finally {
      setSalesLoading(false);
    }
  }, [dateRange.start_date, dateRange.end_date]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      try {
        // Try to fetch from API first
        const params = new URLSearchParams();
        if (dateRange.start_date) params.append('start_date', dateRange.start_date);
        if (dateRange.end_date) params.append('end_date', dateRange.end_date);
        
        const response = await api.get(`/analytics/dashboard?${params}`);
        setAnalytics(response.data.data);
      } catch (apiError) {
        console.warn('Using static data due to API error:', apiError);
        // Fallback to static data if API fails
        const staticData = generateStaticAnalytics(dateRange.start_date, dateRange.end_date);
        setAnalytics(staticData);
        setError('Using sample data. Could not connect to the server.');
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data. Using sample data.');
      const staticData = generateStaticAnalytics(dateRange.start_date, dateRange.end_date);
      setAnalytics(staticData);
    } finally {
      setLoading(false);
    }
  }, [dateRange.start_date, dateRange.end_date, generateStaticAnalytics]);


  useEffect(() => {
    fetchAnalytics();
    fetchSalesData();
  }, [fetchAnalytics, fetchSalesData]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalesUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadProgress(0);
      setError('');
      setSuccess('');

      const response = await api.post('/analytics/sales-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        setSuccess(`Successfully uploaded ${response.data.data.imported.length} sales records`);
        setShowSalesUpload(false);
        setSelectedFile(null);
        setUploadProgress(0);
        fetchAnalytics(); // Refresh analytics data
      }
    } catch (error) {
      console.error('Sales upload failed:', error);
      setError(error.response?.data?.message || 'Failed to upload sales data');
    }
  };

  const exportData = async (type) => {
    try {
      const params = new URLSearchParams();
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);
      params.append('type', type);

      const response = await api.get(`/analytics/export?${params}`);

      // Convert to CSV and download
      const csvContent = convertToCSV(response.data.data);
      downloadCSV(csvContent, `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export data');
    }
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ];

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSalesUpload(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            Upload Sales Data
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={dateRange.start_date}
                onChange={handleDateRangeChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={dateRange.end_date}
                onChange={handleDateRangeChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Scans Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500 transform transition-all hover:scale-105">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <EyeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total QR Scans</dt>
                    <dd className="text-2xl font-bold text-gray-900">{analytics.total_scans?.toLocaleString() || '0'}</dd>
                    <dd className="flex items-center text-sm text-gray-500 mt-1">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span>12.5% from last month</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Unique Visitors Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500 transform transition-all hover:scale-105">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                    <dd className="text-2xl font-bold text-gray-900">{analytics.unique_visitors?.toLocaleString() || '0'}</dd>
                    <dd className="flex items-center text-sm text-gray-500 mt-1">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span>8.2% from last month</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Sales Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-500 transform transition-all hover:scale-105">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                  <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="text-2xl font-bold text-gray-900">${analytics.total_sales?.toLocaleString() || '0'}</dd>
                    <dd className="flex items-center text-sm text-gray-500 mt-1">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span>15.3% from last month</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-purple-500 transform transition-all hover:scale-105">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                  <TagIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd className="text-2xl font-bold text-gray-900">{analytics.conversion_rate || '0'}%</dd>
                    <dd className="flex items-center text-sm text-gray-500 mt-1">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span>2.1% from last month</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Metrics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSalesUpload(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Upload Sales
            </button>
            <button
              onClick={() => exportData('sales')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        <SalesMetrics 
          salesData={salesData} 
          isLoading={salesLoading} 
        />
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-lg shadow border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.conversion_rate || '0'}%</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-green-500 font-medium">+2.1%</span> from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Busiest Time */}
        <div className="bg-white p-5 rounded-lg shadow border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Busiest Time</p>
              <p className="text-2xl font-bold text-gray-900">2:00 PM - 4:00 PM</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-green-500 font-medium">+15%</span> more traffic
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Scans Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Scans</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.daily_data?.slice(-14)} // Last 14 days
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).getDate()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                  formatter={(value) => [value, 'Scans']}
                />
                <Line 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Section-wise Scans</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.section_data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="scans"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.section_data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    value,
                    props.payload.name,
                    `$${props.payload.sales?.toLocaleString()}`
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Hourly Activity */}
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.hourly_data}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scans" fill="#8884d8" name="QR Scans" />
                <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const types = ['scan', 'purchase', 'feedback'];
              const sections = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];
              const type = types[Math.floor(Math.random() * types.length)];
              const section = sections[Math.floor(Math.random() * sections.length)];
              const timeAgo = `${Math.floor(Math.random() * 60)} min ago`;
              
              return (
                <div key={i} className="flex items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-1">
                    {type === 'scan' ? (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <EyeIcon className="h-4 w-4 text-blue-600" />
                      </div>
                    ) : type === 'purchase' ? (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <ShoppingBagIcon className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {type === 'scan' ? 'New scan in ' : type === 'purchase' ? 'Purchase in ' : 'New feedback in '}
                      <span className="text-primary-600">{section}</span>
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 w-full text-center text-sm font-medium text-primary-600 hover:text-primary-500">
            View all activity
          </button>
        </div>
      </div>

      {/* Top Performing Sections */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Sections</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scans
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.section_data
                ?.sort((a, b) => b.scans - a.scans)
                .map((section, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-3 w-3 rounded-full" style={{ backgroundColor: section.color }}></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{section.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {section.scans.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      ${section.sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {((section.scans / analytics.total_scans) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Peak Hours */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-medium text-blue-800 mb-2">Peak Shopping Hours</h4>
            <p className="text-sm text-gray-700">
              Your busiest time is between <span className="font-semibold">2:00 PM - 4:00 PM</span> with an average of{' '}
              <span className="font-semibold">
                {Math.max(...(analytics.hourly_data?.map(h => h.scans) || [0]))} scans
              </span>{' '}
              during that period.
            </p>
          </div>

          {/* Top Section */}
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-medium text-green-800 mb-2">Top Performing Section</h4>
            {analytics.section_data?.length > 0 && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold" style={{ color: analytics.section_data[0].color }}>
                  {analytics.section_data[0].name}
                </span>{' '}
                leads with {analytics.section_data[0].scans.toLocaleString()} scans and ${analytics.section_data[0].sales.toLocaleString()} in sales.
              </p>
            )}
          </div>

          {/* Conversion Rate */}
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-medium text-purple-800 mb-2">Conversion Rate</h4>
            <p className="text-sm text-gray-700">
              Your current conversion rate is{' '}
              <span className="font-semibold">{analytics.conversion_rate || '0'}%</span>.
              {analytics.conversion_rate > 5 ? (
                <span className="text-green-600"> This is above average!</span>
              ) : (
                <span> Consider optimizing your offers and CTAs.</span>
              )}
            </p>
          </div>

          {/* Revenue Per Visitor */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-medium text-yellow-800 mb-2">Revenue Per Visitor</h4>
            <p className="text-sm text-gray-700">
              You're generating approximately{' '}
              <span className="font-semibold">
                ${((analytics.total_sales || 0) / (analytics.unique_visitors || 1)).toFixed(2)}
              </span>{' '}
              per visitor. This is a key metric for measuring the effectiveness of your QR campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportData('scans')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export QR Scans
          </button>
          <button
            onClick={() => exportData('sales')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Sales Data
          </button>
          <button
            onClick={() => exportData('feedback')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Feedback
          </button>
        </div>
      </div>

      {/* Sales Upload Modal */}
      {showSalesUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Sales Data</h3>
              <form onSubmit={handleSalesUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    required
                  />
                </div>
                
                {uploadProgress > 0 && (
                  <div className="mb-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSalesUpload(false);
                      setSelectedFile(null);
                      setUploadProgress(0);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || uploadProgress > 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;