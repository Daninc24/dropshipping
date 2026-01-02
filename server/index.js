const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Import utilities
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/database');
// const redisService = require('./config/redis');
// const { cache } = require('./middleware/cache');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const couponRoutes = require('./routes/coupons');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const walletRoutes = require('./routes/wallet');
const deliveryRoutes = require('./routes/delivery');
const auditRoutes = require('./routes/audit');
const settingsRoutes = require('./routes/settings');

// Load environment variables
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Connect to database
connectDB();

// Connect to Redis (optional - won't crash if Redis is unavailable)
// redisService.connect().catch(err => {
//   logger.warn('Redis connection failed, continuing without cache:', err.message);
// });

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Rate limiting - very generous for development, stricter for production
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 10000 : 1000, // 10k for dev, 1k for prod
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for development and certain endpoints
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      return true // Skip all rate limiting in development
    }
    
    // In production, skip for health checks and static assets
    const skipPaths = ['/api/health']
    return skipPaths.some(path => req.path === path)
  }
});

// Only apply rate limiting in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_RATE_LIMITING === 'true') {
  app.use('/api/', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// API routes (caching disabled until Redis is installed)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Close server
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Close database connection
    try {
      await mongoose.connection.close();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database:', error);
    }
    
    // Close Redis connection (when available)
    // try {
    //   await redisService.disconnect();
    //   logger.info('Redis connection closed');
    // } catch (error) {
    //   logger.error('Error closing Redis:', error);
    // }
    
    process.exit(0);
  });
});

module.exports = app;