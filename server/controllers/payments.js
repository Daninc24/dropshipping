const axios = require('axios');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// M-Pesa Configuration
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox' // sandbox or production
};

// Get M-Pesa access token
const getMpesaAccessToken = async () => {
  const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
  
  const baseUrl = MPESA_CONFIG.environment === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';
  
  try {
    const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa token error:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Generate M-Pesa password
const generateMpesaPassword = () => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.passkey}${timestamp}`).toString('base64');
  return { password, timestamp };
};

// @desc    Initiate M-Pesa STK Push
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
exports.initiateMpesaPayment = asyncHandler(async (req, res, next) => {
  const { orderId, phoneNumber, amount } = req.body;

  // Validate input
  if (!orderId || !phoneNumber || !amount) {
    return next(new ErrorResponse('Order ID, phone number, and amount are required', 400));
  }

  // Validate Kenyan phone number
  const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return next(new ErrorResponse('Please provide a valid Kenyan phone number', 400));
  }

  // Format phone number
  let formattedPhone = phoneNumber.replace(/^\+/, '').replace(/^0/, '254');
  if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }

  // Get order
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to pay for this order', 403));
  }

  // Check if order is already paid
  if (order.paymentInfo.status === 'completed') {
    return next(new ErrorResponse('Order is already paid', 400));
  }

  try {
    const accessToken = await getMpesaAccessToken();
    const { password, timestamp } = generateMpesaPassword();
    
    const baseUrl = MPESA_CONFIG.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    const stkPushData = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${MPESA_CONFIG.callbackUrl}/api/payments/mpesa/callback`,
      AccountReference: order.orderNumber,
      TransactionDesc: `Payment for order ${order.orderNumber}`
    };

    const response = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update order with checkout request ID
    order.paymentInfo.transactionId = response.data.CheckoutRequestID;
    order.paymentInfo.status = 'pending';
    await order.save();

    // Log audit
    await AuditLog.logAction({
      user: req.user.id,
      action: 'payment_initiate',
      resource: 'payment',
      resourceId: order._id.toString(),
      details: {
        paymentMethod: 'mpesa',
        amount,
        phoneNumber: formattedPhone,
        checkoutRequestId: response.data.CheckoutRequestID
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: 'STK push sent successfully. Please check your phone.',
      data: {
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription
      }
    });

  } catch (error) {
    console.error('M-Pesa STK Push error:', error.response?.data || error.message);
    
    // Log failed payment attempt
    await AuditLog.logAction({
      user: req.user.id,
      action: 'payment_initiate',
      resource: 'payment',
      resourceId: order._id.toString(),
      details: {
        paymentMethod: 'mpesa',
        amount,
        phoneNumber: formattedPhone,
        error: error.response?.data || error.message
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'failed',
      severity: 'medium',
      errorMessage: error.message
    });

    return next(new ErrorResponse('Failed to initiate M-Pesa payment', 500));
  }
});

// @desc    M-Pesa callback handler
// @route   POST /api/payments/mpesa/callback
// @access  Public (M-Pesa callback)
exports.mpesaCallback = asyncHandler(async (req, res, next) => {
  const { Body } = req.body;
  
  if (!Body || !Body.stkCallback) {
    return res.status(400).json({ success: false, message: 'Invalid callback data' });
  }

  const { stkCallback } = Body;
  const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

  try {
    // Find order by checkout request ID
    const order = await Order.findOne({ 'paymentInfo.transactionId': CheckoutRequestID });
    
    if (!order) {
      console.error('Order not found for CheckoutRequestID:', CheckoutRequestID);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;

      // Update order payment status
      order.paymentInfo.status = 'completed';
      order.paymentInfo.paidAt = new Date();
      order.paymentInfo.transactionId = mpesaReceiptNumber || CheckoutRequestID;
      order.orderStatus = 'confirmed';
      
      // Add to status history
      order.statusHistory.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: `Payment confirmed via M-Pesa. Receipt: ${mpesaReceiptNumber}`
      });

      await order.save();

      // Update user wallet if applicable (cashback, etc.)
      if (order.user) {
        let wallet = await Wallet.findOne({ user: order.user });
        if (!wallet) {
          wallet = new Wallet({ user: order.user });
          await wallet.save();
        }

        // Add cashback (1% of order total)
        const cashbackAmount = Math.round(order.totalPrice * 0.01);
        if (cashbackAmount > 0) {
          await wallet.addTransaction({
            type: 'credit',
            amount: cashbackAmount,
            description: `Cashback for order ${order.orderNumber}`,
            reference: `CASHBACK-${order.orderNumber}`,
            source: 'cashback',
            metadata: {
              orderId: order._id,
              mpesaReceiptNumber
            }
          });
        }
      }

      // Log successful payment
      await AuditLog.logAction({
        user: order.user,
        action: 'payment_success',
        resource: 'payment',
        resourceId: order._id.toString(),
        details: {
          paymentMethod: 'mpesa',
          amount,
          phoneNumber,
          mpesaReceiptNumber,
          transactionDate,
          checkoutRequestId: CheckoutRequestID
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        severity: 'low'
      });

      console.log(`Payment successful for order ${order.orderNumber}. M-Pesa Receipt: ${mpesaReceiptNumber}`);

    } else {
      // Payment failed
      order.paymentInfo.status = 'failed';
      await order.save();

      // Log failed payment
      await AuditLog.logAction({
        user: order.user,
        action: 'payment_failed',
        resource: 'payment',
        resourceId: order._id.toString(),
        details: {
          paymentMethod: 'mpesa',
          resultCode: ResultCode,
          resultDescription: ResultDesc,
          checkoutRequestId: CheckoutRequestID
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failed',
        severity: 'medium',
        errorMessage: ResultDesc
      });

      console.log(`Payment failed for order ${order.orderNumber}. Reason: ${ResultDesc}`);
    }

    res.status(200).json({ success: true, message: 'Callback processed successfully' });

  } catch (error) {
    console.error('M-Pesa callback processing error:', error);
    res.status(500).json({ success: false, message: 'Callback processing failed' });
  }
});

// @desc    Check payment status
// @route   GET /api/payments/status/:orderId
// @access  Private
exports.checkPaymentStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check if user owns the order or is admin
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentInfo.status,
      paymentMethod: order.paymentInfo.method,
      transactionId: order.paymentInfo.transactionId,
      paidAt: order.paymentInfo.paidAt,
      amount: order.totalPrice
    }
  });
});

// @desc    Get payment history (Admin)
// @route   GET /api/payments/admin/history
// @access  Private/Admin
exports.getPaymentHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.status) {
    query['paymentInfo.status'] = req.query.status;
  }
  
  if (req.query.method) {
    query['paymentInfo.method'] = req.query.method;
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

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .select('orderNumber user paymentInfo totalPrice createdAt')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Order.countDocuments(query);

  // Calculate totals
  const totals = await Order.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        completedPayments: {
          $sum: {
            $cond: [{ $eq: ['$paymentInfo.status', 'completed'] }, 1, 0]
          }
        },
        completedAmount: {
          $sum: {
            $cond: [{ $eq: ['$paymentInfo.status', 'completed'] }, '$totalPrice', 0]
          }
        }
      }
    }
  ]);

  const stats = totals[0] || {
    totalAmount: 0,
    totalOrders: 0,
    completedPayments: 0,
    completedAmount: 0
  };

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
    },
    stats
  });
});

// @desc    Process refund
// @route   POST /api/payments/refund/:orderId
// @access  Private/Admin
exports.processRefund = asyncHandler(async (req, res, next) => {
  const { reason, amount } = req.body;
  
  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.paymentInfo.status !== 'completed') {
    return next(new ErrorResponse('Cannot refund unpaid order', 400));
  }

  const refundAmount = amount || order.totalPrice;

  // Update order status
  order.paymentInfo.status = 'refunded';
  order.orderStatus = 'refunded';
  order.statusHistory.push({
    status: 'refunded',
    timestamp: new Date(),
    note: `Refund processed: KES ${refundAmount}. Reason: ${reason}`,
    updatedBy: req.user.id
  });

  await order.save();

  // Credit user wallet
  let wallet = await Wallet.findOne({ user: order.user });
  if (!wallet) {
    wallet = new Wallet({ user: order.user });
    await wallet.save();
  }

  await wallet.addTransaction({
    type: 'credit',
    amount: refundAmount,
    description: `Refund for order ${order.orderNumber}`,
    reference: `REFUND-${order.orderNumber}`,
    source: 'refund',
    metadata: {
      orderId: order._id,
      adminId: req.user.id,
      reason
    }
  });

  // Log refund
  await AuditLog.logAction({
    user: req.user.id,
    action: 'payment_refund',
    resource: 'payment',
    resourceId: order._id.toString(),
    details: {
      refundAmount,
      reason,
      originalAmount: order.totalPrice,
      orderNumber: order.orderNumber
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    severity: 'medium'
  });

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: {
      orderId: order._id,
      refundAmount,
      walletBalance: wallet.balance
    }
  });
});