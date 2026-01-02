const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, selectedVariants = [] } = req.body;

  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Product is not available'
    });
  }

  // Check stock
  if (product.trackQuantity && product.quantity < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Add item to cart
  await cart.addItem(productId, quantity, product.price, selectedVariants);

  // Populate and return updated cart
  cart = await Cart.findById(cart._id).populate('items.product', 'name slug price images status quantity trackQuantity');

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity, selectedVariants = [] } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  // Validate product and stock
  const product = await Product.findById(productId);
  if (product && product.trackQuantity && product.quantity < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock'
    });
  }

  await cart.updateItemQuantity(productId, quantity, selectedVariants);

  // Populate and return updated cart
  const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name slug price images status quantity trackQuantity');

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { selectedVariants = [] } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  await cart.removeItem(req.params.productId, selectedVariants);

  // Populate and return updated cart
  const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name slug price images status quantity trackQuantity');

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  await cart.clearCart();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  if (cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Find coupon
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }

  // Validate coupon
  const validation = coupon.isValid(req.user.id, cart.totalPrice);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message
    });
  }

  // Calculate discount
  const discount = coupon.calculateDiscount(cart.totalPrice);

  // Apply coupon to cart
  await cart.applyCoupon(coupon.code, discount, coupon.discountType);

  // Populate and return updated cart
  const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name slug price images status quantity trackQuantity');

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
exports.removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  await cart.removeCoupon();

  // Populate and return updated cart
  const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name slug price images status quantity trackQuantity');

  res.status(200).json({
    success: true,
    data: updatedCart
  });
});