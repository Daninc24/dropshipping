const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const { product, rating, title, comment, pros, cons } = req.body;

  // Check if product exists
  const productExists = await Product.findById(product);
  if (!productExists) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user.id,
    product
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product'
    });
  }

  // Check if user purchased this product
  const order = await Order.findOne({
    user: req.user.id,
    'items.product': product,
    orderStatus: 'delivered'
  });

  const review = await Review.create({
    user: req.user.id,
    product,
    order: order?._id,
    rating,
    title,
    comment,
    pros: pros || [],
    cons: cons || [],
    verified: !!order,
    status: 'approved' // Auto-approve for now, can add moderation later
  });

  const populatedReview = await Review.findById(review._id)
    .populate('user', 'firstName lastName avatar');

  res.status(201).json({
    success: true,
    data: populatedReview
  });
});

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {
    product: req.params.productId,
    status: 'approved'
  };

  // Sort options
  let sortBy = {};
  switch (req.query.sort) {
    case 'newest':
      sortBy = { createdAt: -1 };
      break;
    case 'oldest':
      sortBy = { createdAt: 1 };
      break;
    case 'rating-high':
      sortBy = { rating: -1 };
      break;
    case 'rating-low':
      sortBy = { rating: 1 };
      break;
    case 'helpful':
      sortBy = { 'helpful.count': -1 };
      break;
    default:
      sortBy = { createdAt: -1 };
  }

  const reviews = await Review.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName avatar');

  const total = await Review.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Get rating distribution
  const ratingStats = await Review.aggregate([
    { $match: { product: req.params.productId, status: 'approved' } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    ratingStats
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Make sure user owns review
  if (review.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this review'
    });
  }

  const { rating, title, comment, pros, cons } = req.body;

  review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || []
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('user', 'firstName lastName avatar');

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  // Make sure user owns review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this review'
    });
  }

  await review.softDelete();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  try {
    await review.markHelpful(req.user.id);
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Remove helpful mark
// @route   DELETE /api/reviews/:id/helpful
// @access  Private
exports.removeHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  try {
    await review.removeHelpful(req.user.id);
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
exports.reportReview = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  try {
    await review.reportReview(req.user.id, reason);
    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by rating
  if (req.query.rating) {
    query.rating = parseInt(req.query.rating);
  }

  const reviews = await Review.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email')
    .populate('product', 'name slug');

  const total = await Review.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});