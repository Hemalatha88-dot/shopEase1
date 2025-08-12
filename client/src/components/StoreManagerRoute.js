import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StoreManagerSidebar from './StoreManagerSidebar';

const StoreManagerRoute = () => {
  const { isStoreManager, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isStoreManager()) {
    return <Navigate to="/store-manager/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <StoreManagerSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StoreManagerRoute; 