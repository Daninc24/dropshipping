const User = require('../models/User');
const Address = require('../models/Address');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('addresses')
    .populate('wishlist', 'name slug price images averageRating numOfReviews');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: addresses
  });
});

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res) => {
  const address = await Address.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: address
  });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res) => {
  let address = await Address.findById(req.params.id);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this address'
    });
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  // Make sure user owns address
  if (address.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this address'
    });
  }

  await address.softDelete();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully'
  });
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.wishlist.includes(req.params.productId)) {
    return res.status(400).json({
      success: false,
      message: 'Product already in wishlist'
    });
  }

  user.wishlist.push(req.params.productId);
  await user.save();

  const updatedUser = await User.findById(req.user.id)
    .populate('wishlist', 'name slug price images averageRating numOfReviews');

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.wishlist = user.wishlist.filter(
    item => item.toString() !== req.params.productId
  );

  await user.save();

  const updatedUser = await User.findById(req.user.id)
    .populate('wishlist', 'name slug price images averageRating numOfReviews');

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'wishlist',
      select: 'name slug price comparePrice images averageRating numOfReviews category brand status',
      populate: {
        path: 'category',
        select: 'name slug'
      }
    });

  res.status(200).json({
    success: true,
    data: user.wishlist || []
  });
});