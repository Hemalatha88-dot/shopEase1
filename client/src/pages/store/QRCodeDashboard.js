import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  UsersIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, BarChart, PieChart } from 'recharts';

const QRCodeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  // Initialize with null values to indicate loading state
  const [analytics, setAnalytics] = useState({
    total_scans: null,
    unique_visitors: null,
    avg_scans_per_day: null,
    daily_scans: null,
    hourly_distribution: null,
    section_breakdown: null,
    all_scans: []
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);
      
      // Use the working qr-scans endpoint
      const response = await api.get(`/analytics/qr-scans?${params}`);
      const scans = response.data.data || [];
      
      // Transform the data to match our expected format
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      
      // Group scans by date for daily trend
      const dailyScans = {};
      const hourlyDistribution = Array(24).fill(0).map((_, i) => ({
        hour: i,
        scans: 0
      }));
      
      const sectionCounts = {};
      
      scans.forEach(scan => {
        // Process daily scans
        const scanDate = new Date(scan.scan_time).toISOString().split('T')[0];
        dailyScans[scanDate] = (dailyScans[scanDate] || 0) + 1;
        
        // Process hourly distribution
        const hour = new Date(scan.scan_time).getHours();
        hourlyDistribution[hour].scans++;
        
        // Process section breakdown
        if (scan.section_id) {
          sectionCounts[scan.section_id] = {
            section_id: scan.section_id,
            section_name: scan.section_name || `Section ${scan.section_id}`,
            scan_count: (sectionCounts[scan.section_id]?.scan_count || 0) + 1
          };
        }
      });
      
      // Convert dailyScans object to array
      const dailyScansArray = Object.entries(dailyScans).map(([date, scans]) => ({
        date,
        scans
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Get unique visitors (based on IP for now)
      const uniqueIPs = new Set(scans.map(scan => scan.ip_address));
      
      // Calculate average scans per day
      const days = Math.max(1, (new Date(dateRange.end_date || new Date()) - new Date(dateRange.start_date || thirtyDaysAgo)) / (1000 * 60 * 60 * 24));
      const avgScansPerDay = scans.length / days;
      
      // Format scan time for display
      const formattedScans = scans.map(scan => ({
        ...scan,
        formatted_time: new Date(scan.scan_time).toLocaleString(),
        device: scan.user_agent ? 
          (scan.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop') : 'Unknown'
      }));

      setAnalytics({
        total_scans: scans.length,
        unique_visitors: uniqueIPs.size,
        avg_scans_per_day: avgScansPerDay,
        daily_scans: dailyScansArray,
        hourly_distribution: hourlyDistribution,
        section_breakdown: Object.values(sectionCounts),
        all_scans: formattedScans
      });
    } catch (err) {
      console.error('Failed to fetch QR code analytics:', err);
      setError('Failed to load QR code analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading || analytics.total_scans === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <ArrowPathIcon className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Analytics</h1>
        {/* <Link 
          to="/store-manager" 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Dashboard
        </Link> */}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Scans */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <EyeIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Scans</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.total_scans?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.unique_visitors?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        {/* Avg Scans per Day */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Scans/Day</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.avg_scans_per_day ? analytics.avg_scans_per_day.toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Scans Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Scans</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.daily_scans || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scans" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution Bar Chart */}
        {/* <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.hourly_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scans" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}



         {/* Scans by Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-0">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Scans by Section</h3>
          <div className="space-y-8">
            {analytics.section_breakdown && analytics.section_breakdown.length > 0 ? (
              analytics.section_breakdown.map((section) => (
                <div key={section.section_id} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{section.section_name}</span>
                    <span className="font-medium">{section.scan_count?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{
                        width: `${(section.scan_count / analytics.total_scans * 100) || 0}%`,
                        minWidth: '0.5rem',
                        maxWidth: '100%'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No section data available</p>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Section Breakdown */}
      {/* <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Section Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.section_breakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="scans"
                  nameKey="section_name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(analytics.section_breakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.section_breakdown.map((section, index) => (
                  <tr key={section.section_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-4 w-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{section.section_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {section.scans?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {((section.scans / analytics.total_scans) * 100 || 0).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}

     

      {/* All Scans Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium text-gray-900">All QR Code Scans</h3>
            <p className="mt-1 text-sm text-gray-500">A list of all QR code scans with their details.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full border-b border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scan Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.all_scans.length > 0 ? (
                  analytics.all_scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {scan.formatted_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.section_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          scan.device === 'Mobile' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {scan.device}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.ip_address}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No scan data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDashboard;
