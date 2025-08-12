import React from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCodeIcon, 
  ShoppingBagIcon, 
  StarIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBagIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShopEase
                </h1>
                <p className="text-sm text-gray-500">Smart Shopping Experience</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <SparklesIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopEase
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing offers, share feedback, and enjoy a seamless shopping experience. 
              Simply scan a QR code at any participating store to get started!
            </p>
          </div>

          {/* QR Code Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto mb-12">
            <QrCodeIcon className="w-32 h-32 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan to Start Shopping</h3>
            <p className="text-gray-600 text-sm">
              Look for ShopEase QR codes at store entrances or specific sections
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <GiftIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Offers</h3>
              <p className="text-gray-600 text-sm">
                Access special discounts and deals available only through ShopEase
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <StarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Feedback</h3>
              <p className="text-gray-600 text-sm">
                Help improve your shopping experience by sharing your thoughts
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 text-sm">
                Optimized for your smartphone - no app download required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started in just a few simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-gray-600 text-sm">Find and scan a ShopEase QR code at the store</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Offers</h3>
              <p className="text-gray-600 text-sm">Explore exclusive deals and discounts</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Quick registration to unlock all offers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shop & Save</h3>
              <p className="text-gray-600 text-sm">Enjoy your shopping and share feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Store Link */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Try Our Demo Store</h2>
          <p className="text-blue-100 text-lg mb-8">
            Experience the ShopEase journey with our sample store
          </p>
          <Link
            to="/store/1"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            <ShoppingBagIcon className="w-5 h-5 mr-2" />
            Visit Demo Store
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">ShopEase</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Revolutionizing the in-store shopping experience
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 ShopEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
