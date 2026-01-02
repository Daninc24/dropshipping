const redisService = require('../config/redis');
const logger = require('../utils/logger');

// Cache middleware for API responses
const cache = (duration = 600) => { // Default 10 minutes
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated requests (except public data)
    const publicEndpoints = ['/products', '/categories', '/settings'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      req.originalUrl.includes(endpoint)
    );

    if (req.user && !isPublicEndpoint) {
      return next();
    }

    // Create cache key from URL and query parameters
    const cacheKey = `api:${req.originalUrl}`;

    try {
      // Try to get cached response
      const cachedResponse = await redisService.get(cacheKey);
      
      if (cachedResponse) {
        logger.info(`Cache HIT: ${cacheKey}`);
        return res.status(200).json(cachedResponse);
      }

      // Cache miss - continue to route handler
      logger.info(`Cache MISS: ${cacheKey}`);

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Only cache successful responses
        if (res.statusCode === 200 && data.success) {
          redisService.set(cacheKey, data, duration)
            .then(() => logger.info(`Cached response: ${cacheKey}`))
            .catch(err => logger.error('Cache set error:', err));
        }
        
        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      // Continue without caching on error
      next();
    }
  };
};

// Cache invalidation helpers
const invalidateCache = {
  // Invalidate product-related caches
  products: async () => {
    try {
      const keys = await redisService.client?.keys('api:*products*') || [];
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redisService.del(key)));
        logger.info(`Invalidated ${keys.length} product cache entries`);
      }
    } catch (error) {
      logger.error('Error invalidating product cache:', error);
    }
  },

  // Invalidate category-related caches
  categories: async () => {
    try {
      const keys = await redisService.client?.keys('api:*categories*') || [];
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redisService.del(key)));
        logger.info(`Invalidated ${keys.length} category cache entries`);
      }
      // Also clear cached categories
      await redisService.del('categories:all');
    } catch (error) {
      logger.error('Error invalidating category cache:', error);
    }
  },

  // Invalidate settings cache
  settings: async () => {
    try {
      const keys = await redisService.client?.keys('api:*settings*') || [];
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redisService.del(key)));
        logger.info(`Invalidated ${keys.length} settings cache entries`);
      }
      // Also clear cached settings
      await redisService.del('settings:global');
    } catch (error) {
      logger.error('Error invalidating settings cache:', error);
    }
  },

  // Clear all API caches
  all: async () => {
    try {
      const keys = await redisService.client?.keys('api:*') || [];
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redisService.del(key)));
        logger.info(`Invalidated ${keys.length} API cache entries`);
      }
    } catch (error) {
      logger.error('Error invalidating all cache:', error);
    }
  }
};

module.exports = {
  cache,
  invalidateCache
};