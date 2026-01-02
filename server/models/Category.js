const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    public_id: String,
    url: String,
    alt: String
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  productCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ status: 1 });
CategorySchema.index({ featured: 1 });
CategorySchema.index({ sortOrder: 1 });
CategorySchema.index({ isDeleted: 1 });

// Create category slug from name
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Set level and path based on parent
CategorySchema.pre('save', async function(next) {
  if (this.isModified('parent') || this.isNew) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.path = parent.path ? `${parent.path}/${parent.slug}` : parent.slug;
      }
    } else {
      this.level = 0;
      this.path = '';
    }
  }
  next();
});

// Virtual for children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for breadcrumb
CategorySchema.virtual('breadcrumb').get(function() {
  if (!this.path) return [{ name: this.name, slug: this.slug }];
  
  const pathArray = this.path.split('/');
  return pathArray.map(slug => ({ slug })).concat([{ name: this.name, slug: this.slug }]);
});

// Filter out deleted categories by default
CategorySchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Populate parent on find
CategorySchema.pre(/^find/, function(next) {
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: 'parent',
      select: 'name slug'
    });
  }
  next();
});

// Update product count when category changes
CategorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ category: this._id, isDeleted: { $ne: true } });
  this.productCount = count;
  return this.save();
};

// Soft delete
CategorySchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Get category tree
CategorySchema.statics.getTree = async function(parentId = null) {
  const categories = await this.find({ 
    parent: parentId,
    status: 'active',
    isDeleted: { $ne: true }
  }).sort({ sortOrder: 1, name: 1 });

  for (let category of categories) {
    category.children = await this.getTree(category._id);
  }

  return categories;
};

module.exports = mongoose.model('Category', CategorySchema);