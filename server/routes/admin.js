const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

// Apply auth middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
router.get('/dashboard/stats', async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Get current month stats
    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      lowStockProducts,
      lastMonthRevenue,
      lastMonthOrders
    ] = await Promise.all([
      // Total revenue
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Total orders
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      
      // Total products
      Product.countDocuments({ isDeleted: { $ne: true } }),
      
      // Total users
      User.countDocuments({ role: 'user' }),
      
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      
      // Low stock products
      Product.countDocuments({
        trackQuantity: true,
        $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
        isDeleted: { $ne: true }
      }),
      
      // Last month revenue for growth calculation
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: lastMonth, $lt: now }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Last month orders for growth calculation
      Order.countDocuments({
        status: { $ne: 'cancelled' },
        createdAt: { $gte: lastMonth, $lt: now }
      })
    ]);

    const currentRevenue = totalRevenue[0]?.total || 0;
    const lastMonthRev = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMonthRev > 0 ? ((currentRevenue - lastMonthRev) / lastMonthRev) * 100 : 0;
    const ordersGrowth = lastMonthOrders > 0 ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: currentRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        lowStockProducts,
        revenueGrowth: Math.round(revenueGrowth),
        ordersGrowth: Math.round(ordersGrowth)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// @desc    Get sales chart data
// @route   GET /api/admin/dashboard/sales-chart
// @access  Private/Admin
router.get('/dashboard/sales-chart', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get daily sales for the last 30 days
    const salesData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get category sales distribution
    const categoryData = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          value: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]);

    // Format sales data with proper date labels
    const formattedSalesData = salesData.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: item.sales
    }));

    // Format category data
    const formattedCategoryData = categoryData.map(item => ({
      name: item._id,
      value: item.value
    }));

    res.status(200).json({
      success: true,
      data: {
        salesData: formattedSalesData,
        categoryData: formattedCategoryData
      }
    });
  } catch (error) {
    console.error('Sales chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales chart data'
    });
  }
});

// @desc    Get top selling products
// @route   GET /api/admin/products/top-selling
// @access  Private/Admin
router.get('/products/top-selling', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await Product.find({
      isDeleted: { $ne: true }
    })
    .sort({ totalSales: -1, views: -1 })
    .limit(limit)
    .select('name price images totalSales views');

    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top selling products'
    });
  }
});

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    await product.softDelete();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      data: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
});

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isDeleted: { $ne: true } };
    
    // Search
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Stock filter
    if (req.query.stock) {
      if (req.query.stock === 'out-of-stock') {
        query.trackQuantity = true;
        query.quantity = 0;
      } else if (req.query.stock === 'low-stock') {
        query.trackQuantity = true;
        query.$expr = { $lte: ['$quantity', '$lowStockThreshold'] };
      } else if (req.query.stock === 'in-stock') {
        query.$or = [
          { trackQuantity: false },
          { trackQuantity: true, $expr: { $gt: ['$quantity', '$lowStockThreshold'] } }
        ];
      }
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy.startsWith('-') 
        ? req.query.sortBy.substring(1) 
        : req.query.sortBy;
      const sortOrder = req.query.sortBy.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    };

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination
      }
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Date filters
    if (req.query.dateFrom || req.query.dateTo) {
      query.createdAt = {};
      if (req.query.dateFrom) {
        query.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        query.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    // Search
    if (req.query.search) {
      query.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') 
        ? req.query.sort.substring(1) 
        : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    };

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination
      }
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @desc    Get order statistics
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
router.get('/orders/stats', async (req, res) => {
  try {
    const [
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Role filter
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Status filter
    if (req.query.status) {
      query.isActive = req.query.status === 'active';
    }

    // Verified filter
    if (req.query.verified) {
      query.isEmailVerified = req.query.verified === 'true';
    }

    // Search
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy.startsWith('-') 
        ? req.query.sortBy.substring(1) 
        : req.query.sortBy;
      const sortOrder = req.query.sortBy.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    };

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private/Admin
router.get('/users/stats', async (req, res) => {
  try {
    const [
      total,
      active,
      inactive,
      verified,
      admins
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ isEmailVerified: true }),
      User.countDocuments({ role: 'admin' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        verified,
        admins
      }
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// @desc    Update user
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
router.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// @desc    Get all reviews for admin
// @route   GET /api/admin/reviews
// @access  Private/Admin
router.get('/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = parseInt(req.query.rating);
    }

    // Verified filter
    if (req.query.verified) {
      query.verified = req.query.verified === 'true';
    }

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { comment: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy.startsWith('-') 
        ? req.query.sortBy.substring(1) 
        : req.query.sortBy;
      const sortOrder = req.query.sortBy.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'firstName lastName email avatar')
        .populate('product', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Review.countDocuments(query)
    ]);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination
      }
    });
  } catch (error) {
    console.error('Admin reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// @desc    Get review statistics
// @route   GET /api/admin/reviews/stats
// @access  Private/Admin
router.get('/reviews/stats', async (req, res) => {
  try {
    const [
      total,
      pending,
      approved,
      rejected,
      averageRating
    ] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'rejected' }),
      Review.aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        averageRating: averageRating[0]?.avg || 0
      }
    });
  } catch (error) {
    console.error('Review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics'
    });
  }
});

// @desc    Update review status
// @route   PATCH /api/admin/reviews/:id/status
// @access  Private/Admin
router.patch('/reviews/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// @desc    Get all coupons for admin
// @route   GET /api/admin/coupons
// @access  Private/Admin
router.get('/coupons', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Status filter
    if (req.query.status) {
      const now = new Date();
      switch (req.query.status) {
        case 'active':
          query.isActive = true;
          query.endDate = { $gte: now };
          break;
        case 'inactive':
          query.isActive = false;
          break;
        case 'expired':
          query.endDate = { $lt: now };
          break;
      }
    }

    // Type filter
    if (req.query.type) {
      query.discountType = req.query.type;
    }

    // Search
    if (req.query.search) {
      query.$or = [
        { code: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy.startsWith('-') 
        ? req.query.sortBy.substring(1) 
        : req.query.sortBy;
      const sortOrder = req.query.sortBy.startsWith('-') ? -1 : 1;
      sort = { [sortField]: sortOrder };
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Coupon.countDocuments(query)
    ]);

    const pagination = {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    };

    res.status(200).json({
      success: true,
      data: {
        coupons,
        pagination
      }
    });
  } catch (error) {
    console.error('Admin coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons'
    });
  }
});

// @desc    Get coupon statistics
// @route   GET /api/admin/coupons/stats
// @access  Private/Admin
router.get('/coupons/stats', async (req, res) => {
  try {
    const now = new Date();
    
    const [
      total,
      active,
      expired,
      totalUsage
    ] = await Promise.all([
      Coupon.countDocuments(),
      Coupon.countDocuments({ isActive: true, endDate: { $gte: now } }),
      Coupon.countDocuments({ endDate: { $lt: now } }),
      Coupon.aggregate([
        { $group: { _id: null, total: { $sum: '$usedCount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        expired,
        totalUsage: totalUsage[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Coupon stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupon statistics'
    });
  }
});

// @desc    Create coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
router.post('/coupons', async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user._id
    };

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create coupon'
    });
  }
});

// @desc    Update coupon
// @route   PATCH /api/admin/coupons/:id
// @access  Private/Admin
router.patch('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update coupon'
    });
  }
});

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
router.delete('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coupon'
    });
  }
});

// @desc    Bulk update products
// @route   PATCH /api/admin/products/bulk
// @access  Private/Admin
router.patch('/products/bulk', async (req, res) => {
  try {
    const { productIds, action } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required'
      });
    }

    let updateData = {};
    
    switch (action) {
      case 'activate':
        updateData = { status: 'active' };
        break;
      case 'deactivate':
        updateData = { status: 'inactive' };
        break;
      case 'feature':
        updateData = { featured: true };
        break;
      case 'unfeature':
        updateData = { featured: false };
        break;
      case 'delete':
        updateData = { isDeleted: true, deletedAt: new Date() };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      message: `Bulk ${action} completed successfully`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk update'
    });
  }
});

// @desc    Get order statistics
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
router.get('/orders/stats', async (req, res) => {
  try {
    const [
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// @desc    Get settings (redirect to new settings API)
// @route   GET /api/admin/settings
// @access  Private/Admin
router.get('/settings', async (req, res) => {
  try {
    // Redirect to new settings API
    const settingsController = require('../controllers/settings');
    await settingsController.getSettings(req, res);
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// @desc    Update settings (redirect to new settings API)
// @route   PUT /api/admin/settings
// @access  Private/Admin
router.put('/settings', async (req, res) => {
  try {
    // Redirect to new settings API
    const settingsController = require('../controllers/settings');
    await settingsController.updateSettings(req, res);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '30d';
    const now = new Date();
    let startDate;

    // Calculate start date based on time range
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get overview metrics
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      salesChart,
      ordersChart,
      topProducts,
      topCategories
    ] = await Promise.all([
      // Total revenue
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startDate }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),

      // Total orders
      Order.countDocuments({
        status: { $ne: 'cancelled' },
        createdAt: { $gte: startDate }
      }),

      // Total customers
      User.countDocuments({
        role: 'user',
        createdAt: { $gte: startDate }
      }),

      // Sales chart data
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Orders chart data
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Top products by revenue
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startDate }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product._id',
            name: { $first: '$product.name' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            sales: { $sum: '$items.quantity' },
            avgPrice: { $avg: '$items.price' }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ]),

      // Top categories by revenue
      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
            createdAt: { $gte: startDate }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.category',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $group: {
            _id: '$category._id',
            name: { $first: '$category.name' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 6 }
      ])
    ]);

    // Calculate metrics
    const revenue = totalRevenue[0]?.total || 0;
    const orders = totalOrders || 0;
    const customers = totalCustomers || 0;
    const averageOrderValue = orders > 0 ? revenue / orders : 0;

    // Format chart data
    const formattedSalesChart = salesChart.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: item.revenue
    }));

    const formattedOrdersChart = ordersChart.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      orders: item.orders
    }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalRevenue: revenue,
          totalOrders: orders,
          totalCustomers: customers,
          averageOrderValue,
          revenueGrowth: Math.floor(Math.random() * 20) - 10, // Mock data
          ordersGrowth: Math.floor(Math.random() * 20) - 10,
          customersGrowth: Math.floor(Math.random() * 20) - 10,
          aovGrowth: Math.floor(Math.random() * 20) - 10,
          conversionRate: 2.4,
          repeatCustomerRate: 35,
          customerLifetimeValue: 245
        },
        salesChart: formattedSalesChart,
        ordersChart: formattedOrdersChart,
        topProducts,
        topCategories,
        customerSegments: [
          { segment: 'New Customers', count: 45, percentage: 35, revenue: 12500 },
          { segment: 'Returning Customers', count: 78, percentage: 60, revenue: 28900 },
          { segment: 'VIP Customers', count: 12, percentage: 5, revenue: 15600 }
        ]
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// @desc    Get all categories for admin
// @route   GET /api/admin/categories
// @access  Private/Admin
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: { $ne: true } })
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Admin categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category'
    });
  }
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ 
      category: req.params.id,
      isDeleted: { $ne: true }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products assigned to it.`
      });
    }

    // Soft delete
    await category.softDelete();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
});

module.exports = router;