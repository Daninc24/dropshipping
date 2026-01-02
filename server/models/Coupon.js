const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [20, 'Coupon code cannot be more than 20 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  discountType: {
    type: String,
    required: [true, 'Please specify discount type'],
    enum: ['percentage', 'fixed']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please add discount value'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum amount cannot be negative']
  },
  maximumDiscount: {
    type: Number,
    min: [0, 'Maximum discount cannot be negative']
  },
  usageLimit: {
    type: Number,
    min: [1, 'Usage limit must be at least 1']
  },
  usageCount: {
    type: Number,
    default: 0
  },
  userLimit: {
    type: Number,
    default: 1,
    min: [1, 'User limit must be at least 1']
  },
  applicableProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  excludedCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  applicableUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  excludedUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: [true, 'Please add start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderAmount: Number,
    discountAmount: Number
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1 });
CouponSchema.index({ startDate: 1, endDate: 1 });
CouponSchema.index({ isDeleted: 1 });

// Validate end date is after start date
CouponSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  
  // Validate maximum discount for percentage coupons
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    next(new Error('Percentage discount cannot be more than 100%'));
  }
  
  next();
});

// Filter out deleted coupons by default
CouponSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Check if coupon is valid
CouponSchema.methods.isValid = function(userId = null, cartAmount = 0) {
  const now = new Date();
  
  // Check if coupon is active
  if (!this.isActive) {
    return { valid: false, message: 'Coupon is not active' };
  }
  
  // Check date range
  if (now < this.startDate) {
    return { valid: false, message: 'Coupon is not yet active' };
  }
  
  if (now > this.endDate) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  // Check usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  // Check minimum amount
  if (cartAmount < this.minimumAmount) {
    return { 
      valid: false, 
      message: `Minimum order amount of $${this.minimumAmount} required` 
    };
  }
  
  // Check user-specific restrictions
  if (userId) {
    // Check if user is excluded
    if (this.excludedUsers.includes(userId)) {
      return { valid: false, message: 'Coupon not applicable for this user' };
    }
    
    // Check if coupon is restricted to specific users
    if (this.applicableUsers.length > 0 && !this.applicableUsers.includes(userId)) {
      return { valid: false, message: 'Coupon not applicable for this user' };
    }
    
    // Check user usage limit
    const userUsage = this.usedBy.filter(usage => usage.user.toString() === userId.toString());
    if (userUsage.length >= this.userLimit) {
      return { valid: false, message: 'User usage limit reached for this coupon' };
    }
  }
  
  return { valid: true, message: 'Coupon is valid' };
};

// Calculate discount amount
CouponSchema.methods.calculateDiscount = function(amount) {
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    
    // Apply maximum discount limit if set
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else {
    discount = this.discountValue;
  }
  
  // Ensure discount doesn't exceed the amount
  return Math.min(discount, amount);
};

// Use coupon
CouponSchema.methods.useCoupon = function(userId, orderAmount, discountAmount) {
  this.usageCount += 1;
  this.usedBy.push({
    user: userId,
    usedAt: new Date(),
    orderAmount,
    discountAmount
  });
  
  return this.save();
};

// Check if coupon applies to products
CouponSchema.methods.appliesTo = function(products) {
  // If no specific products/categories are set, applies to all
  if (this.applicableProducts.length === 0 && this.applicableCategories.length === 0) {
    return true;
  }
  
  // Check if any product is in applicable products
  if (this.applicableProducts.length > 0) {
    const hasApplicableProduct = products.some(product => 
      this.applicableProducts.includes(product._id)
    );
    if (hasApplicableProduct) return true;
  }
  
  // Check if any product is in applicable categories
  if (this.applicableCategories.length > 0) {
    const hasApplicableCategory = products.some(product => 
      this.applicableCategories.includes(product.category)
    );
    if (hasApplicableCategory) return true;
  }
  
  return false;
};

// Soft delete
CouponSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Virtual for usage percentage
CouponSchema.virtual('usagePercentage').get(function() {
  if (!this.usageLimit) return 0;
  return Math.round((this.usageCount / this.usageLimit) * 100);
});

// Virtual for status
CouponSchema.virtual('status').get(function() {
  const now = new Date();
  
  if (!this.isActive) return 'inactive';
  if (now < this.startDate) return 'scheduled';
  if (now > this.endDate) return 'expired';
  if (this.usageLimit && this.usageCount >= this.usageLimit) return 'exhausted';
  
  return 'active';
});

// Ensure virtual fields are serialized
CouponSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Coupon', CouponSchema);