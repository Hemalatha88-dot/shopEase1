import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import StoreLanding from './pages/StoreLanding';
import SectionLanding from './pages/SectionLanding';
import OfferCatalog from './pages/OfferCatalog';
import CustomerAuth from './pages/CustomerAuth';
import FeedbackForm from './pages/FeedbackForm';

// Store Manager Pages
import StoreManagerLogin from './pages/store/StoreManagerLogin';
import StoreManagerRegister from './pages/store/StoreManagerRegister';
import StoreDashboard from './pages/store/StoreDashboard';
import StoreProfile from './pages/store/StoreProfile';
import StoreSections from './pages/store/StoreSections';
import OfferManagement from './pages/store/OfferManagement';
import AnalyticsDashboard from './pages/store/AnalyticsDashboard';
import FeedbackManagement from './pages/store/FeedbackManagement';
import QRCodeManagement from './pages/store/QRCodeManagement';
import QRCodeDashboard from './pages/store/QRCodeDashboard';
import SalesDashboard from './pages/store/SalesDashboard';

// Components
import StoreManagerRoute from './components/StoreManagerRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/store/:storeId" element={<StoreLanding />} />
            <Route path="/store/:storeId/section/:sectionId" element={<SectionLanding />} />
            <Route path="/offers/:storeId" element={<OfferCatalog />} />
            <Route path="/offers/:storeId/section/:sectionId" element={<OfferCatalog />} />
            <Route path="/customer/auth" element={<CustomerAuth />} />
            <Route path="/feedback/:storeId" element={<FeedbackForm />} />
            
            {/* Store Manager Auth Routes */}
            <Route path="/store-manager/login" element={<StoreManagerLogin />} />
            <Route path="/store-manager/register" element={<StoreManagerRegister />} />
            
            {/* Protected Store Manager Routes */}
            <Route path="/store-manager" element={<StoreManagerRoute />}>
              <Route path="dashboard" element={<StoreDashboard />} />
              <Route path="profile" element={<StoreProfile />} />
              <Route path="sections" element={<StoreSections />} />
              <Route path="offers" element={<OfferManagement />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="sales" element={<SalesDashboard />} />
              <Route path="feedback" element={<FeedbackManagement />} />
              <Route path="qr-codes" element={<QRCodeManagement />} />
              <Route path="qrcode-analytics" element={<QRCodeDashboard />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
