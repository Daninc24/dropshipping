const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: [true, 'Please specify the action'],
    enum: [
      // User actions
      'user_login', 'user_logout', 'user_register', 'user_update_profile',
      'user_change_password', 'user_delete_account',
      
      // Product actions
      'product_create', 'product_update', 'product_delete', 'product_view',
      'product_search', 'product_review',
      
      // Order actions
      'order_create', 'order_update', 'order_cancel', 'order_refund',
      'order_status_change', 'order_payment_update',
      
      // Cart actions
      'cart_add_item', 'cart_remove_item', 'cart_update_quantity',
      'cart_apply_coupon', 'cart_clear',
      
      // Admin actions
      'admin_user_create', 'admin_user_update', 'admin_user_delete',
      'admin_product_create', 'admin_product_update', 'admin_product_delete',
      'admin_category_create', 'admin_category_update', 'admin_category_delete',
      'admin_coupon_create', 'admin_coupon_update', 'admin_coupon_delete',
      'admin_order_update', 'admin_settings_update',
      
      // Payment actions
      'payment_initiate', 'payment_success', 'payment_failed',
      'payment_refund', 'mpesa_callback',
      
      // Delivery actions
      'delivery_assign', 'delivery_pickup', 'delivery_complete',
      'delivery_failed', 'delivery_agent_create',
      
      // Security actions
      'login_failed', 'password_reset_request', 'password_reset_success',
      'account_locked', 'suspicious_activity',
      
      // System actions
      'system_backup', 'system_maintenance', 'data_export', 'data_import'
    ]
  },
  resource: {
    type: String,
    required: [true, 'Please specify the resource'],
    enum: ['user', 'product', 'order', 'cart', 'payment', 'delivery', 'category', 'coupon', 'review', 'system']
  },
  resourceId: {
    type: String,
    required: function() {
      return this.resource !== 'system';
    }
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  sessionId: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: String,
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Create indexes
AuditLogSchema.index({ user: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ resource: 1 });
AuditLogSchema.index({ resourceId: 1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ severity: 1 });
AuditLogSchema.index({ status: 1 });
AuditLogSchema.index({ ipAddress: 1 });
AuditLogSchema.index({ tags: 1 });

// Compound indexes for common queries
AuditLogSchema.index({ user: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

// Static method to log action
AuditLogSchema.statics.logAction = function(logData) {
  const {
    user,
    action,
    resource,
    resourceId,
    details = {},
    changes = {},
    ipAddress,
    userAgent,
    location = {},
    sessionId,
    severity = 'low',
    status = 'success',
    errorMessage,
    tags = [],
    metadata = {}
  } = logData;

  return this.create({
    user,
    action,
    resource,
    resourceId,
    details,
    changes,
    ipAddress,
    userAgent,
    location,
    sessionId,
    severity,
    status,
    errorMessage,
    tags,
    metadata
  });
};

// Static method to get user activity
AuditLogSchema.statics.getUserActivity = function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    action,
    resource,
    startDate,
    endDate
  } = options;

  const query = { user: userId };
  
  if (action) query.action = action;
  if (resource) query.resource = resource;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  return Promise.all([
    this.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]).then(([logs, total]) => ({
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1
    }
  }));
};

// Static method to get security events
AuditLogSchema.statics.getSecurityEvents = function(options = {}) {
  const {
    page = 1,
    limit = 20,
    severity,
    startDate,
    endDate
  } = options;

  const securityActions = [
    'login_failed', 'password_reset_request', 'account_locked',
    'suspicious_activity', 'admin_user_delete', 'admin_settings_update'
  ];

  const query = { action: { $in: securityActions } };
  
  if (severity) query.severity = severity;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  return Promise.all([
    this.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]).then(([logs, total]) => ({
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1
    }
  }));
};

// Virtual for formatted timestamp
AuditLogSchema.virtual('formattedTimestamp').get(function() {
  return this.createdAt.toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Ensure virtual fields are serialized
AuditLogSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);