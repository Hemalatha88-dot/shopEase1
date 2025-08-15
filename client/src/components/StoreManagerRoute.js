// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import StoreManagerSidebar from './StoreManagerSidebar';

// const StoreManagerRoute = () => {
//   const { isStoreManager, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   if (!isStoreManager()) {
//     return <Navigate to="/store-manager/login" state={{ from: location }} replace />;
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <StoreManagerSidebar />
//       <div className="flex-1 overflow-auto">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default StoreManagerRoute; 







import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StoreManagerSidebar from './StoreManagerSidebar';

const StoreManagerRoute = () => {
  const { isStoreManager, loading } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isStoreManager()) {
    return <Navigate to="/store-manager/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StoreManagerSidebar isMobile={isMobile} />
      <div className={`flex-1 flex flex-col overflow-hidden ${!isMobile ? 'ml-64' : ''}`}>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StoreManagerRoute;