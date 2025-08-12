# ShopEase - QR-Based In-Store Offer & Feedback Management System

A full-stack web application for retail stores to enhance in-store shopping experience through instant access to offers, product catalogs, and post-shopping feedback collection.

## 🚀 Features

### For Shoppers
- **QR Code Scanning**: Instantly explore store offers by scanning QR codes
- **Section-Specific Offers**: View offers for specific store sections
- **Customer Registration**: Simple sign-up with OTP verification
- **Offer Catalog**: Beautiful, categorized offer display
- **Feedback System**: Rate and review shopping experience

### For Store Managers
- **Store Management**: Complete store profile and section management
- **Offer Management**: Create, edit, and manage offers with bulk Excel import
- **QR Code Generation**: Generate and download QR codes for store and sections
- **Analytics Dashboard**: Comprehensive analytics and insights
- **Sales Data Upload**: Upload daily sales data via Excel
- **Feedback Management**: View and analyze customer feedback

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MySQL** database
- **JWT** authentication
- **QR Code** generation
- **Excel** import/export functionality
- **Multer** for file uploads

### Frontend
- **React.js** with **Tailwind CSS**
- **React Router** for navigation
- **Axios** for API communication
- **Heroicons** for icons
- **QR Code** generation and scanning
- Responsive design for mobile and desktop

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shopease
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Database Setup
```bash
# Run the database initialization script
node init-db-simple.js
```

#### Environment Configuration
Create a `config.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Adharva@123
DB_NAME=shopease

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=shopease_jwt_secret_key_2024
JWT_EXPIRE=24h

# OTP Configuration (for demo purposes)
OTP_SECRET=demo_otp_secret_123

# Frontend URL (for QR codes)
FRONTEND_URL=http://localhost:3000
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd client
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Store Manager Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Store Name",
  "email": "store@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "Store Address",
  "description": "Store Description"
}
```

#### Store Manager Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "store@example.com",
  "password": "password123"
}
```

#### Customer Registration
```http
POST /api/auth/customer/register
Content-Type: application/json

{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+1234567890"
}
```

#### OTP Verification
```http
POST /api/auth/customer/verify-otp
Content-Type: application/json

{
  "phone": "+1234567890",
  "otp": "123456"
}
```

### Store Management Endpoints

#### Get Store Profile
```http
GET /api/stores/profile
Authorization: Bearer <token>
```

#### Update Store Profile
```http
PUT /api/stores/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Store Name",
  "description": "Updated description"
}
```

#### Generate Main Store QR Code
```http
POST /api/stores/qr/main
Authorization: Bearer <token>
```

#### Get Store Sections
```http
GET /api/stores/sections
Authorization: Bearer <token>
```

#### Create Store Section
```http
POST /api/stores/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Section Name",
  "description": "Section Description"
}
```

### Offer Management Endpoints

#### Get All Offers (Store Manager)
```http
GET /api/offers?category=Electronics&section_id=1&is_active=true
Authorization: Bearer <token>
```

#### Get Public Offers (Customers)
```http
GET /api/offers/store/1?section_id=1&category=Electronics&limit=10
```

#### Create Offer
```http
POST /api/offers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Offer Title",
  "description": "Offer Description",
  "category": "Electronics",
  "subcategory": "Smartphones",
  "original_price": 999.99,
  "offer_price": 799.99,
  "discount_percentage": 20,
  "image_url": "https://example.com/image.jpg",
  "section_id": 1
}
```

#### Bulk Import Offers
```http
POST /api/offers/bulk-import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <excel_file>
```

### Feedback Endpoints

#### Submit Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "store_id": 1,
  "overall_rating": 5,
  "service_rating": 4,
  "product_rating": 5,
  "cleanliness_rating": 4,
  "value_rating": 4,
  "comments": "Great shopping experience!"
}
```

#### Get Store Feedback (Store Manager)
```http
GET /api/feedback/store/1?page=1&limit=10&rating_filter=5
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Track QR Scan
```http
POST /api/analytics/qr-scan
Content-Type: application/json

{
  "store_id": 1,
  "section_id": 1,
  "customer_id": 1
}
```

#### Get Analytics Dashboard
```http
GET /api/analytics/dashboard?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <token>
```

#### Upload Sales Data
```http
POST /api/analytics/sales-upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <excel_file>
```

### QR Code Endpoints

#### Generate Store QR Code
```http
POST /api/qr/store/1?size=300&margin=2
```

#### Generate Section QR Code
```http
POST /api/qr/section/1?size=300&margin=2
Authorization: Bearer <token>
```

#### Download QR Code
```http
GET /api/qr/download/store/1?size=300&margin=2
```

## 📊 Database Schema

### Tables
- `stores` - Store information and credentials
- `store_sections` - Store sections/departments
- `offers` - Product offers and deals
- `customers` - Customer information
- `qr_scans` - QR code scan tracking
- `feedback` - Customer feedback and ratings
- `sales_data` - Daily sales information
- `otp_verification` - OTP verification records

## 🔧 Development

### Project Structure
```
shopease/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   │   ├── store/         # Store manager pages
│   │   │   └── ...
│   │   ├── App.js             # Main app component
│   │   └── index.js           # App entry point
│   ├── package.json
│   └── tailwind.config.js     # Tailwind configuration
├── config/
│   └── database.js            # Database configuration
├── middleware/
│   └── auth.js                # Authentication middleware
├── routes/
│   ├── auth.js                # Authentication routes
│   ├── stores.js              # Store management routes
│   ├── offers.js              # Offer management routes
│   ├── feedback.js            # Feedback routes
│   ├── analytics.js           # Analytics routes
│   └── qr.js                  # QR code routes
├── uploads/                   # File uploads directory
├── config.env                 # Environment variables
├── init-db-simple.js          # Database initialization
├── package.json               # Backend dependencies
├── server.js                  # Main server file
└── README.md                  # This file
```

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

#### Frontend
```bash
cd client
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop browsers
- Mobile web browsers
- Tablet devices

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Database Migration
Run the database initialization script on your production server:
```bash
node init-db-simple.js
```

### Frontend Build
```bash
cd client
npm run build
```

## 🧪 Testing the Application

### 1. Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Frontend Access
Open your browser and navigate to `http://localhost:3000`

### 3. Store Manager Registration
1. Go to `http://localhost:3000/store-manager/register`
2. Fill in the store details
3. Create your account

### 4. Store Manager Login
1. Go to `http://localhost:3000/store-manager/login`
2. Use your registered email and password
3. Access the dashboard

### 5. Demo OTP
For customer registration, use the demo OTP: `123456`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🎯 Next Steps

The following features are planned for future development:
- Complete customer-facing pages (QR scanning, offer catalog)
- Advanced analytics with charts and graphs
- Email notifications
- Mobile app development
- Multi-language support
- Advanced reporting features

---

**ShopEase** - Enhancing retail experiences through digital innovation! 🛍️✨ 