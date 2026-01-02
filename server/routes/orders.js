const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;