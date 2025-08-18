// import React from 'react';
// import { Link } from 'react-router-dom';

// // Redesigned LandingPage: dual-panel hero with circular image overlap
// const LandingPage = () => {
//   const storeInfo = {
//     name: 'ShopEase',
//     description: 'Discover amazing offers, manage catalogs, and engage your shoppers effortlessly.',
//     imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop',
//     circleImage:
//       'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header / Navbar */}
//       <nav className="bg-gray-900 text-white sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
//             ShopEase
//           </Link>
//           <div className="hidden sm:flex items-center space-x-6">
//             <Link to="/store-manager/login" className="text-gray-200 hover:text-white transition-colors">Sign In</Link>
//             <Link
//               to="/store-manager/register"
//               className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <div className="flex flex-col md:flex-row items-center relative">
//           {/* Left Panel: Headline + CTAs */}
//           <div className="flex-1 rounded-l-3xl bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-xl p-10 flex items-center min-h-[520px]">
//             <div className="text-left">
//               <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
//                 Welcome to {storeInfo.name}
//               </h1>
//               <p className="text-lg md:text-xl text-gray-100/90 mb-6 max-w-xl">
//                 {storeInfo.description}
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link
//                   to="/store-manager/register"
//                   className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow font-semibold text-lg transition-all duration-200"
//                 >
//                   Get Started
//                 </Link>
//                 <Link
//                   to="/store-manager/login"
//                   className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 shadow font-semibold text-lg transition-all duration-200"
//                 >
//                   Sign In
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Circle Image Overlap */}
//           <div className="absolute md:static md:-mx-16 z-10 flex justify-center items-center">
//             <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white rounded-full shadow-2xl overflow-hidden flex justify-center items-center border-4 border-white">
//               <img
//                 src={storeInfo.circleImage}
//                 alt="Preview"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Right Panel: Visual */}
//           <div className="flex-1 rounded-r-3xl bg-gradient-to-r from-amber-400 to-orange-500 shadow-xl p-10 flex justify-center items-center min-h-[320px]">
//             <img
//               src={storeInfo.imageUrl}
//               alt="Store Visual"
//               className="rounded-xl shadow-2xl max-w-full"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Highlights */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Everything you need to delight shoppers
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-100">
//             <div className="text-3xl mb-2">🎯</div>
//             <h3 className="font-semibold text-gray-900 mb-1">Offer Management</h3>
//             <p className="text-gray-600 text-sm">Create and update offers quickly; showcase them beautifully.</p>
//           </div>
//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-100">
//             <div className="text-3xl mb-2">📊</div>
//             <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
//             <p className="text-gray-600 text-sm">Understand scans, conversions, and sections that perform best.</p>
//           </div>
//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-100">
//             <div className="text-3xl mb-2">💬</div>
//             <h3 className="font-semibold text-gray-900 mb-1">Feedback</h3>
//             <p className="text-gray-600 text-sm">Capture ratings and comments to continuously improve.</p>
//           </div>
//         </div>
//       </div>

//       {/* CTA Band */}
//       <div className="bg-gradient-to-r from-orange-500 to-amber-500">
//         <div className="max-w-7xl mx-auto px-4 py-14 text-center">
//           <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
//             Ready to elevate your in‑store experience?
//           </h3>
//           <p className="text-amber-50/90 mb-6 max-w-2xl mx-auto">
//             Join stores using ShopEase to boost engagement and sales.
//           </p>
//           <Link
//             to="/store-manager/register"
//             className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-block"
//           >
//             Start Free
//           </Link>
//         </div>
//       </div>

//       {/* Simple footer (page-local) */}
//       <footer className="bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 py-10 text-center">
//           <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;






import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const LandingPage = () => {
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
      heightClass: 'h-60', // Shorter image
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/14/12/7d/14127d483468bd582fdfdb50a5909972.jpg',
      heightClass: 'h-60', // Taller image
    },
    {
      imageUrl: 'https://i.pinimg.com/736x/fd/e6/c9/fde6c9414ef23902e069935aed043bf4.jpg',
      heightClass: 'h-60', // Even shorter
    },
  ];

  const column1Images = featureGridImages.slice(0, 2);
  const column2Images = featureGridImages.slice(2);

  return (
    <div className="min-h-screen font-sans flex flex-col">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-sm">
        <nav className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-blue-600">
              ShopEase
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">About</a>
            <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">Business</a>
            <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">Press</a>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/store-manager/login"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Sign in
            </Link>
            <Link
              to="/store-manager/register"
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* New Feature Section: 2 Columns */}
        <section className="bg-amber-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Column 1: Text Content */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 leading-tight sm:leading-snug">
                Discover Your Next Favorite Find
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                From fashion and electronics to dining and entertainment, explore everything you love in one place.
              </p>
            </div>

            {/* Column 2: Image Grid with variable heights */}
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-full">
                {/* First Column of Images */}
                <div className="flex flex-col gap-4 flex-1">
                  {column1Images.map((item, index) => (
                    <div
                      key={`col1-${index}`}
                      // Apply the dynamic height class here and keep w-full for responsiveness
                      className={`rounded-2xl overflow-hidden shadow-lg w-full ${item.heightClass}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={`Inspiration Grid Image ${index + 1}`}
                        className="w-full h-full object-cover" // Ensures image fills the container
                      />
                    </div>
                  ))}
                </div>
                {/* Second Column of Images */}
                <div className="flex flex-col gap-4 mt-8 sm:mt-0 flex-1">
                  {column2Images.map((item, index) => (
                    <div
                      key={`col2-${index}`}
                      // Apply the dynamic height class here
                      className={`rounded-2xl overflow-hidden shadow-lg w-full ${item.heightClass}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={`Inspiration Grid Image ${index + 3}`}
                        className="w-full h-full object-cover" // Ensures image fills the container
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-12 md:py-20 text-center bg-gradient-to-r from-teal-100 to-gray-200">
            <div className="mt-4 md:mt-8">
              <Link
                to="/store-manager/login"
                className="px-8 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-200 transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Explore
              </Link>
            </div>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 text-center max-w-xs sm:max-w-md mx-auto px-4">
             Sign in to Explore the Offers
            </p>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default LandingPage;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import Footer from './Footer';

// const LandingPage = () => {
//   const featureGridImages = [
//     {
//       imageUrl: 'https://i.pinimg.com/736x/a9/09/8f/a9098fd4ca232cba74121a00cd6a7a5b.jpg',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/83/fa/d9/83fad9610f918a63b1c825545053a125.jpg',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/86/97/3e/86973ebb49c17acc0f33d3e1aaf866e2.jpg',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/fd/e6/c9/fde6c9414ef23902e069935aed043bf4.jpg',
//     },
//     {
//       imageUrl: 'https://i.pinimg.com/736x/14/12/7d/14127d483468bd582fdfdb50a5909972.jpg',
//     },
//   ];

//   const column1Images = featureGridImages.slice(0, 2);
//   const column2Images = featureGridImages.slice(2);

//   return (
//     <div className="min-h-screen font-sans flex flex-col"> {/* Added flex-col to enable footer sticky bottom */}
//       {/* Header / Navbar */}
//       <header className="sticky top-0 z-50 bg-white backdrop-blur-sm">
//         <nav className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link to="/" className="text-xl font-bold text-blue-600">
//               ShopEase
//             </Link>
//           </div>
//           {/* Mobile navigation toggle would go here */}
//           {/* For full responsiveness, consider implementing a hamburger menu for `sm:hidden` links */}
//           <div className="hidden sm:flex items-center space-x-2">
//             <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">About</a>
//             <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">Business</a>
//             <a href="#" className="px-3 py-2 text-gray-800 font-semibold hover:bg-gray-200 rounded-lg">Press</a>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Link
//               to="/store-manager/login"
//               className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base" // Added responsive text size
//             >
//               Sign in
//             </Link>
//             <Link
//               to="/store-manager/register"
//               className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base" // Added responsive text size
//             >
//               Sign up
//             </Link>
//           </div>
//         </nav>
//       </header>

//       <main className="flex-grow"> {/* flex-grow ensures main takes up available space */}
//         {/* New Feature Section: 2 Columns */}
//         <section className="bg-amber-50 py-12 md:py-20"> {/* Adjusted padding for smaller screens */}
//           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"> {/* Adjusted gap for smaller screens */}
            
//             {/* Column 1: Text Content */}
//             <div className="text-center md:text-left"> {/* Centered text on mobile, left on md+ */}
//               <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 leading-tight sm:leading-snug"> {/* Responsive font sizes */}
//               Discover Your Next Favorite Find
//               </h2>
//               <p className="text-base sm:text-lg text-gray-600"> {/* Responsive font sizes */}
//               From fashion and electronics to dining and entertainment, explore everything you love in one place.
//               </p>
//             </div>

//             {/* Column 2: Explicit Two-Column Image Grid */}
//             <div className="flex justify-center">
//               <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-full"> {/* flex-col on small, flex-row on sm+, added max-w for better control on very small screens */}
//                 {/* First Column of Images */}
//                 <div className="flex flex-col gap-4 flex-1"> {/* flex-1 allows columns to share space */}
//                   {column1Images.map((item, index) => (
//                     <div
//                       key={`col1-${index}`}
//                       className="rounded-2xl overflow-hidden shadow-lg w-full"
//                       style={{ aspectRatio: '4/5' }} // Maintaining aspect ratio
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
//                 <div className="flex flex-col gap-4 mt-8 sm:mt-0 flex-1"> {/* mt-8 to create offset on small, sm:mt-0 to remove on sm+, flex-1 */}
//                   {column2Images.map((item, index) => (
//                     <div
//                       key={`col2-${index}`}
//                       className="rounded-2xl overflow-hidden shadow-lg w-full"
//                       style={{ aspectRatio: '4/5' }} // Maintaining aspect ratio
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

//         <div className="py-12 md:py-20 text-center bg-gradient-to-r from-teal-100 to-gray-200"> {/* Adjusted padding */}
//             <div className="mt-4 md:mt-8"> {/* Adjusted margin */}
//               <Link
//                 to="/store-manager/login"
//                 className="px-8 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-200 transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:scale-105" // Responsive padding and text size
//               >
//                 Explore
//               </Link>
//             </div>
//             <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 text-center max-w-xs sm:max-w-md mx-auto px-4"> {/* Responsive font size and max-width */}
//              Sign in to Explore the Offers
//             </p>
//         </div>
//       </main>
//       <Footer/>
//     </div>
//   );
// };

// export default LandingPage;





// import React from 'react';
// import { Link } from 'react-router-dom';
// import Footer from './Footer';

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
//               to="/store-manager/login"
//               className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Sign in
//             </Link>
//             <Link
//               to="/store-manager/register"
//               className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors"
//             >
//               Sign up
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
//                 to="/store-manager/login"
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