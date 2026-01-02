const Wallet = require('../models/Wallet');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user wallet
// @route   GET /api/wallet
// @access  Private
exports.getWallet = asyncHandler(async (req, res, next) => {
  let wallet = await Wallet.findOne({ user: req.user.id });
  
  if (!wallet) {
    wallet = new Wallet({ user: req.user.id });
    await wallet.save();
  }

  res.status(200).json({
    success: true,
    data: wallet
  });
});

// @desc    Get wallet transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactionHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  
  let wallet = await Wallet.findOne({ user: req.user.id });
  
  if (!wallet) {
    wallet = new Wallet({ user: req.user.id });
    await wallet.save();
  }

  const result = wallet.getTransactionHistory(page, limit);

  res.status(200).json({
    success: true,
    data: result.transactions,
    pagination: result.pagination
  });
});

// @desc    Add credit to wallet (Admin only)
// @route   POST /api/wallet/credit
// @access  Private/Admin
exports.addCredit = asyncHandler(async (req, res, next) => {
  const { userId, amount, description, reference } = req.body;

  if (!userId || !amount || !description || !reference) {
    return next(new ErrorResponse('User ID, amount, description, and reference are required', 400));
  }

  if (amount <= 0) {
    return next(new ErrorResponse('Amount must be greater than 0', 400));
  }

  let wallet = await Wallet.findOne({ user: userId });
  
  if (!wallet) {
    wallet = new Wallet({ user: userId });
    await wallet.save();
  }

  await wallet.addTransaction({
    type: 'credit',
    amount,
    description,
    reference,
    source: 'admin_credit',
    metadata: {
      adminId: req.user.id
    }
  });

  // Log audit
  await AuditLog.logAction({
    user: req.user.id,
    action: 'admin_wallet_credit',
    resource: 'wallet',
    resourceId: wallet._id.toString(),
    details: {
      targetUserId: userId,
      amount,
      description,
      reference,
      newBalance: wallet.balance
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    severity: 'medium'
  });

  res.status(200).json({
    success: true,
    message: 'Credit added successfully',
    data: {
      walletId: wallet._id,
      newBalance: wallet.balance,
      transaction: wallet.transactions[wallet.transactions.length - 1]
    }
  });
});

// @desc    Use wallet balance for payment
// @route   POST /api/wallet/pay
// @access  Private
exports.payWithWallet = asyncHandler(async (req, res, next) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    return next(new ErrorResponse('Order ID and amount are required', 400));
  }

  if (amount <= 0) {
    return next(new ErrorResponse('Amount must be greater than 0', 400));
  }

  let wallet = await Wallet.findOne({ user: req.user.id });
  
  if (!wallet) {
    return next(new ErrorResponse('Wallet not found', 404));
  }

  if (wallet.balance < amount) {
    return next(new ErrorResponse('Insufficient wallet balance', 400));
  }

  // Find and validate order
  const Order = require('../models/Order');
  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to pay for this order', 403));
  }

  if (order.paymentInfo.status === 'completed') {
    return next(new ErrorResponse('Order is already paid', 400));
  }

  try {
    // Deduct from wallet
    await wallet.addTransaction({
      type: 'debit',
      amount,
      description: `Payment for order ${order.orderNumber}`,
      reference: `ORDER-${order.orderNumber}`,
      source: 'order_payment',
      metadata: {
        orderId: order._id
      }
    });

    // Update order payment status
    order.paymentInfo.method = 'wallet';
    order.paymentInfo.status = 'completed';
    order.paymentInfo.paidAt = new Date();
    order.paymentInfo.transactionId = `WALLET-${Date.now()}`;
    order.orderStatus = 'confirmed';
    
    // Add to status history
    order.statusHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: `Payment completed using wallet balance`
    });

    await order.save();

    // Log audit
    await AuditLog.logAction({
      user: req.user.id,
      action: 'payment_success',
      resource: 'payment',
      resourceId: order._id.toString(),
      details: {
        paymentMethod: 'wallet',
        amount,
        orderNumber: order.orderNumber,
        walletBalanceAfter: wallet.balance
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amountPaid: amount,
        walletBalance: wallet.balance,
        paymentMethod: 'wallet'
      }
    });

  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get wallet statistics (Admin)
// @route   GET /api/wallet/admin/stats
// @access  Private/Admin
exports.getWalletStats = asyncHandler(async (req, res, next) => {
  const stats = await Wallet.aggregate([
    {
      $group: {
        _id: null,
        totalWallets: { $sum: 1 },
        totalBalance: { $sum: '$balance' },
        activeWallets: {
          $sum: {
            $cond: [{ $gt: ['$balance', 0] }, 1, 0]
          }
        },
        averageBalance: { $avg: '$balance' }
      }
    }
  ]);

  const transactionStats = await Wallet.aggregate([
    { $unwind: '$transactions' },
    {
      $group: {
        _id: '$transactions.source',
        count: { $sum: 1 },
        totalAmount: { $sum: '$transactions.amount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  const monthlyStats = await Wallet.aggregate([
    { $unwind: '$transactions' },
    {
      $match: {
        'transactions.createdAt': {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    },
    {
      $group: {
        _id: {
          type: '$transactions.type',
          source: '$transactions.source'
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$transactions.amount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalWallets: 0,
        totalBalance: 0,
        activeWallets: 0,
        averageBalance: 0
      },
      transactionsBySource: transactionStats,
      monthlyTransactions: monthlyStats
    }
  });
});

// @desc    Get all wallets (Admin)
// @route   GET /api/wallet/admin/all
// @access  Private/Admin
exports.getAllWallets = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.minBalance) {
    query.balance = { $gte: parseFloat(req.query.minBalance) };
  }
  
  if (req.query.maxBalance) {
    query.balance = { ...query.balance, $lte: parseFloat(req.query.maxBalance) };
  }

  const wallets = await Wallet.find(query)
    .populate('user', 'firstName lastName email phone')
    .sort({ balance: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Wallet.countDocuments(query);

  res.status(200).json({
    success: true,
    data: wallets,
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