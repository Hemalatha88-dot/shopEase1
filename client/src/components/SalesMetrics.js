import React from 'react';
import { 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  TagIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const SalesMetrics = ({ salesData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Process sales data for the chart
  const processSalesTrend = (sales) => {
    if (!sales || sales.length === 0) return [];
    
    const salesByDate = {};
    
    sales.forEach(sale => {
      const date = sale.sale_date ? new Date(sale.sale_date).toISOString().split('T')[0] : 'Unknown';
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += parseFloat(sale.total_amount) || 0;
    });
    
    return Object.entries(salesByDate)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2))
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get top selling products
  const getTopProducts = (sales, limit = 5) => {
    if (!sales || sales.length === 0) return [];
    
    const productSales = {};
    
    sales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          if (!productSales[item.product_name]) {
            productSales[item.product_name] = 0;
          }
          productSales[item.product_name] += item.quantity || 0;
        });
      }
    });
    
    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  };

  // Calculate sales metrics
  const calculateMetrics = (sales) => {
    if (!sales || sales.length === 0) {
      return {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        salesTrend: [],
        topProducts: []
      };
    }
    
    const totalSales = sales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount) || 0), 0);
    const avgOrderValue = sales.length > 0 ? totalSales / sales.length : 0;
    
    return {
      totalSales,
      totalOrders: sales.length,
      avgOrderValue,
      salesTrend: processSalesTrend(sales),
      topProducts: getTopProducts(sales)
    };
  };

  const { totalSales, totalOrders, avgOrderValue, salesTrend, topProducts } = calculateMetrics(salesData);

  return (
    <div className="space-y-6">
      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalSales)}
                  </dd>
                  <dd className="text-sm text-gray-500 mt-1">
                    {totalOrders.toLocaleString()} orders
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-purple-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                <ShoppingCartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {formatCurrency(avgOrderValue)}
                  </dd>
                  <dd className="flex items-center text-sm text-gray-500 mt-1">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span>12.5% from last month</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Top Product */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                <TagIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Top Product</dt>
                  <dd className="text-lg font-semibold text-gray-900 truncate">
                    {topProducts[0]?.name || 'N/A'}
                  </dd>
                  <dd className="text-sm text-gray-500 mt-1">
                    {topProducts[0]?.quantity?.toLocaleString() || '0'} sold
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Growth */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sales Growth</dt>
                  <dd className="text-2xl font-bold text-gray-900">+12.5%</dd>
                  <dd className="text-sm text-gray-500 mt-1">vs. last period</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h3>
        <div className="h-80">
          {salesTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value)}`, 'Sales']}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Sales Amount" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No sales data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">{index + 1}</span>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm font-medium text-gray-900">{product.quantity?.toLocaleString()}</p>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(product.quantity / (topProducts[0]?.quantity || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No product data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesMetrics;
