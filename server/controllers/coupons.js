const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Filter by status
  if (req.query.status) {
    if (req.query.status === 'active') {
      query.isActive = true;
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    } else if (req.query.status === 'inactive') {
      query.isActive = false;
    } else if (req.query.status === 'expired') {
      query.endDate = { $lt: new Date() };
    }
  }

  // Filter by discount type
  if (req.query.discountType) {
    query.discountType = req.query.discountType;
  }

  const coupons = await Coupon.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'firstName lastName');

  const total = await Coupon.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: coupons,
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

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate('createdBy', 'firstName lastName')
    .populate('applicableProducts', 'name slug')
    .populate('applicableCategories', 'name slug');

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
});

// @desc    Validate coupon
// @route   GET /api/coupons/validate?code=COUPONCODE
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code is required'
    });
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }

  // Validate coupon
  const validation = coupon.isValid(req.user.id, parseFloat(req.query.amount) || 0);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message
    });
  }

  // Calculate discount
  const amount = parseFloat(req.query.amount) || 0;
  const discount = coupon.calculateDiscount(amount);

  res.status(200).json({
    success: true,
    data: {
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumAmount: coupon.minimumAmount,
        maximumDiscount: coupon.maximumDiscount
      },
      discount,
      finalAmount: Math.max(0, amount - discount)
    }
  });
});

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: coupon
  });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Coupon not found'
    });
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Coupon not found'
    });
  }

  await coupon.softDelete();

  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});