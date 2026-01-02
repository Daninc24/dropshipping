const redis = require('redis');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Create Redis client
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis server connection refused');
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            logger.error('Redis max retry attempts reached');
            return undefined;
          }
          // Reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });

      // Event handlers
      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
        this.isConnected = false;
      });

      // Connect to Redis
      await this.client.connect();
      
      return this.client;
    } catch (error) {
      logger.error('Redis connection failed:', error);
      this.isConnected = false;
      // Don't exit process, just log error and continue without Redis
      return null;
    }
  }

  // Cache methods
  async get(key) {
    if (!this.isConnected || !this.client) return null;
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected || !this.client) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async flushAll() {
    if (!this.isConnected || !this.client) return false;
    
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      logger.error('Redis FLUSHALL error:', error);
      return false;
    }
  }

  // Cache patterns for e-commerce
  async cacheProduct(productId, product, ttl = 1800) { // 30 minutes
    return await this.set(`product:${productId}`, product, ttl);
  }

  async getCachedProduct(productId) {
    return await this.get(`product:${productId}`);
  }

  async cacheProductList(key, products, ttl = 600) { // 10 minutes
    return await this.set(`products:${key}`, products, ttl);
  }

  async getCachedProductList(key) {
    return await this.get(`products:${key}`);
  }

  async cacheCategories(categories, ttl = 3600) { // 1 hour
    return await this.set('categories:all', categories, ttl);
  }

  async getCachedCategories() {
    return await this.get('categories:all');
  }

  async cacheSettings(settings, ttl = 1800) { // 30 minutes
    return await this.set('settings:global', settings, ttl);
  }

  async getCachedSettings() {
    return await this.get('settings:global');
  }

  // Session management
  async setSession(sessionId, data, ttl = 86400) { // 24 hours
    return await this.set(`session:${sessionId}`, data, ttl);
  }

  async getSession(sessionId) {
    return await this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId) {
    return await this.del(`session:${sessionId}`);
  }

  // Cart caching
  async cacheCart(userId, cart, ttl = 3600) { // 1 hour
    return await this.set(`cart:${userId}`, cart, ttl);
  }

  async getCachedCart(userId) {
    return await this.get(`cart:${userId}`);
  }

  async clearCart(userId) {
    return await this.del(`cart:${userId}`);
  }

  // Graceful shutdown
  async disconnect() {
    if (this.client) {
      try {
        await this.client.quit();
        logger.info('Redis client disconnected gracefully');
      } catch (error) {
        logger.error('Error disconnecting Redis:', error);
      }
    }
  }
}

// Create singleton instance
const redisService = new RedisService();

module.exports = redisService;