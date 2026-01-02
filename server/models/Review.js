const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Review title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  pros: [String],
  cons: [String],
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  reported: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    reasons: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ verified: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ isDeleted: 1 });

// Populate user details
ReviewSchema.pre(/^find/, function(next) {
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: 'user',
      select: 'firstName lastName avatar'
    });
  }
  next();
});

// Filter out deleted reviews by default
ReviewSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Update product rating after review save/update/delete
ReviewSchema.post('save', async function() {
  await this.constructor.calcAverageRating(this.product);
});

ReviewSchema.post('remove', async function() {
  await this.constructor.calcAverageRating(this.product);
});

// Calculate average rating for product
ReviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { 
        product: productId,
        status: 'approved',
        isDeleted: { $ne: true }
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    const Product = mongoose.model('Product');
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        numOfReviews: stats[0].numOfReviews
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        numOfReviews: 0
      });
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// Mark as helpful
ReviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  throw new Error('Already marked as helpful');
};

// Remove helpful mark
ReviewSchema.methods.removeHelpful = function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  throw new Error('Not marked as helpful');
};

// Report review
ReviewSchema.methods.reportReview = function(userId, reason) {
  if (!this.reported.users.includes(userId)) {
    this.reported.users.push(userId);
    this.reported.reasons.push(reason);
    this.reported.count = this.reported.users.length;
    return this.save();
  }
  throw new Error('Already reported');
};

// Add admin response
ReviewSchema.methods.addAdminResponse = function(message, adminId) {
  this.adminResponse = {
    message,
    respondedBy: adminId,
    respondedAt: new Date()
  };
  return this.save();
};

// Soft delete
ReviewSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Virtual for review age
ReviewSchema.virtual('reviewAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
ReviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Review', ReviewSchema);