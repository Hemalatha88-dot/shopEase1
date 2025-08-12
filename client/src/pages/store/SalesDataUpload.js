import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const SalesDataUpload = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      const response = await api.get('/stores/sales', {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      setSalesData(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('date', dateRange.startDate);

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const response = await api.post('/stores/sales/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        setSelectedFile(null);
        setUploadProgress(0);
        fetchSalesData();
        alert('Sales data uploaded successfully!');
      }
    } catch (error) {
      console.error('Sales upload failed:', error);
      alert('Failed to upload sales data. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['Order ID', 'Customer Name', 'Phone', 'Email', 'Product Name', 'Category', 'Quantity', 'Unit Price', 'Total Amount', 'Payment Method', 'Transaction Date', 'Store Section'],
      ['ORD001', 'John Doe', '+1234567890', 'john@example.com', 'Premium T-Shirt', 'Fashion', '2', '25.00', '50.00', 'Credit Card', '2024-01-15 14:30:00', 'Men\'s Fashion'],
      ['ORD002', 'Jane Smith', '+1234567891', 'jane@example.com', 'Running Shoes', 'Sports', '1', '80.00', '80.00', 'Cash', '2024-01-15 15:45:00', 'Sports']
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    template.forEach(row => {
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesData = () => {
    if (salesData.length === 0) {
      alert('No sales data to export');
      return;
    }

    const csvContent = [
      ['Order ID', 'Customer Name', 'Phone', 'Email', 'Product Name', 'Category', 'Quantity', 'Unit Price', 'Total Amount', 'Payment Method', 'Transaction Date', 'Store Section'],
      ...salesData.map(sale => [
        sale.orderId,
        sale.customerName,
        sale.phone,
        sale.email,
        sale.productName,
        sale.category,
        sale.quantity,
        sale.unitPrice,
        sale.totalAmount,
        sale.paymentMethod,
        sale.transactionDate,
        sale.storeSection
      ])
    ];

    let csvString = csvContent.map(row => row.join(",")).join("\r\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_data_${dateRange.startDate}_${dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const calculateStats = () => {
    if (salesData.length === 0) return {};

    const totalSales = salesData.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
    const totalOrders = salesData.length;
    const uniqueCustomers = new Set(salesData.map(sale => sale.customerName)).size;
    const avgOrderValue = totalSales / totalOrders;

    const categoryBreakdown = salesData.reduce((acc, sale) => {
      acc[sale.category] = (acc[sale.category] || 0) + parseFloat(sale.totalAmount);
      return acc;
    }, {});

    return {
      totalSales: totalSales.toFixed(2),
      totalOrders,
      uniqueCustomers,
      avgOrderValue: avgOrderValue.toFixed(2),
      categoryBreakdown
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Data Management</h1>
        <p className="text-gray-600">Upload and manage your daily sales data for analytics</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchSalesData}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {salesData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalSales}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unique Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.uniqueCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.avgOrderValue}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Sales Data</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Download Template
            </button>
            
            <button
              onClick={exportSalesData}
              disabled={salesData.length === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Data
            </button>
          </div>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Sales Excel File (.xlsx, .xls, .csv)
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </div>
            )}

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p className="font-medium mb-2">Required columns in your Excel file:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Order ID - Unique identifier for each order</li>
                <li>Customer Name - Name of the customer</li>
                <li>Phone - Customer phone number</li>
                <li>Email - Customer email address</li>
                <li>Product Name - Name of the product purchased</li>
                <li>Category - Product category (e.g., Fashion, Electronics)</li>
                <li>Quantity - Number of items purchased</li>
                <li>Unit Price - Price per unit</li>
                <li>Total Amount - Total amount for this line item</li>
                <li>Payment Method - How customer paid (Cash, Card, etc.)</li>
                <li>Transaction Date - Date and time of purchase</li>
                <li>Store Section - Which section of the store</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Sales Data'}
            </button>
          </form>
        </div>
      </div>

      {/* Sales Data Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Sales Data ({salesData.length} records)
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {dateRange.startDate} to {dateRange.endDate}
            </p>
          </div>
        </div>
        
        {salesData.length === 0 ? (
          <div className="text-center py-12">
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data</h3>
            <p className="mt-1 text-sm text-gray-500">Upload your sales data to get started with analytics.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesData.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{sale.customerName}</div>
                        <div className="text-gray-500">{sale.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{parseFloat(sale.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.transactionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDataUpload; 