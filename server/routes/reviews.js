const express = require('express');
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
  removeHelpful,
  reportReview,
  getAllReviews
} = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes
router.use(protect);

router.post('/', validateReview, createReview);
router.put('/:id', validateReview, updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.delete('/:id/helpful', removeHelpful);
router.post('/:id/report', reportReview);

// Admin routes
router.get('/', authorize('admin'), getAllReviews);

module.exports = router;