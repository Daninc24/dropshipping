const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'order_placed',
      'order_confirmed',
      'order_shipped',
      'order_delivered',
      'order_cancelled',
      'payment_success',
      'payment_failed',
      'product_back_in_stock',
      'price_drop',
      'review_request',
      'coupon_available',
      'account_update',
      'security_alert',
      'system_maintenance',
      'general'
    ]
  },
  title: {
    type: String,
    required: [true, 'Please add notification title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add notification message'],
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actionUrl: {
    type: String,
    trim: true
  },
  actionText: {
    type: String,
    trim: true,
    maxlength: [50, 'Action text cannot be more than 50 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  channels: [{
    type: String,
    enum: ['in_app', 'email', 'sms', 'push']
  }],
  deliveryStatus: {
    in_app: {
      status: {
        type: String,
        enum: ['pending', 'delivered', 'failed'],
        default: 'delivered'
      },
      deliveredAt: Date
    },
    email: {
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      error: String
    },
    sms: {
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      error: String
    },
    push: {
      status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed'],
        default: 'pending'
      },
      sentAt: Date,
      deliveredAt: Date,
      error: String
    }
  },
  expiresAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.index({ isDeleted: 1 });

// Filter out deleted and expired notifications by default
NotificationSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ 
      isDeleted: { $ne: true },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });
  }
  next();
});

// Mark as read
NotificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Mark as unread
NotificationSchema.methods.markAsUnread = function() {
  if (this.isRead) {
    this.isRead = false;
    this.readAt = undefined;
    return this.save();
  }
  return Promise.resolve(this);
};

// Update delivery status
NotificationSchema.methods.updateDeliveryStatus = function(channel, status, error = null) {
  if (this.deliveryStatus[channel]) {
    this.deliveryStatus[channel].status = status;
    
    if (status === 'sent') {
      this.deliveryStatus[channel].sentAt = new Date();
    } else if (status === 'delivered') {
      this.deliveryStatus[channel].deliveredAt = new Date();
    } else if (status === 'failed' && error) {
      this.deliveryStatus[channel].error = error;
    }
    
    return this.save();
  }
  
  throw new Error(`Invalid channel: ${channel}`);
};

// Soft delete
NotificationSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Static method to create notification
NotificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  
  // Set default channels if not provided
  if (!notification.channels || notification.channels.length === 0) {
    notification.channels = ['in_app'];
  }
  
  // Initialize delivery status for selected channels
  notification.channels.forEach(channel => {
    if (channel === 'in_app') {
      notification.deliveryStatus.in_app.status = 'delivered';
      notification.deliveryStatus.in_app.deliveredAt = new Date();
    }
  });
  
  return await notification.save();
};

// Static method to mark all as read for user
NotificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { user: userId, isRead: false },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    user: userId,
    isRead: false,
    isDeleted: { $ne: true }
  });
};

// Virtual for age
NotificationSchema.virtual('age').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
});

// Ensure virtual fields are serialized
NotificationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Notification', NotificationSchema);