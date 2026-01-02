const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add address'],
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  apartment: {
    type: String,
    trim: true,
    maxlength: [50, 'Apartment cannot be more than 50 characters']
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
    trim: true,
    maxlength: [50, 'City cannot be more than 50 characters']
  },
  state: {
    type: String,
    required: [true, 'Please add county'],
    trim: true,
    maxlength: [50, 'County cannot be more than 50 characters']
  },
  county: {
    type: String,
    required: [true, 'Please add county'],
    trim: true,
    enum: [
      'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
      'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
      'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
      'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
      'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
      'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
      'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
      'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ]
  },
  area: {
    type: String,
    trim: true,
    maxlength: [100, 'Area cannot be more than 100 characters']
  },
  landmark: {
    type: String,
    trim: true,
    maxlength: [200, 'Landmark cannot be more than 200 characters']
  },
  zipCode: {
    type: String,
    required: [true, 'Please add zip code'],
    trim: true,
    maxlength: [20, 'Zip code cannot be more than 20 characters']
  },
  country: {
    type: String,
    required: [true, 'Please add country'],
    trim: true,
    default: 'Kenya',
    maxlength: [50, 'Country cannot be more than 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    trim: true,
    match: [/^(\+254|0)[17]\d{8}$/, 'Please add a valid Kenyan phone number']
  },
  alternativePhone: {
    type: String,
    trim: true,
    match: [/^(\+254|0)[17]\d{8}$/, 'Please add a valid Kenyan phone number']
  },
  deliveryInstructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Delivery instructions cannot be more than 500 characters']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
AddressSchema.index({ user: 1 });
AddressSchema.index({ isDefault: 1 });
AddressSchema.index({ isDeleted: 1 });

// Ensure only one default address per user
AddressSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default from other addresses for this user
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Filter out deleted addresses by default
AddressSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Virtual for full name
AddressSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted address
AddressSchema.virtual('formattedAddress').get(function() {
  let formatted = this.address;
  
  if (this.apartment) {
    formatted += `, ${this.apartment}`;
  }
  
  formatted += `, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  
  return formatted;
});

// Soft delete
AddressSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Set as default
AddressSchema.methods.setAsDefault = function() {
  this.isDefault = true;
  return this.save();
};

// Ensure virtual fields are serialized
AddressSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Address', AddressSchema);