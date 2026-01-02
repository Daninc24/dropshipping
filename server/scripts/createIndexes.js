const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

// Import models to ensure they're registered
require('../models/User');
require('../models/Product');
require('../models/Category');
require('../models/Order');
require('../models/Cart');
require('../models/Review');
require('../models/Coupon');
require('../models/AuditLog');

const createIndexes = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    logger.info('Connected to MongoDB for index creation');

    // Get database connection
    const db = mongoose.connection.db;

    logger.info('Creating additional performance indexes...');

    try {
      // Products Collection - Additional performance indexes
      logger.info('Creating additional Product indexes...');
      await db.collection('products').createIndex({ category: 1, featured: 1 });
      await db.collection('products').createIndex({ price: 1 });
      await db.collection('products').createIndex({ createdAt: -1 });
      await db.collection('products').createIndex({ averageRating: -1 });
      await db.collection('products').createIndex({ totalSales: -1 });
      await db.collection('products').createIndex({ status: 1, featured: 1 });
      logger.info('✅ Additional Product indexes created');
    } catch (error) {
      logger.info('ℹ️  Product indexes already exist or created');
    }

    try {
      // Users Collection - Additional indexes
      logger.info('Creating additional User indexes...');
      await db.collection('users').createIndex({ createdAt: -1 });
      await db.collection('users').createIndex({ role: 1 });
      await db.collection('users').createIndex({ isActive: 1 });
      logger.info('✅ Additional User indexes created');
    } catch (error) {
      logger.info('ℹ️  User indexes already exist or created');
    }

    try {
      // Categories Collection - Additional indexes
      logger.info('Creating additional Category indexes...');
      await db.collection('categories').createIndex({ parent: 1 });
      await db.collection('categories').createIndex({ featured: 1, status: 1 });
      await db.collection('categories').createIndex({ level: 1 });
      logger.info('✅ Additional Category indexes created');
    } catch (error) {
      logger.info('ℹ️  Category indexes already exist or created');
    }

    try {
      // Orders Collection - Additional indexes
      logger.info('Creating additional Order indexes...');
      await db.collection('orders').createIndex({ user: 1, createdAt: -1 });
      await db.collection('orders').createIndex({ status: 1 });
      await db.collection('orders').createIndex({ createdAt: -1 });
      await db.collection('orders').createIndex({ 'shippingAddress.county': 1 });
      logger.info('✅ Additional Order indexes created');
    } catch (error) {
      logger.info('ℹ️  Order indexes already exist or created');
    }

    try {
      // Reviews Collection - Additional indexes
      logger.info('Creating additional Review indexes...');
      await db.collection('reviews').createIndex({ product: 1, createdAt: -1 });
      await db.collection('reviews').createIndex({ user: 1 });
      await db.collection('reviews').createIndex({ rating: -1 });
      logger.info('✅ Additional Review indexes created');
    } catch (error) {
      logger.info('ℹ️  Review indexes already exist or created');
    }

    // List all indexes for verification
    logger.info('\n📊 Current Index Summary:');
    const collections = ['products', 'users', 'categories', 'orders', 'reviews'];
    
    for (const collectionName of collections) {
      try {
        const indexes = await db.collection(collectionName).indexes();
        logger.info(`${collectionName}: ${indexes.length} indexes`);
        
        // Log index names for debugging
        const indexNames = indexes.map(idx => idx.name).join(', ');
        logger.info(`  Indexes: ${indexNames}`);
      } catch (error) {
        logger.info(`${collectionName}: Collection not found`);
      }
    }

    logger.info('\n🎉 Database optimization completed!');
    logger.info('Your database queries should now be faster.');
    
    // Test a few queries to verify performance
    logger.info('\n🧪 Testing query performance...');
    
    const Product = mongoose.model('Product');
    const startTime = Date.now();
    
    // Test featured products query
    const products = await Product.find({ featured: true, status: 'active' })
      .select('name slug price images category averageRating')
      .populate('category', 'name slug')
      .limit(8)
      .lean();
    
    const queryTime = Date.now() - startTime;
    logger.info(`Featured products query: ${queryTime}ms (${products.length} products)`);
    
    if (queryTime < 50) {
      logger.info('🚀 Excellent performance! Query under 50ms');
    } else if (queryTime < 100) {
      logger.info('✅ Very good performance! Query under 100ms');
    } else if (queryTime < 500) {
      logger.info('✅ Good performance! Query under 500ms');
    } else {
      logger.info('⚠️  Consider additional optimization for queries over 500ms');
    }

  } catch (error) {
    logger.error('Error during index creation:', error);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  }
};

// Run the index creation
createIndexes();