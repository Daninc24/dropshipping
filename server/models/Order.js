const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  selectedVariants: [{
    name: String,
    value: String
  }],
  total: {
    type: Number,
    required: true
  }
}, {
  _id: false
});

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentInfo: {
    method: {
      type: String,
      required: true,
      enum: ['card', 'paypal', 'bank_transfer', 'cash_on_delivery', 'mpesa', 'wallet']
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    discountType: String
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'delivery_failed'],
    default: 'pending'
  },
  shippingInfo: {
    carrier: String,
    trackingNumber: String,
    shippedAt: Date,
    estimatedDelivery: Date,
    deliveredAt: Date
  },
  delivery: {
    agent: {
      type: mongoose.Schema.ObjectId,
      ref: 'DeliveryAgent'
    },
    zone: {
      type: mongoose.Schema.ObjectId,
      ref: 'DeliveryZone'
    },
    status: {
      type: String,
      enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
      default: 'assigned'
    },
    assignedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    failedAt: Date,
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    lastUpdate: Date,
    instructions: String
  },
  notes: String,
  adminNotes: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ 'paymentInfo.status': 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ isDeleted: 1 });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

// Calculate totals before saving
OrderSchema.pre('save', function(next) {
  // Calculate items price
  this.itemsPrice = this.items.reduce((total, item) => total + item.total, 0);
  
  // Calculate total price
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice - this.discountAmount;
  
  next();
});

// Populate user details
OrderSchema.pre(/^find/, function(next) {
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: 'user',
      select: 'firstName lastName email'
    });
  }
  next();
});

// Filter out deleted orders by default
OrderSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Update order status
OrderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.orderStatus = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  // Update specific timestamps
  if (newStatus === 'shipped' && !this.shippingInfo.shippedAt) {
    this.shippingInfo.shippedAt = new Date();
  }
  
  if (newStatus === 'delivered' && !this.shippingInfo.deliveredAt) {
    this.shippingInfo.deliveredAt = new Date();
  }
  
  return this.save();
};

// Update payment status
OrderSchema.methods.updatePaymentStatus = function(status, transactionId = null) {
  this.paymentInfo.status = status;
  
  if (transactionId) {
    this.paymentInfo.transactionId = transactionId;
  }
  
  if (status === 'completed' && !this.paymentInfo.paidAt) {
    this.paymentInfo.paidAt = new Date();
  }
  
  return this.save();
};

// Soft delete
OrderSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Virtual for full name
OrderSchema.virtual('customerName').get(function() {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Virtual for order age
OrderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
OrderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', OrderSchema);