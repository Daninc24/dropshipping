const express = require('express');
const {
  initiateMpesaPayment,
  mpesaCallback,
  checkPaymentStatus,
  getPaymentHistory,
  processRefund
} = require('../controllers/payments');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/mpesa/callback', mpesaCallback);

// Protected routes
router.use(protect);

router.post('/mpesa/stk-push', initiateMpesaPayment);
router.get('/status/:orderId', checkPaymentStatus);

// Admin routes
router.use(authorize('admin'));

router.get('/admin/history', getPaymentHistory);
router.post('/refund/:orderId', processRefund);

module.exports = router;