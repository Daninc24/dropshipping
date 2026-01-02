const express = require('express');
const {
  getWallet,
  getTransactionHistory,
  addCredit,
  payWithWallet,
  getWalletStats,
  getAllWallets
} = require('../controllers/wallet');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', getWallet);
router.get('/transactions', getTransactionHistory);
router.post('/pay', payWithWallet);

// Admin routes
router.use(authorize('admin'));

router.post('/credit', addCredit);
router.get('/admin/stats', getWalletStats);
router.get('/admin/all', getAllWallets);

module.exports = router;