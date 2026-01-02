const express = require('express');
const {
  getCoupons,
  getCoupon,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/coupons');
const { protect, authorize } = require('../middleware/auth');
const { validateCoupon: validateCouponSchema } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/validate', protect, validateCoupon);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getCoupons);
router.get('/:id', getCoupon);
router.post('/', validateCouponSchema, createCoupon);
router.put('/:id', validateCouponSchema, updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;