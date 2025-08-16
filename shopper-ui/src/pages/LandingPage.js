// import React from 'react';
// import { Link } from 'react-router-dom';
// import {
//   QrCodeIcon,
//   ShoppingBagIcon,
//   ChartBarIcon,
//   UserGroupIcon,
//   DevicePhoneMobileIcon,
//   ShieldCheckIcon
// } from '@heroicons/react/24/outline';

// const LandingPage = () => {
//   const features = [
//     {
//       icon: QrCodeIcon,
//       title: 'QR Code Integration',
//       description: 'Generate and manage QR codes for your store and sections to enhance customer engagement.'
//     },
//     {
//       icon: ShoppingBagIcon,
//       title: 'Offer Management',
//       description: 'Create, edit, and manage offers with bulk import functionality and real-time updates.'
//     },
//     {
//       icon: ChartBarIcon,
//       title: 'Analytics Dashboard',
//       description: 'Track QR scans, sales data, and customer feedback with comprehensive analytics.'
//     },
//     {
//       icon: UserGroupIcon,
//       title: 'Customer Engagement',
//       description: 'Collect customer feedback and ratings to improve your store experience.'
//     },
//     {
//       icon: DevicePhoneMobileIcon,
//       title: 'Mobile Responsive',
//       description: 'Fully responsive design that works seamlessly on all devices and screen sizes.'
//     },
//     {
//       icon: ShieldCheckIcon,
//       title: 'Secure & Reliable',
//       description: 'Enterprise-grade security with JWT authentication and data protection.'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-primary-600">ShopEase</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link
//                 to="/store-manager/login"
//                 className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Store Login
//               </Link>
//               <Link
//                 to="/store-manager/register"
//                 className="btn-primary"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
//               Transform Your
//               <span className="text-yellow-300"> Retail Experience</span>
//             </h1>
//             <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
//               ShopEase is a comprehensive QR-based platform that enhances in-store shopping through 
//               instant offer access, customer feedback collection, and powerful analytics.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 to="/store-manager/register"
//                 className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
//               >
//                 Start Free Trial
//               </Link>
//               <Link
//                 to="/store-manager/login"
//                 className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
//               >
//                 Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Everything You Need to Succeed
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               From QR code generation to customer analytics, ShopEase provides all the tools 
//               you need to enhance your retail business.
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="card-hover text-center">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
//                   <feature.icon className="h-8 w-8 text-primary-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-3">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               How ShopEase Works
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Simple steps to transform your retail business with digital engagement.
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
//                 1
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">
//                 Set Up Your Store
//               </h3>
//               <p className="text-gray-600">
//                 Register your store, create sections, and generate QR codes for each area.
//               </p>
//             </div>
            
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
//                 2
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">
//                 Upload Offers
//               </h3>
//               <p className="text-gray-600">
//                 Add your daily offers and promotions with easy bulk import functionality.
//               </p>
//             </div>
            
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
//                 3
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">
//                 Engage Customers
//               </h3>
//               <p className="text-gray-600">
//                 Customers scan QR codes to access offers and provide feedback instantly.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-primary-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//               Ready to Transform Your Store?
//             </h2>
//             <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
//               Join thousands of retailers who are already using ShopEase to enhance 
//               their customer experience and boost sales.
//             </p>
//             <Link
//               to="/store-manager/register"
//               className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
//             >
//               Get Started Today
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <h3 className="text-2xl font-bold text-white mb-4">ShopEase</h3>
//             <p className="text-gray-400 mb-6">
//               Enhancing retail experiences through digital innovation
//             </p>
//             <div className="flex justify-center space-x-6">
//               <Link to="/store-manager/login" className="text-gray-400 hover:text-white">
//                 Store Login
//               </Link>
//               <Link to="/store-manager/register" className="text-gray-400 hover:text-white">
//                 Register
//               </Link>
//             </div>
//             <div className="mt-8 pt-8 border-t border-gray-800">
//               <p className="text-gray-400 text-sm">
//                 © 2024 ShopEase. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage; 