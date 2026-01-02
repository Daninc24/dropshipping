const mongoose = require('mongoose');

const DeliveryZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a zone name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add a zone code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: String,
  county: {
    type: String,
    required: [true, 'Please specify the county']
  },
  areas: [{
    name: String,
    postalCodes: [String]
  }],
  deliveryFee: {
    type: Number,
    required: [true, 'Please add delivery fee'],
    min: [0, 'Delivery fee cannot be negative']
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 0,
    min: [0, 'Free delivery threshold cannot be negative']
  },
  estimatedDeliveryDays: {
    min: {
      type: Number,
      required: true,
      min: [1, 'Minimum delivery days must be at least 1']
    },
    max: {
      type: Number,
      required: true,
      min: [1, 'Maximum delivery days must be at least 1']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: [1, 'Priority must be at least 1']
  },
  restrictions: {
    maxWeight: Number, // in kg
    maxDimensions: {
      length: Number, // in cm
      width: Number,
      height: Number
    },
    prohibitedItems: [String]
  }
}, {
  timestamps: true
});

// Create indexes
DeliveryZoneSchema.index({ code: 1 });
DeliveryZoneSchema.index({ county: 1 });
DeliveryZoneSchema.index({ isActive: 1 });
DeliveryZoneSchema.index({ priority: 1 });

// Static method to find zone by postal code
DeliveryZoneSchema.statics.findByPostalCode = function(postalCode) {
  return this.findOne({
    'areas.postalCodes': postalCode,
    isActive: true
  });
};

// Static method to calculate delivery fee
DeliveryZoneSchema.statics.calculateDeliveryFee = function(zoneCode, orderTotal) {
  return this.findOne({ code: zoneCode, isActive: true })
    .then(zone => {
      if (!zone) {
        throw new Error('Delivery zone not found');
      }
      
      if (orderTotal >= zone.freeDeliveryThreshold) {
        return 0;
      }
      
      return zone.deliveryFee;
    });
};

// Virtual for delivery time range
DeliveryZoneSchema.virtual('deliveryTimeRange').get(function() {
  if (this.estimatedDeliveryDays.min === this.estimatedDeliveryDays.max) {
    return `${this.estimatedDeliveryDays.min} day${this.estimatedDeliveryDays.min > 1 ? 's' : ''}`;
  }
  return `${this.estimatedDeliveryDays.min}-${this.estimatedDeliveryDays.max} days`;
});

// Ensure virtual fields are serialized
DeliveryZoneSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DeliveryZone', DeliveryZoneSchema);