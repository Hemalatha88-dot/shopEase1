// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   QrCodeIcon, 
//   ShoppingBagIcon, 
//   StarIcon,
//   DevicePhoneMobileIcon,
//   SparklesIcon,
//   GiftIcon
// } from '@heroicons/react/24/outline';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
//                 <ShoppingBagIcon className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   ShopEase
//                 </h1>
//                 <p className="text-sm text-gray-500">Smart Shopping Experience</p>
//               </div>
//             </div>
//             <Link
//               to="/store/1"
//               className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg border border-gray-200"
//             >
//               <ShoppingBagIcon className="w-5 h-5 mr-2" />
//               Visit Demo Store
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="mb-8">
//             <SparklesIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
//             <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
//               Welcome to{' '}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 ShopEase
//               </span>
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Discover amazing offers, share feedback, and enjoy a seamless shopping experience. 
//               Simply scan a QR code at any participating store to get started!
//             </p>
//           </div>

//           {/* QR Code Demo */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto mb-12">
//             <QrCodeIcon className="w-32 h-32 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan to Start Shopping</h3>
//             <p className="text-gray-600 text-sm">
//               Look for ShopEase QR codes at store entrances or specific sections
//             </p>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <GiftIcon className="w-6 h-6 text-blue-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Offers</h3>
//               <p className="text-gray-600 text-sm">
//                 Access special discounts and deals available only through ShopEase
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <StarIcon className="w-6 h-6 text-purple-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Feedback</h3>
//               <p className="text-gray-600 text-sm">
//                 Help improve your shopping experience by sharing your thoughts
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
//                 <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
//               <p className="text-gray-600 text-sm">
//                 Optimized for your smartphone - no app download required
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16 bg-white">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
//             <p className="text-lg text-gray-600">Get started in just a few simple steps</p>
//           </div>

//           <div className="grid md:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
//                 1
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code</h3>
//               <p className="text-gray-600 text-sm">Find and scan a ShopEase QR code at the store</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
//                 2
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Offers</h3>
//               <p className="text-gray-600 text-sm">Explore exclusive deals and discounts</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
//                 3
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
//               <p className="text-gray-600 text-sm">Quick registration to unlock all offers</p>
//             </div>

//             <div className="text-center">
//               <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
//                 4
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Shop & Save</h3>
//               <p className="text-gray-600 text-sm">Enjoy your shopping and share feedback</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Demo Store Link */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-white mb-4">Try Our Demo Store</h2>
//           <p className="text-blue-100 text-lg mb-8">
//             Experience the ShopEase journey with our sample store
//           </p>
//           <Link
//             to="/store/1"
//             className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
//           >
//             <ShoppingBagIcon className="w-5 h-5 mr-2" />
//             Visit Demo Store
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <div className="flex items-center justify-center space-x-3 mb-4">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                 <ShoppingBagIcon className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-xl font-bold">ShopEase</h3>
//             </div>
//             <p className="text-gray-400 mb-4">
//               Revolutionizing the in-store shopping experience
//             </p>
//             <p className="text-gray-500 text-sm">
//               © 2024 ShopEase. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;








import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './footer';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define images with a specific height class for each
  const featureGridImages = [
    {
      imageUrl: 'https://i.pinimg.com/736x/a9/09/8f/a9098fd4ca232cba74121a00cd6a7a5b.jpg',
      heightClass: 'h-96', // Taller image
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/83/fa/d9/83fad9610f918a63b1c825545053a125.jpg',
      heightClass: 'h-96', // Shorter image
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/86/97/3e/86973ebb49c17acc0f33d3e1aaf866e2.jpg',
      heightClass: 'h-64', // Shorter image
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/fd/e6/c9/fde6c9414ef23902e069935aed043bf4.jpg',
      heightClass: 'h-64', // Even shorter
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/14/12/7d/14127d483468bd582fdfdb50a5909972.jpg',
      heightClass: 'h-64', // Taller image
    },
  ];

  const column1Images = featureGridImages.slice(0, 2);
  const column2Images = featureGridImages.slice(2);

  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm">
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            ShopEase
          </Link>
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <a href="#" className="px-3 py-2 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">About</a>
            <a href="#" className="px-3 py-2 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Business</a>
            <a href="#" className="px-3 py-2 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Press</a>
          </div>
          {/* Desktop Button */}
          <div className="hidden sm:flex items-center space-x-2">
            <Link
              to="/store/8"
              className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Visit Demo Store
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </nav>
        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white shadow-md px-4 py-3 space-y-2">
            <a href="#" className="block py-1 text-gray-800">About</a>
            <a href="#" className="block py-1 text-gray-800">Business</a>
            <a href="#" className="block py-1 text-gray-800">Press</a>
            <Link to="/store/8" className="block py-1 text-blue-600 font-medium">Visit Demo Store</Link>
          </div>
        )}
      </header>

      <main>
        {/* Feature Section */}
        <section className="bg-amber-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Discover Your Next Favorite Find
              </h2>
              <p className="text-gray-600 text-lg">
              From fashion and electronics to dining and entertainment, explore everything you love in one place.
              </p>
            </div>
            {/* Image Grid */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Column 1 */}
              <div className="flex flex-col gap-4 flex-1">
                {column1Images.map((item, index) => (
                  <div
                    key={`col1-${index}`}
                    className={`rounded-2xl overflow-hidden shadow-lg w-full ${item.heightClass}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={`Inspiration ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-4 flex-1 sm:mt-8">
                {column2Images.map((item, index) => (
                  <div
                    key={`col2-${index}`}
                    className={`rounded-2xl overflow-hidden shadow-lg w-full ${item.heightClass}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={`Inspiration ${index + 3}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="py-16 sm:py-20 text-center bg-gradient-to-r from-teal-100 to-gray-200">
          <div>
            <Link
              to="/store/8"
              className="px-8 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore
            </Link>
          </div>
          <p className="mt-4 sm:mt-6 text-gray-700 text-base sm:text-lg max-w-md mx-auto">
            Sign in to Explore the Offers
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Footer from './footer';

// const LandingPage = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Responsive-friendly image data (no fixed heights)
//   const featureGridImages = [
//     { imageUrl: 'https://i.pinimg.com/736x/a9/09/8f/a9098fd4ca232cba74121a00cd6a7a5b.jpg' },
//     { imageUrl: 'https://i.pinimg.com/736x/83/fa/d9/83fad9610f918a63b1c825545053a125.jpg' },
//     { imageUrl: 'https://i.pinimg.com/736x/86/97/3e/86973ebb49c17acc0f33d3e1aaf866e2.jpg' },
//     { imageUrl: 'https://i.pinimg.com/736x/fd/e6/c9/fde6c9414ef23902e069935aed043bf4.jpg' },
//     { imageUrl: 'https://i.pinimg.com/736x/14/12/7d/14127d483468bd582fdfdb50a5909972.jpg' },
//   ];

//   const column1Images = featureGridImages.slice(0, 2);
//   const column2Images = featureGridImages.slice(2);

//   return (
//     <div className="min-h-screen font-sans">
//       {/* Navbar */}
//       <header className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm">
//         <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="text-xl font-bold text-blue-600">
//             ShopEase
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden sm:flex items-center space-x-4">
//             <a href="#" className="px-3 py-2 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">About</a>
//             <a href="#" className="px-3 py-2 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Business</a>
//             <a href="#" className="px-3 py-2 text-gray-800 font-medium hover:bg-gray-100 rounded-lg">Press</a>
//           </div>

//           {/* Desktop Button */}
//           <div className="hidden sm:flex items-center space-x-2">
//             <Link
//               to="/store/8"
//               className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Visit Demo Store
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="sm:hidden p-2 rounded-md hover:bg-gray-100"
//           >
//             ☰
//           </button>
//         </nav>

//         {/* Mobile Dropdown */}
//         {isMenuOpen && (
//           <div className="sm:hidden bg-white shadow-md px-4 py-3 space-y-2">
//             <a href="#" className="block text-gray-800">About</a>
//             <a href="#" className="block text-gray-800">Business</a>
//             <a href="#" className="block text-gray-800">Press</a>
//             <Link to="/store/8" className="block text-blue-600 font-medium">Visit Demo Store</Link>
//           </div>
//         )}
//       </header>

//       <main>
//         {/* Feature Section */}
//         <section className="bg-amber-50 py-16 sm:py-20">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//             {/* Text Content */}
//             <div>
//               <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
//                 Discover Your Next Big Idea
//               </h2>
//               <p className="text-gray-600 text-lg">
//                 Explore a world of inspiration. From home decor projects to your next travel destination,
//                 find and save all the ideas that matter to you in one convenient place.
//               </p>
//             </div>

//             {/* Image Grid */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               {/* Column 1 */}
//               <div className="flex flex-col gap-4 w-full sm:w-auto">
//                 {column1Images.map((item, index) => (
//                   <div
//                     key={`col1-${index}`}
//                     className="rounded-2xl overflow-hidden shadow-lg w-full sm:w-64 md:w-72 aspect-[3/4]"
//                   >
//                     <img
//                       src={item.imageUrl}
//                       alt={`Inspiration ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Column 2 */}
//               <div className="flex flex-col gap-4 w-full sm:w-auto sm:mt-8">
//                 {column2Images.map((item, index) => (
//                   <div
//                     key={`col2-${index}`}
//                     className="rounded-2xl overflow-hidden shadow-lg w-full sm:w-64 md:w-72 aspect-[3/4]"
//                   >
//                     <img
//                       src={item.imageUrl}
//                       alt={`Inspiration ${index + 3}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <div className="py-16 sm:py-20 text-center bg-gradient-to-r from-teal-100 to-gray-200">
//           <div>
//             <Link
//               to="/store/8"
//               className="px-8 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               Explore
//             </Link>
//           </div>
//           <p className="mt-4 sm:mt-6 text-gray-700 text-base sm:text-lg max-w-md mx-auto">
//             Sign in to Explore the Offers
//           </p>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default LandingPage;






// import React from 'react';
// import { Link } from 'react-router-dom';
// import Footer from './footer';

// const LandingPage = () => {
//   const featureGridImages = [
//     {
//       imageUrl: 'https://i.pinimg.com/736x/a9/09/8f/a9098fd4ca232cba74121a00cd6a7a5b.jpg',
//       className: 'h-92 w-72'
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/83/fa/d9/83fad9610f918a63b1c825545053a125.jpg',
//       className: 'h-60 w-50',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/86/97/3e/86973ebb49c17acc0f33d3e1aaf866e2.jpg',
//       className: 'h-50 w-50',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/fd/e6/c9/fde6c9414ef23902e069935aed043bf4.jpg',
//       className: 'h-32 w-38',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/14/12/7d/14127d483468bd582fdfdb50a5909972.jpg',
//       className: 'h-32 w-72',
//     },
//   ];

//   const column1Images = featureGridImages.slice(0, 2);
//   const column2Images = featureGridImages.slice(2);

//   return (
//     <div className="min-h-screen  font-sans">
//       {/* Header / Navbar */}
//       <header className="sticky top-0 z-50 bg-white backdrop-blur-sm">
//         <nav className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             {/* <img  
//               src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
//               alt="Logo"
//               className="h-8 w-8"
//             /> */}
//             <Link to="/" className="text-xl font-bold text-blue-600">
//               ShopEase
//             </Link>
//           </div>
//           <div className="hidden sm:flex items-center space-x-2">
//             <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">About</a>
//             <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">Business</a>
//             <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">Press</a>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Link
//               to="/store/8"
//               className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Visit Demo Store
//             </Link>
//           </div>
//         </nav>
//       </header>


//       <main>
//         {/* New Feature Section: 2 Columns */}
//         <section className="bg-amber-50 py-20">
//           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
//             {/* Column 1: Text Content */}
//             <div className="text-left">
//               <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">
//                 Discover Your Next Big Idea
//               </h2>
//               <p className="text-gray-600 text-lg">
//                 Explore a world of inspiration. From home decor projects to your next travel destination, find and save all the ideas that matter to you in one convenient place.
//               </p>
//             </div>


//             {/* Column 2: Explicit Two-Column Image Grid */}
//             <div className="flex justify-center">
//               <div className="flex gap-4">
//                 {/* First Column of Images */}
//                 <div className="flex flex-col gap-4">
//                   {column1Images.map((item, index) => (
//                     <div
//                       key={`col1-${index}`}
//                       className={`rounded-2xl overflow-hidden shadow-lg ${item.className}`}
//                     >
//                       <img
//                         src={item.imageUrl}
//                         alt={`Inspiration Grid Image ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 {/* Second Column of Images */}
//                 <div className="flex flex-col gap-4 mt-8"> {/* mt-8 to create offset */}
//                   {column2Images.map((item, index) => (
//                     <div
//                       key={`col2-${index}`}
//                       className={`rounded-2xl overflow-hidden shadow-lg ${item.className}`}
//                     >
//                       <img
//                         src={item.imageUrl}
//                         alt={`Inspiration Grid Image ${index + 3}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

// <div className="py-20 text-center bg-gradient-to-r from-teal-100 to-gray-200">
//             <div className="mt-8">
//               <Link
//                 to="/store/8"
//                 className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl hover:bg-gray-200 transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 Explore
//               </Link>
//             </div>
//             <p className="mt-6 text-lg text-gray-700 text-center max-w-md mx-auto">
//              Sign in to Explore the Offers
//             </p>
//         </div>
//       </main>

//       <Footer/>
//     </div>
//   );
// };


// export default LandingPage;
