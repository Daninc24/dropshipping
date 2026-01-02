const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: String, // e.g., "Size", "Color"
    options: [String] // e.g., ["S", "M", "L"] or ["Red", "Blue"]
  }],
  specifications: [{
    name: String,
    value: String
  }],
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating must can not be more than 5'],
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ totalSales: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isDeleted: 1 });

// Create product slug from name
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for stock status
ProductSchema.virtual('stockStatus').get(function() {
  if (!this.trackQuantity) return 'in-stock';
  if (this.quantity === 0) return 'out-of-stock';
  if (this.quantity <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Virtual for main image
ProductSchema.virtual('mainImage').get(function() {
  if (!this.images || !Array.isArray(this.images)) return null;
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || this.images[0] || null;
});

// Populate category on find
ProductSchema.pre(/^find/, function(next) {
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: 'category',
      select: 'name slug'
    });
  }
  next();
});

// Filter out deleted products by default
ProductSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Soft delete
ProductSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Product', ProductSchema);