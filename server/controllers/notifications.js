const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let query = { user: req.user.id };

  // Filter by read status
  if (req.query.unread === 'true') {
    query.isRead = false;
  }

  // Filter by type
  if (req.query.type) {
    query.type = req.query.type;
  }

  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/read/:id
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Make sure user owns notification
  if (notification.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this notification'
    });
  }

  await notification.markAsRead();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user.id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Make sure user owns notification
  if (notification.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this notification'
    });
  }

  await notification.softDelete();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully'
  });
});