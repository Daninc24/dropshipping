const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  let query = { status: 'active' };

  // Search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Category filter
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (category) {
      query.category = category._id;
    }
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Rating filter
  if (req.query.minRating) {
    query.averageRating = { $gte: parseFloat(req.query.minRating) };
  }

  // Featured filter
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Brand filter
  if (req.query.brand) {
    query.brand = { $in: req.query.brand.split(',') };
  }

  // Tags filter
  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  // Sort options
  let sortBy = {};
  switch (req.query.sort) {
    case 'price-low':
      sortBy = { price: 1 };
      break;
    case 'price-high':
      sortBy = { price: -1 };
      break;
    case 'rating':
      sortBy = { averageRating: -1 };
      break;
    case 'newest':
      sortBy = { createdAt: -1 };
      break;
    case 'popular':
      sortBy = { totalSales: -1 };
      break;
    default:
      sortBy = { createdAt: -1 };
  }

  // Execute query
  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug');

  const total = await Product.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: products,
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

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Increment views
  product.views += 1;
  await product.save({ validateBeforeSave: false });

  // Get related products
  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    status: 'active'
  })
    .limit(4)
    .select('name slug price images averageRating numOfReviews');

  res.status(200).json({
    success: true,
    data: {
      product,
      relatedProducts
    }
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
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
});

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Admin
exports.uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please upload at least one image'
    });
  }

  const uploadPromises = req.files.map(file => 
    cloudinary.uploader.upload(file.path, {
      folder: 'products',
      transformation: [
        { width: 800, height: 800, crop: 'fill' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    })
  );

  const results = await Promise.all(uploadPromises);

  const images = results.map((result, index) => ({
    public_id: result.public_id,
    url: result.secure_url,
    alt: req.body.alt?.[index] || '',
    isMain: index === 0
  }));

  res.status(200).json({
    success: true,
    data: images
  });
});