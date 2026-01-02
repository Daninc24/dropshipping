const express = require('express');
const {
  getPublicSettings,
  getSettings,
  updateSettings,
  resetSettings,
  getPageSEO,
  updateMaintenanceMode
} = require('../controllers/settings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getPublicSettings);
router.get('/seo/:page', getPageSEO);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/admin', getSettings);
router.put('/admin', updateSettings);
router.post('/admin/reset', resetSettings);
router.put('/admin/maintenance', updateMaintenanceMode);

module.exports = router;