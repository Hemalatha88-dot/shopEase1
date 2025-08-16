import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  HomeIcon,
  UserIcon,
  Squares2X2Icon,
  TagIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  QrCodeIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const StoreManagerSidebar = ({ isMobile = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch feedback count when component mounts or user changes
  useEffect(() => {
    const fetchFeedbackCount = async () => {
      if (!user?.storeId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/feedback/store/${user.storeId}?limit=1`);
        if (response.data?.pagination?.total !== undefined) {
          setFeedbackCount(response.data.pagination.total);
        }
      } catch (err) {
        console.error('Error fetching feedback count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackCount();
    
    // Set up polling to check for new feedback every 5 minutes
    const intervalId = setInterval(fetchFeedbackCount, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user?.storeId]);

  const navigation = [
    { name: 'Dashboard', href: '/store-manager/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/store-manager/profile', icon: UserIcon },
    { name: 'Sub Store', href: '/store-manager/sections', icon: Squares2X2Icon },
    { name: 'Offers', href: '/store-manager/offers', icon: TagIcon },
    {name: 'Sales', href: '/store-manager/sales', icon: ChartBarIcon},
    // { name: 'Analytics', href: '/store-manager/analytics', icon: ChartBarIcon },
    { 
      name: 'Feedback', 
      href: '/store-manager/feedback', 
      icon: ChatBubbleLeftRightIcon,
      badge: !loading && feedbackCount > 0 ? feedbackCount : null,
      highlight: feedbackCount > 0
    },
    { name: 'QR Codes', href: '/store-manager/qr-codes', icon: QrCodeIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/store-manager/login');
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
          isActive
            ? 'bg-primary-100 text-primary-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="relative">
          <item.icon
            className={`mr-3 h-6 w-6 flex-shrink-0 ${
              isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
            }`}
            aria-hidden="true"
          />
          {item.badge && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white">
              {item.badge}
            </span>
          )}
        </div>
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">ShopEase</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.name || 'Store Manager'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto p-1 text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">ShopEase</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700">
                  {user?.name || 'Store Manager'}
                </p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto p-1 text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      {!sidebarOpen && (
        <button
          type="button"
          className="fixed left-4 top-4 z-40 rounded-md p-2 text-gray-500 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </>
  );
};

export default StoreManagerSidebar;
