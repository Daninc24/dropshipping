const express = require('express');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Protected routes
router.use(protect);

// @desc    Get user's audit logs
// @route   GET /api/audit/my
// @access  Private
router.get('/my', asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const action = req.query.action;
  const resource = req.query.resource;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const result = await AuditLog.getUserActivity(req.user.id, {
    page,
    limit,
    action,
    resource,
    startDate,
    endDate
  });

  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: result.pagination
  });
}));

// Admin routes
router.use(authorize('admin'));

// @desc    Get all audit logs
// @route   GET /api/audit/admin/logs
// @access  Private/Admin
router.get('/admin/logs', asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.user) {
    query.user = req.query.user;
  }
  
  if (req.query.action) {
    query.action = req.query.action;
  }
  
  if (req.query.resource) {
    query.resource = req.query.resource;
  }
  
  if (req.query.severity) {
    query.severity = req.query.severity;
  }
  
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const logs = await AuditLog.find(query)
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await AuditLog.countDocuments(query);

  res.status(200).json({
    success: true,
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: startIndex + limit < total,
      hasPrev: page > 1
    }
  });
}));

// @desc    Get security events
// @route   GET /api/audit/admin/security
// @access  Private/Admin
router.get('/admin/security', asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const severity = req.query.severity;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const result = await AuditLog.getSecurityEvents({
    page,
    limit,
    severity,
    startDate,
    endDate
  });

  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: result.pagination
  });
}));

// @desc    Get audit statistics
// @route   GET /api/audit/admin/stats
// @access  Private/Admin
router.get('/admin/stats', asyncHandler(async (req, res, next) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalLogs,
    todayLogs,
    weekLogs,
    monthLogs,
    actionStats,
    severityStats,
    userStats
  ] = await Promise.all([
    AuditLog.countDocuments(),
    AuditLog.countDocuments({ createdAt: { $gte: startOfDay } }),
    AuditLog.countDocuments({ createdAt: { $gte: startOfWeek } }),
    AuditLog.countDocuments({ createdAt: { $gte: startOfMonth } }),
    
    // Action statistics
    AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    
    // Severity statistics
    AuditLog.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]),
    
    // Top users by activity
    AuditLog.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          count: 1,
          user: { $arrayElemAt: ['$user', 0] }
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalLogs,
        todayLogs,
        weekLogs,
        monthLogs
      },
      topActions: actionStats,
      severityBreakdown: severityStats,
      topUsers: userStats
    }
  });
}));

module.exports = router;