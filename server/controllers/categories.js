const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  let query = { status: 'active' };

  // Filter by parent
  if (req.query.parent) {
    query.parent = req.query.parent === 'null' ? null : req.query.parent;
  }

  // Filter by featured
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Filter by level
  if (req.query.level) {
    query.level = parseInt(req.query.level);
  }

  const categories = await Category.find(query)
    .sort({ sortOrder: 1, name: 1 })
    .populate('parent', 'name slug');

  res.status(200).json({
    success: true,
    data: categories
  });
});

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = asyncHandler(async (req, res) => {
  const tree = await Category.getTree();

  res.status(200).json({
    success: true,
    data: tree
  });
});

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug })
    .populate('parent', 'name slug')
    .populate('children');

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
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has products
  const Product = require('../models/Product');
  const productCount = await Product.countDocuments({ category: req.params.id });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with existing products'
    });
  }

  // Soft delete
  await category.softDelete();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});