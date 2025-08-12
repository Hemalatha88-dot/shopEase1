# ShopEase Shopper UI

A beautiful, responsive React application for the ShopEase shopper-facing experience. This is the customer-facing interface that provides QR code-based shopping, offer browsing, customer registration, and feedback collection.

## 🛍️ Features

### **Complete Shopper Journey**
- **QR Code Landing** - Beautiful store welcome pages after QR scan
- **Offer Catalog** - Browse offers with search, filtering, and categories
- **Preview Mode** - Show limited offers to encourage registration
- **Customer Registration** - Seamless signup with OTP verification
- **Feedback System** - Multi-category rating and review collection

### **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Touch-friendly interfaces for smartphones
- Adaptive layouts for tablets and desktops
- Smooth animations and micro-interactions

### **User Experience**
- Intuitive navigation and breadcrumbs
- Loading states with branded spinners
- Error handling with friendly messages
- Success confirmations with celebrations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- ShopEase backend server running on `http://localhost:5000`

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3001` (or next available port).

## 📱 Shopper Journey Flow

1. **Home Page** (`/`) - Welcome and demo store access
2. **Store Landing** (`/store/:storeId`) - QR scan destination with store info
3. **Offer Catalog** (`/offers/:storeId`) - Browse offers with preview mode
4. **Customer Auth** (`/auth/:storeId`) - Registration and OTP verification
5. **Feedback Form** (`/feedback/:storeId`) - Multi-category ratings

## 🎨 Key Components

### Pages
- `HomePage.js` - Landing page with ShopEase introduction
- `StoreLanding.js` - Store welcome with sections and main actions
- `OfferCatalog.js` - Offer browsing with search and filtering
- `CustomerAuth.js` - Registration and OTP verification flow
- `FeedbackForm.js` - Comprehensive feedback collection

### Components
- `ProductCard.js` - Individual offer display with badges and pricing
- `StarRating.js` - Interactive star rating component

### Context
- `ShopperContext.js` - Customer authentication and store state management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MOCK_OTP=true
```

### API Integration
The app connects to the ShopEase backend API for:
- Store and section information
- Offer catalog and filtering
- Customer registration and OTP verification
- Feedback submission
- QR scan tracking

## 📦 Build and Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Netlify/Vercel
The built files in the `build/` folder can be deployed to any static hosting service.

## 🎯 Architecture

### Folder Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── pages/              # Page components (shopper-facing only)
├── services/           # API service layer
└── styles/             # Global styles and Tailwind config
```

### State Management
- **ShopperContext** - Customer authentication and store data
- **Local Storage** - Persistent customer session
- **React State** - Component-level state management

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Custom Gradients** - Brand-consistent color schemes

## 🔒 Security

- Customer data stored securely in localStorage
- API calls with proper error handling
- Input validation on forms
- XSS protection through React's built-in sanitization

## 📱 Mobile Optimization

- Touch-friendly button sizes (44px minimum)
- Swipe gestures for offer browsing
- Responsive images with lazy loading
- Optimized for various screen sizes

## 🎨 Design System

### Colors
- Primary: Blue gradient (`from-blue-600 to-purple-600`)
- Success: Green (`#10B981`)
- Warning: Orange (`#F59E0B`)
- Error: Red (`#EF4444`)

### Typography
- Headings: Inter font family, bold weights
- Body: Inter font family, regular weights
- Responsive font sizes with Tailwind classes

## 🚀 Performance

- Code splitting with React.lazy()
- Image optimization and lazy loading
- Minimal bundle size with tree shaking
- Fast loading with optimized assets

## 📞 Support

For issues or questions about the ShopEase Shopper UI:
1. Check the console for error messages
2. Verify backend API connectivity
3. Ensure all environment variables are set
4. Review the component documentation

---

**ShopEase Shopper UI** - Delivering exceptional shopping experiences through QR-based engagement.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
