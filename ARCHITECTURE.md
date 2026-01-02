# System Architecture Overview

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Vite          │    │ • Express.js    │    │ • Collections   │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Indexes       │
│ • Zustand       │    │ • Validation    │    │ • Aggregation   │
│ • React Query   │    │ • File Upload   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Storage   │    │   External      │    │   Monitoring    │
│                 │    │   Services      │    │                 │
│ • Cloudinary    │    │ • Email (SMTP)  │    │ • Winston Logs  │
│ • Image Opt     │    │ • Payment APIs  │    │ • Health Checks │
│ • Asset Delivery│    │ • SMS Services  │    │ • Error Tracking│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
ecommerce-platform/
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Layout/         # Layout components
│   │   │   ├── Auth/           # Authentication components
│   │   │   ├── Product/        # Product-related components
│   │   │   ├── Cart/           # Cart components
│   │   │   └── Admin/          # Admin components
│   │   ├── pages/              # Page components
│   │   │   ├── Auth/           # Auth pages
│   │   │   ├── Account/        # User account pages
│   │   │   └── Admin/          # Admin pages
│   │   ├── stores/             # Zustand stores
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── server/                     # Node.js backend
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── utils/                  # Utility functions
│   ├── config/                 # Configuration files
│   ├── scripts/                # Database scripts
│   ├── logs/                   # Log files
│   ├── uploads/                # File uploads
│   ├── package.json
│   └── Dockerfile
├── shared/                     # Shared utilities
├── docker-compose.yml          # Docker configuration
├── .env.example               # Environment template
└── README.md                  # Project documentation
```

## 🗄️ Database Schema

### Core Collections

#### Users
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: { public_id: String, url: String },
  role: String (enum: ['user', 'admin']),
  addresses: [ObjectId] (ref: Address),
  wishlist: [ObjectId] (ref: Product),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Products
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  description: String,
  shortDescription: String,
  price: Number,
  comparePrice: Number,
  sku: String,
  category: ObjectId (ref: Category),
  brand: String,
  tags: [String],
  images: [{
    public_id: String,
    url: String,
    alt: String,
    isMain: Boolean
  }],
  variants: [{
    name: String,
    options: [String]
  }],
  specifications: [{
    name: String,
    value: String
  }],
  quantity: Number,
  trackQuantity: Boolean,
  status: String (enum: ['active', 'inactive', 'draft']),
  featured: Boolean,
  averageRating: Number,
  numOfReviews: Number,
  totalSales: Number,
  views: Number,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    image: { url: String, alt: String },
    price: Number,
    quantity: Number,
    selectedVariants: [{ name: String, value: String }],
    total: Number
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentInfo: {
    method: String,
    transactionId: String,
    status: String,
    paidAt: Date
  },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  discountAmount: Number,
  totalPrice: Number,
  orderStatus: String,
  shippingInfo: {
    carrier: String,
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId (ref: User)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Supporting Collections

#### Categories
- Hierarchical structure with parent-child relationships
- SEO optimization fields
- Product count tracking

#### Cart
- User-specific shopping cart
- Coupon application
- Real-time price calculation

#### Reviews
- Product reviews and ratings
- Helpful/report functionality
- Admin moderation

#### Coupons
- Flexible discount system
- Usage tracking and limits
- Product/category restrictions

#### Addresses
- User address management
- Default address selection
- Soft delete support

#### Notifications
- Multi-channel delivery
- Priority levels
- Read/unread status

## 🔄 API Architecture

### RESTful Endpoints

```
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
PUT    /api/auth/reset-password/:token

Products
GET    /api/products              # Public
GET    /api/products/:slug        # Public
POST   /api/products              # Admin
PUT    /api/products/:id          # Admin
DELETE /api/products/:id          # Admin

Categories
GET    /api/categories            # Public
POST   /api/categories            # Admin
PUT    /api/categories/:id        # Admin
DELETE /api/categories/:id        # Admin

Cart
GET    /api/cart                  # Protected
POST   /api/cart/add              # Protected
PUT    /api/cart/update           # Protected
DELETE /api/cart/remove/:id       # Protected

Orders
POST   /api/orders                # Protected
GET    /api/orders/my             # Protected
GET    /api/orders/:id            # Protected
GET    /api/orders                # Admin
PUT    /api/orders/:id/status     # Admin

Reviews
POST   /api/reviews               # Protected
GET    /api/reviews/:productId    # Public
DELETE /api/reviews/:id           # Protected/Admin

Users
GET    /api/users/profile         # Protected
PUT    /api/users/profile         # Protected
GET    /api/users/addresses       # Protected
POST   /api/users/addresses       # Protected
PUT    /api/users/addresses/:id   # Protected
DELETE /api/users/addresses/:id   # Protected
```

### Response Format
```javascript
{
  success: Boolean,
  message: String,
  data: Object|Array,
  pagination: {
    page: Number,
    limit: Number,
    total: Number,
    totalPages: Number,
    hasNext: Boolean,
    hasPrev: Boolean
  }
}
```

## 🔐 Security Architecture

### Authentication Flow
1. User submits credentials
2. Server validates and creates JWT
3. JWT stored in HttpOnly cookie
4. Subsequent requests include cookie
5. Server validates JWT on protected routes

### Authorization Levels
- **Guest**: Browse products, view details
- **User**: Full shopping experience, account management
- **Admin**: Complete system management

### Security Measures
- Password hashing with bcrypt
- JWT tokens with expiration
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers (Helmet.js)
- File upload restrictions
- SQL injection prevention
- XSS protection

## 📊 State Management

### Frontend State (Zustand)

#### Auth Store
```javascript
{
  user: Object|null,
  token: String|null,
  isAuthenticated: Boolean,
  isLoading: Boolean,
  // Actions: login, logout, register, updateProfile
}
```

#### Cart Store
```javascript
{
  items: Array,
  totalItems: Number,
  totalPrice: Number,
  appliedCoupon: Object|null,
  discountAmount: Number,
  finalPrice: Number,
  // Actions: addItem, updateQuantity, removeItem, applyCoupon
}
```

#### UI Store
```javascript
{
  theme: String,
  sidebarOpen: Boolean,
  notifications: Array,
  // Actions: toggleTheme, toggleSidebar, addNotification
}
```

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Images and components
- **Caching**: React Query for API responses
- **Bundle Optimization**: Vite build optimizations
- **Image Optimization**: Cloudinary transformations

### Backend
- **Database Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Aggregation pipelines and efficient queries
- **Caching**: Redis for session and frequently accessed data
- **Compression**: Gzip compression for responses
- **Rate Limiting**: Prevent abuse and ensure fair usage

### Database
- **Indexing Strategy**: Compound indexes for complex queries
- **Aggregation Pipelines**: Efficient data processing
- **Connection Pooling**: Optimized database connections
- **Query Optimization**: Efficient query patterns

## 🔄 Data Flow

### User Registration/Login
```
Client → API → Validation → Database → JWT Creation → Cookie Setting → Response
```

### Product Browsing
```
Client → API → Database Query → Response Formatting → Caching → Client Update
```

### Order Processing
```
Cart → Validation → Inventory Check → Payment Processing → Order Creation → 
Email Notification → Inventory Update → Response
```

### Admin Operations
```
Admin Panel → Authentication Check → Authorization Check → Database Operation → 
Audit Log → Response → UI Update
```

## 🧪 Testing Strategy

### Unit Tests
- Model validation
- Utility functions
- Component logic

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User registration/login
- Product browsing
- Cart operations
- Checkout process
- Admin operations

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless server design
- Load balancer ready
- Database sharding support
- CDN integration

### Vertical Scaling
- Efficient resource usage
- Memory optimization
- CPU-intensive task optimization

### Future Enhancements
- Microservices architecture
- Event-driven architecture
- Real-time features with WebSockets
- Advanced caching strategies
- Search engine integration (Elasticsearch)