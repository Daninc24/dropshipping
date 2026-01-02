const DeliveryAgent = require('../models/DeliveryAgent');
const DeliveryZone = require('../models/DeliveryZone');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all delivery zones
// @route   GET /api/delivery/zones
// @access  Public
exports.getDeliveryZones = asyncHandler(async (req, res, next) => {
  const zones = await DeliveryZone.find({ isActive: true })
    .sort({ priority: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: zones
  });
});

// @desc    Calculate delivery fee
// @route   POST /api/delivery/calculate-fee
// @access  Public
exports.calculateDeliveryFee = asyncHandler(async (req, res, next) => {
  const { zoneCode, orderTotal, postalCode } = req.body;

  let zone;

  if (zoneCode) {
    zone = await DeliveryZone.findOne({ code: zoneCode, isActive: true });
  } else if (postalCode) {
    zone = await DeliveryZone.findByPostalCode(postalCode);
  }

  if (!zone) {
    return next(new ErrorResponse('Delivery zone not found', 404));
  }

  const deliveryFee = orderTotal >= zone.freeDeliveryThreshold ? 0 : zone.deliveryFee;

  res.status(200).json({
    success: true,
    data: {
      zone: {
        name: zone.name,
        code: zone.code,
        county: zone.county
      },
      deliveryFee,
      freeDeliveryThreshold: zone.freeDeliveryThreshold,
      estimatedDeliveryDays: zone.estimatedDeliveryDays,
      deliveryTimeRange: zone.deliveryTimeRange
    }
  });
});

// @desc    Apply to become delivery agent
// @route   POST /api/delivery/agents/apply
// @access  Private
exports.applyAsDeliveryAgent = asyncHandler(async (req, res, next) => {
  const {
    nationalId,
    phone,
    alternativePhone,
    address,
    emergencyContact,
    vehicle,
    zones,
    bankDetails,
    mpesaNumber
  } = req.body;

  // Check if user already has an application
  const existingAgent = await DeliveryAgent.findOne({ user: req.user.id });
  if (existingAgent) {
    return next(new ErrorResponse('You already have a delivery agent application', 400));
  }

  // Check if national ID is already used
  const existingNationalId = await DeliveryAgent.findOne({ nationalId });
  if (existingNationalId) {
    return next(new ErrorResponse('National ID is already registered', 400));
  }

  // Validate zones
  if (zones && zones.length > 0) {
    const validZones = await DeliveryZone.find({ _id: { $in: zones }, isActive: true });
    if (validZones.length !== zones.length) {
      return next(new ErrorResponse('One or more selected zones are invalid', 400));
    }
  }

  const deliveryAgent = await DeliveryAgent.create({
    user: req.user.id,
    nationalId,
    phone,
    alternativePhone,
    address,
    emergencyContact,
    vehicle,
    zones: zones || [],
    bankDetails,
    mpesaNumber,
    status: 'pending_approval'
  });

  // Log audit
  await AuditLog.logAction({
    user: req.user.id,
    action: 'delivery_agent_create',
    resource: 'delivery',
    resourceId: deliveryAgent._id.toString(),
    details: {
      agentId: deliveryAgent.agentId,
      nationalId,
      phone,
      vehicle: vehicle.type,
      zones: zones || []
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(201).json({
    success: true,
    message: 'Delivery agent application submitted successfully',
    data: deliveryAgent
  });
});

// @desc    Get delivery agent profile
// @route   GET /api/delivery/agents/profile
// @access  Private (Delivery Agent)
exports.getAgentProfile = asyncHandler(async (req, res, next) => {
  const agent = await DeliveryAgent.findOne({ user: req.user.id });
  
  if (!agent) {
    return next(new ErrorResponse('Delivery agent profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Update delivery agent availability
// @route   PUT /api/delivery/agents/availability
// @access  Private (Delivery Agent)
exports.updateAgentAvailability = asyncHandler(async (req, res, next) => {
  const { isAvailable } = req.body;

  const agent = await DeliveryAgent.findOne({ user: req.user.id });
  
  if (!agent) {
    return next(new ErrorResponse('Delivery agent profile not found', 404));
  }

  if (agent.status !== 'active') {
    return next(new ErrorResponse('Agent account is not active', 400));
  }

  await agent.updateAvailability(isAvailable);

  res.status(200).json({
    success: true,
    message: `Availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
    data: {
      isAvailable: agent.availability.isAvailable,
      lastSeen: agent.availability.lastSeen
    }
  });
});

// @desc    Get agent deliveries
// @route   GET /api/delivery/agents/deliveries
// @access  Private (Delivery Agent)
exports.getAgentDeliveries = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const agent = await DeliveryAgent.findOne({ user: req.user.id });
  
  if (!agent) {
    return next(new ErrorResponse('Delivery agent profile not found', 404));
  }

  // Build query
  const query = { 'delivery.agent': agent._id };
  
  if (req.query.status) {
    query.orderStatus = req.query.status;
  }

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName phone')
    .select('orderNumber items shippingAddress totalPrice orderStatus delivery createdAt')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: startIndex + limit < total,
      hasPrev: page > 1
    }
  });
});

// @desc    Update delivery status
// @route   PUT /api/delivery/orders/:orderId/status
// @access  Private (Delivery Agent)
exports.updateDeliveryStatus = asyncHandler(async (req, res, next) => {
  const { status, note, location } = req.body;

  const agent = await DeliveryAgent.findOne({ user: req.user.id });
  
  if (!agent) {
    return next(new ErrorResponse('Delivery agent profile not found', 404));
  }

  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check if agent is assigned to this order
  if (!order.delivery || order.delivery.agent.toString() !== agent._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this delivery', 403));
  }

  const validStatuses = ['picked_up', 'in_transit', 'delivered', 'failed'];
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid delivery status', 400));
  }

  // Update order status
  const statusMap = {
    'picked_up': 'shipped',
    'in_transit': 'shipped',
    'delivered': 'delivered',
    'failed': 'delivery_failed'
  };

  await order.updateStatus(statusMap[status], note, req.user.id);

  // Update delivery info
  if (!order.delivery) {
    order.delivery = {};
  }

  order.delivery.status = status;
  order.delivery.lastUpdate = new Date();
  
  if (location) {
    order.delivery.currentLocation = location;
  }

  if (status === 'delivered') {
    order.delivery.deliveredAt = new Date();
    
    // Update agent performance
    const deliveryTime = Math.round((new Date() - order.delivery.pickedUpAt) / (1000 * 60)); // in minutes
    await agent.updatePerformance({
      isSuccessful: true,
      isOnTime: deliveryTime <= (agent.zones[0]?.estimatedDeliveryDays?.max || 2) * 24 * 60,
      deliveryTime
    });
  } else if (status === 'failed') {
    await agent.updatePerformance({
      isSuccessful: false,
      isOnTime: false
    });
  }

  await order.save();

  // Log audit
  await AuditLog.logAction({
    user: req.user.id,
    action: 'delivery_status_update',
    resource: 'delivery',
    resourceId: order._id.toString(),
    details: {
      agentId: agent.agentId,
      orderNumber: order.orderNumber,
      oldStatus: order.orderStatus,
      newStatus: statusMap[status],
      deliveryStatus: status,
      note,
      location
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(200).json({
    success: true,
    message: 'Delivery status updated successfully',
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      deliveryStatus: status,
      lastUpdate: order.delivery.lastUpdate
    }
  });
});

// @desc    Get all delivery agents (Admin)
// @route   GET /api/delivery/admin/agents
// @access  Private/Admin
exports.getAllAgents = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  if (req.query.zone) {
    query.zones = req.query.zone;
  }
  
  if (req.query.available !== undefined) {
    query['availability.isAvailable'] = req.query.available === 'true';
  }

  const agents = await DeliveryAgent.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await DeliveryAgent.countDocuments(query);

  res.status(200).json({
    success: true,
    data: agents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: startIndex + limit < total,
      hasPrev: page > 1
    }
  });
});

// @desc    Approve/Reject delivery agent (Admin)
// @route   PUT /api/delivery/admin/agents/:id/status
// @access  Private/Admin
exports.updateAgentStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason } = req.body;

  const validStatuses = ['active', 'inactive', 'suspended', 'rejected'];
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const agent = await DeliveryAgent.findById(req.params.id);
  
  if (!agent) {
    return next(new ErrorResponse('Delivery agent not found', 404));
  }

  agent.status = status;
  
  if (status === 'active') {
    agent.approvedBy = req.user.id;
    agent.approvedAt = new Date();
  } else if (status === 'rejected') {
    agent.rejectionReason = rejectionReason;
  }

  await agent.save();

  // Log audit
  await AuditLog.logAction({
    user: req.user.id,
    action: 'admin_agent_status_update',
    resource: 'delivery',
    resourceId: agent._id.toString(),
    details: {
      agentId: agent.agentId,
      oldStatus: agent.status,
      newStatus: status,
      rejectionReason
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    severity: 'medium'
  });

  res.status(200).json({
    success: true,
    message: `Agent status updated to ${status}`,
    data: agent
  });
});

// @desc    Assign delivery agent to order (Admin)
// @route   POST /api/delivery/admin/assign
// @access  Private/Admin
exports.assignDeliveryAgent = asyncHandler(async (req, res, next) => {
  const { orderId, agentId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const agent = await DeliveryAgent.findById(agentId);
  if (!agent) {
    return next(new ErrorResponse('Delivery agent not found', 404));
  }

  if (agent.status !== 'active') {
    return next(new ErrorResponse('Agent is not active', 400));
  }

  if (!agent.availability.isAvailable) {
    return next(new ErrorResponse('Agent is not available', 400));
  }

  // Update order with delivery assignment
  order.delivery = {
    agent: agent._id,
    assignedAt: new Date(),
    status: 'assigned'
  };

  await order.updateStatus('processing', `Assigned to delivery agent ${agent.agentId}`, req.user.id);

  // Log audit
  await AuditLog.logAction({
    user: req.user.id,
    action: 'delivery_assign',
    resource: 'delivery',
    resourceId: order._id.toString(),
    details: {
      orderNumber: order.orderNumber,
      agentId: agent.agentId,
      agentName: agent.fullName
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(200).json({
    success: true,
    message: 'Delivery agent assigned successfully',
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      agent: {
        id: agent._id,
        agentId: agent.agentId,
        name: agent.fullName,
        phone: agent.phone
      }
    }
  });
});

// @desc    Create delivery zone (Admin)
// @route   POST /api/delivery/admin/zones
// @access  Private/Admin
exports.createDeliveryZone = asyncHandler(async (req, res, next) => {
  const zone = await DeliveryZone.create(req.body);

  // Log audit
  await AuditLog.logAction({
    user: req.user.id,
    action: 'admin_zone_create',
    resource: 'delivery',
    resourceId: zone._id.toString(),
    details: {
      zoneName: zone.name,
      zoneCode: zone.code,
      county: zone.county,
      deliveryFee: zone.deliveryFee
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(201).json({
    success: true,
    message: 'Delivery zone created successfully',
    data: zone
  });
});

// @desc    Update delivery zone (Admin)
// @route   PUT /api/delivery/admin/zones/:id
// @access  Private/Admin
exports.updateDeliveryZone = asyncHandler(async (req, res, next) => {
  const zone = await DeliveryZone.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!zone) {
    return next(new ErrorResponse('Delivery zone not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Delivery zone updated successfully',
    data: zone
  });
});