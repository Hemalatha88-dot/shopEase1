import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Shopper-Facing Pages Only
import HomePage from './pages/HomePage';
import StoreLanding from './pages/StoreLanding';
import OfferCatalog from './pages/OfferCatalog';
import CustomerAuth from './pages/CustomerAuth';
import FeedbackForm from './pages/FeedbackForm';
import QRCodeLanding from './pages/QRCodeLanding';

// Shopper Context
import { ShopperProvider } from './contexts/ShopperContext';

function App() {
  return (
    <ShopperProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Shopper Journey Routes */}
            {/* <Route path="/" element={<StoreLanding />} /> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/store/:storeId" element={<StoreLanding />} />
            <Route path="/offers/:storeId" element={<OfferCatalog />} />
            <Route path="/offers/:storeId/:sectionId" element={<OfferCatalog />} />
            <Route path="/auth/:storeId" element={<CustomerAuth />} />
            <Route path="/customer/auth" element={<CustomerAuth />} />
            <Route path="/feedback/:storeId" element={<FeedbackForm />} />
            <Route path="/q/:storeId" element={<QRCodeLanding />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ShopperProvider>
  );
}

export default App;
