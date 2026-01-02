# 🛒 Kenya E-Commerce Platform - Production Ready

A fully-featured, production-ready e-commerce platform built specifically for the Kenyan market with modern technologies and best practices. This system provides a complete online shopping experience with **M-Pesa integration**, **local delivery management**, and **Kenya-specific features**.

## 🇰🇪 Kenya-First Features

### 💳 M-Pesa Integration
- **STK Push Payments**: Seamless M-Pesa checkout experience
- **Real-time Payment Verification**: Automatic payment confirmation
- **Transaction Tracking**: Complete M-Pesa transaction history
- **Sandbox & Production**: Full M-Pesa API integration

### 🚚 Kenya Delivery System
- **47 County Coverage**: Pre-configured delivery zones for all Kenyan counties
- **Delivery Agent Management**: Complete delivery agent onboarding and tracking
- **Real-time Tracking**: GPS-based delivery tracking
- **County-specific Pricing**: Customizable delivery fees per county

### 💰 Digital Wallet System
- **M-Pesa Top-ups**: Add money via M-Pesa
- **Cashback Rewards**: Automatic cashback on purchases
- **Wallet Payments**: Pay for orders using wallet balance
- **Transaction History**: Complete wallet transaction tracking

### 🏛️ Kenya Compliance
- **VAT Integration**: Automatic 16% VAT calculation
- **KRA Compliance**: Tax reporting features
- **Kenyan Address Format**: County-based address system
- **Local Phone Validation**: Kenyan phone number formats (+254)

### 🔍 Audit & Security
- **Complete Audit Logs**: Track all user and admin actions
- **Security Monitoring**: Real-time security event tracking
- **IP Tracking**: Location-based access monitoring
- **Role-based Access**: User, Admin, and Delivery Agent roles

## ✨ Key Features

### 🛍️ Customer Experience
- **Modern UI/UX**: Clean, responsive design with dark mode support
- **Advanced Search**: Full-text search with filters and sorting
- **Smart Cart**: Persistent cart with coupon support and real-time updates
- **Wishlist**: Save favorite products for later
- **User Accounts**: Profile management, order history, multiple addresses
- **Reviews & Ratings**: Product reviews with helpful/report functionality
- **Real-time Notifications**: Order updates and system notifications

### �‍💼 Admin Management
- **Dashboard Analytics**: Sales metrics, user analytics, and performance insights
- **Product Management**: Full CRUD with image uploads, variants, and SEO
- **Order Management**: Order tracking, status updates, and fulfillment
- **User Management**: Customer accounts and role-based permissions
- **Inventory Control**: Stock tracking and low-stock alerts
- **Coupon System**: Flexible discount management with usage tracking
- **Content Management**: Categories, reviews moderation, and site settings

### 🔧 Technical Excellence
- **Scalable Architecture**: Microservice-ready with clean separation of concerns
- **Security First**: JWT authentication, input validation, rate limiting, CSRF protection
- **Performance Optimized**: Lazy loading, image optimization, efficient queries, caching
- **Mobile Responsive**: Mobile-first design with touch-friendly interface
- **SEO Optimized**: Meta tags, structured data, and search engine friendly URLs
- **Production Ready**: Docker support, CI/CD ready, comprehensive logging

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite for fast development and building
- **Tailwind CSS** for utility-first styling and responsive design
- **React Router** for client-side routing
- **Zustand** for lightweight state management
- **React Query** for server state management and caching
- **Framer Motion** for smooth animations and transitions
- **React Hook Form** for efficient form handling
- **Recharts** for admin dashboard analytics

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data modeling
- **JWT** authentication with HttpOnly cookies
- **Bcrypt** for secure password hashing
- **Cloudinary** for image storage and optimization
- **Socket.IO** for real-time features
- **Winston** for structured logging
- **Joi** for input validation

### DevOps & Security
- **Docker** containerization with multi-stage builds
- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS** configuration for cross-origin requests
- **Input sanitization** to prevent XSS and injection attacks
- **Environment-based configuration** for different deployment stages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6+ (local or MongoDB Atlas)
- Cloudinary account for image uploads
- Git for version control

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Cloudinary credentials
   - Email service settings (optional)

4. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000)

5. **Seed sample data** (optional)
   ```bash
   cd server && npm run seed
   ```

### Docker Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## 📁 Project Structure

```
ecommerce-platform/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Layout/              # Header, Footer, Navigation
│   │   │   ├── Auth/                # Authentication components
│   │   │   ├── Product/             # Product-related components
│   │   │   ├── Cart/                # Shopping cart components
│   │   │   └── Admin/               # Admin panel components
│   │   ├── pages/                   # Page components and routes
│   │   │   ├── Auth/                # Login, Register, Reset Password
│   │   │   ├── Account/             # User account pages
│   │   │   └── Admin/               # Admin management pages
│   │   ├── stores/                  # Zustand state management
│   │   ├── services/                # API service functions
│   │   ├── hooks/                   # Custom React hooks
│   │   └── utils/                   # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── server/                          # Node.js backend application
│   ├── controllers/                 # Route controllers and business logic
│   ├── models/                      # MongoDB/Mongoose data models
│   ├── routes/                      # Express.js API routes
│   ├── middleware/                  # Custom middleware functions
│   ├── utils/                       # Backend utility functions
│   ├── config/                      # Configuration files
│   ├── scripts/                     # Database seeding and migration scripts
│   ├── package.json
│   └── Dockerfile
├── shared/                          # Shared utilities and types
├── docker-compose.yml               # Docker services configuration
├── .env.example                     # Environment variables template
├── ARCHITECTURE.md                  # System architecture documentation
├── API_DOCUMENTATION.md             # Complete API reference
├── DEPLOYMENT.md                    # Production deployment guide
└── README.md                        # This file
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure authentication with HttpOnly cookies
- **Role-Based Access**: User and Admin role separation
- **Password Security**: Bcrypt hashing with salt rounds
- **Session Management**: Automatic token refresh and logout

### Data Protection
- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Prevention**: Mongoose ODM with parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API endpoint protection against abuse

### Infrastructure Security
- **HTTPS Enforcement**: SSL/TLS encryption in production
- **Security Headers**: Helmet.js for comprehensive header protection
- **CORS Configuration**: Controlled cross-origin resource sharing
- **File Upload Security**: Type validation and size limits
- **Environment Variables**: Sensitive data protection

## 📊 Performance Features

### Frontend Optimizations
- **Code Splitting**: Route-based and component-based lazy loading
- **Image Optimization**: Cloudinary transformations and lazy loading
- **Bundle Optimization**: Vite's advanced bundling and tree shaking
- **Caching Strategy**: React Query for intelligent data caching
- **Responsive Images**: Multiple sizes for different screen densities

### Backend Optimizations
- **Database Indexing**: Strategic indexes for fast queries
- **Query Optimization**: Efficient MongoDB aggregation pipelines
- **Response Compression**: Gzip compression for reduced payload
- **Connection Pooling**: Optimized database connection management
- **Caching Layer**: Redis-ready for session and data caching

## 🌐 API Overview

### Public Endpoints
- `GET /api/products` - Browse products with filtering and search
- `GET /api/categories` - Get product categories
- `GET /api/products/:slug` - Get product details
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### Protected User Endpoints
- `GET /api/cart` - Get user's shopping cart
- `POST /api/cart/add` - Add items to cart
- `POST /api/orders` - Create new order
- `GET /api/orders/my` - Get user's order history
- `POST /api/reviews` - Create product review

### Admin Endpoints
- `POST /api/products` - Create new product
- `GET /api/orders` - Manage all orders
- `GET /api/users` - User management
- `POST /api/coupons` - Create discount coupons
- `GET /api/analytics` - Dashboard analytics

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🚀 Deployment Options

### Option 1: Vercel + Render (Recommended)
- **Frontend**: Deploy to Vercel for optimal performance
- **Backend**: Deploy to Render for reliable hosting
- **Database**: MongoDB Atlas for managed database
- **Storage**: Cloudinary for image management

### Option 2: Docker Deployment
- **Containerized**: Full Docker support with multi-stage builds
- **Orchestration**: Docker Compose for local development
- **Production**: Kubernetes-ready for enterprise deployment

### Option 3: Traditional VPS
- **Server**: Ubuntu/CentOS with Node.js and MongoDB
- **Process Management**: PM2 for application lifecycle
- **Reverse Proxy**: Nginx for load balancing and SSL
- **Monitoring**: Winston logging with log rotation

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 📚 Documentation

- **[System Architecture](ARCHITECTURE.md)** - Detailed technical architecture
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
- Unit tests for models and utilities
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for user workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation files
- Review the API documentation for integration help

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core e-commerce functionality
- ✅ User authentication and authorization
- ✅ Product catalog and search
- ✅ Shopping cart and checkout
- ✅ Order management
- ✅ Admin dashboard

### Phase 2 (Upcoming)
- 🔄 Payment gateway integration (Stripe, PayPal)
- 🔄 Advanced analytics and reporting
- 🔄 Email marketing integration
- 🔄 Multi-vendor marketplace support
- 🔄 Mobile app (React Native)
- 🔄 Advanced search with Elasticsearch

### Phase 3 (Future)
- 📋 Multi-language support (i18n)
- 📋 Advanced inventory management
- 📋 Subscription and recurring payments
- 📋 AI-powered product recommendations
- 📋 Advanced SEO and marketing tools
- 📋 Microservices architecture migration

---

**Built with ❤️ for the modern web**