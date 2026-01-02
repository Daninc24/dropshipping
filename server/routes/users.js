const express = require('express');
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/users');
const { protect } = require('../middleware/auth');
const { validateAddress } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', validateAddress, addAddress);
router.put('/addresses/:id', validateAddress, updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;