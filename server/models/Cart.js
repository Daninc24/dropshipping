const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  selectedVariants: [{
    name: String,
    value: String
  }]
}, {
  _id: false
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
CartSchema.index({ user: 1 });
CartSchema.index({ lastModified: 1 });

// Update cart totals before saving
CartSchema.pre('save', function(next) {
  // Calculate total items and price
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Apply coupon discount
  if (this.appliedCoupon) {
    if (this.appliedCoupon.discountType === 'percentage') {
      this.discountAmount = (this.totalPrice * this.appliedCoupon.discount) / 100;
    } else {
      this.discountAmount = this.appliedCoupon.discount;
    }
  } else {
    this.discountAmount = 0;
  }
  
  // Calculate final price
  this.finalPrice = Math.max(0, this.totalPrice - this.discountAmount);
  
  // Update last modified
  this.lastModified = new Date();
  
  next();
});

// Populate product details
CartSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.product',
    select: 'name slug price images status quantity trackQuantity'
  });
  next();
});

// Add item to cart
CartSchema.methods.addItem = function(productId, quantity, price, selectedVariants = []) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
      selectedVariants
    });
  }

  return this.save();
};

// Remove item from cart
CartSchema.methods.removeItem = function(productId, selectedVariants = []) {
  this.items = this.items.filter(item => 
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants))
  );

  return this.save();
};

// Update item quantity
CartSchema.methods.updateItemQuantity = function(productId, quantity, selectedVariants = []) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
  );

  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId, selectedVariants);
    } else {
      item.quantity = quantity;
      return this.save();
    }
  }

  throw new Error('Item not found in cart');
};

// Clear cart
CartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupon = undefined;
  return this.save();
};

// Apply coupon
CartSchema.methods.applyCoupon = function(couponCode, discount, discountType) {
  this.appliedCoupon = {
    code: couponCode,
    discount,
    discountType
  };
  return this.save();
};

// Remove coupon
CartSchema.methods.removeCoupon = function() {
  this.appliedCoupon = undefined;
  return this.save();
};

module.exports = mongoose.model('Cart', CartSchema);