const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Validate stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product || product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Product ${item.product.name} is no longer available`
      });
    }

    if (product.trackQuantity && product.quantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.product.name}`
      });
    }
  }

  // Prepare order items
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0] || {},
    price: item.price,
    quantity: item.quantity,
    selectedVariants: item.selectedVariants || [],
    total: item.price * item.quantity
  }));

  // Calculate prices
  const itemsPrice = cart.totalPrice;
  const taxPrice = Math.round(itemsPrice * 0.1 * 100) / 100; // 10% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const discountAmount = cart.discountAmount || 0;
  const totalPrice = itemsPrice + taxPrice + shippingPrice - discountAmount;

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentInfo: {
      method: paymentMethod,
      status: 'pending'
    },
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
    appliedCoupon: cart.appliedCoupon,
    notes
  });

  // Update product quantities
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (product.trackQuantity) {
      product.quantity -= item.quantity;
      product.totalSales += item.quantity;
      await product.save();
    }
  }

  // Update coupon usage if applied
  if (cart.appliedCoupon) {
    const coupon = await Coupon.findOne({ code: cart.appliedCoupon.code });
    if (coupon) {
      await coupon.useCoupon(req.user.id, totalPrice, discountAmount);
    }
  }

  // Clear cart
  await cart.clearCart();

  // Populate order for response
  const populatedOrder = await Order.findById(order._id).populate('user', 'firstName lastName email');

  res.status(201).json({
    success: true,
    data: populatedOrder
  });
});

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { user: req.user.id };

  // Filter by status
  if (req.query.status) {
    query.orderStatus = req.query.status;
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Make sure user owns order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this order'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = {};

  // Filter by status
  if (req.query.status) {
    query.orderStatus = req.query.status;
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email');

  const total = await Order.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: orders,
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

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber, carrier } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update shipping info if provided
  if (trackingNumber) {
    order.shippingInfo.trackingNumber = trackingNumber;
  }
  if (carrier) {
    order.shippingInfo.carrier = carrier;
  }

  // Update order status
  await order.updateStatus(status, note, req.user.id);

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Make sure user owns order
  if (order.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to cancel this order'
    });
  }

  // Check if order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage'
    });
  }

  // Restore product quantities
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product && product.trackQuantity) {
      product.quantity += item.quantity;
      product.totalSales -= item.quantity;
      await product.save();
    }
  }

  // Update order status
  await order.updateStatus('cancelled', 'Cancelled by customer', req.user.id);

  res.status(200).json({
    success: true,
    data: order
  });
});