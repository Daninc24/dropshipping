const mongoose = require('mongoose');

const DeliveryAgentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  agentId: {
    type: String,
    unique: true,
    required: true
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+254|0)[17]\d{8}$/, 'Please provide a valid Kenyan phone number']
  },
  alternativePhone: {
    type: String,
    match: [/^(\+254|0)[17]\d{8}$/, 'Please provide a valid Kenyan phone number']
  },
  address: {
    street: String,
    area: String,
    city: String,
    county: String,
    postalCode: String
  },
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      match: [/^(\+254|0)[17]\d{8}$/, 'Please provide a valid Kenyan phone number']
    },
    relationship: String
  },
  vehicle: {
    type: {
      type: String,
      enum: ['motorcycle', 'bicycle', 'car', 'van', 'truck', 'on_foot'],
      required: true
    },
    registrationNumber: String,
    model: String,
    year: Number,
    insuranceExpiry: Date,
    licenseExpiry: Date
  },
  zones: [{
    type: mongoose.Schema.ObjectId,
    ref: 'DeliveryZone'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_approval'],
    default: 'pending_approval'
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    workingHours: {
      start: {
        type: String,
        default: '08:00'
      },
      end: {
        type: String,
        default: '18:00'
      }
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    lastSeen: Date
  },
  performance: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    successfulDeliveries: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot be more than 5']
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    onTimeDeliveries: {
      type: Number,
      default: 0
    },
    averageDeliveryTime: Number, // in minutes
    earnings: {
      total: {
        type: Number,
        default: 0
      },
      thisMonth: {
        type: Number,
        default: 0
      },
      lastPayout: Date
    }
  },
  documents: {
    nationalIdCopy: {
      public_id: String,
      url: String
    },
    drivingLicense: {
      public_id: String,
      url: String
    },
    vehicleInsurance: {
      public_id: String,
      url: String
    },
    profilePhoto: {
      public_id: String,
      url: String
    }
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    branchCode: String
  },
  mpesaNumber: {
    type: String,
    match: [/^(\+254|0)[17]\d{8}$/, 'Please provide a valid Kenyan phone number']
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
DeliveryAgentSchema.index({ agentId: 1 });
DeliveryAgentSchema.index({ nationalId: 1 });
DeliveryAgentSchema.index({ phone: 1 });
DeliveryAgentSchema.index({ status: 1 });
DeliveryAgentSchema.index({ 'availability.isAvailable': 1 });
DeliveryAgentSchema.index({ zones: 1 });
DeliveryAgentSchema.index({ isDeleted: 1 });

// Generate agent ID before saving
DeliveryAgentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.agentId = `DA${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

// Populate user details
DeliveryAgentSchema.pre(/^find/, function(next) {
  if (!this.getOptions().skipPopulate) {
    this.populate({
      path: 'user',
      select: 'firstName lastName email avatar'
    }).populate({
      path: 'zones',
      select: 'name code county'
    });
  }
  next();
});

// Filter out deleted agents by default
DeliveryAgentSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Update availability status
DeliveryAgentSchema.methods.updateAvailability = function(isAvailable) {
  this.availability.isAvailable = isAvailable;
  this.availability.lastSeen = new Date();
  return this.save();
};

// Update performance metrics
DeliveryAgentSchema.methods.updatePerformance = function(deliveryData) {
  const { isSuccessful, isOnTime, rating, deliveryTime } = deliveryData;
  
  this.performance.totalDeliveries += 1;
  
  if (isSuccessful) {
    this.performance.successfulDeliveries += 1;
  }
  
  if (isOnTime) {
    this.performance.onTimeDeliveries += 1;
  }
  
  if (rating) {
    const totalRatingPoints = this.performance.averageRating * this.performance.totalRatings;
    this.performance.totalRatings += 1;
    this.performance.averageRating = (totalRatingPoints + rating) / this.performance.totalRatings;
  }
  
  if (deliveryTime) {
    const totalTime = this.performance.averageDeliveryTime * (this.performance.totalDeliveries - 1);
    this.performance.averageDeliveryTime = (totalTime + deliveryTime) / this.performance.totalDeliveries;
  }
  
  return this.save();
};

// Virtual for success rate
DeliveryAgentSchema.virtual('successRate').get(function() {
  if (this.performance.totalDeliveries === 0) return 0;
  return Math.round((this.performance.successfulDeliveries / this.performance.totalDeliveries) * 100);
});

// Virtual for on-time rate
DeliveryAgentSchema.virtual('onTimeRate').get(function() {
  if (this.performance.totalDeliveries === 0) return 0;
  return Math.round((this.performance.onTimeDeliveries / this.performance.totalDeliveries) * 100);
});

// Virtual for full name
DeliveryAgentSchema.virtual('fullName').get(function() {
  if (this.user) {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  return '';
});

// Soft delete
DeliveryAgentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Ensure virtual fields are serialized
DeliveryAgentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DeliveryAgent', DeliveryAgentSchema);