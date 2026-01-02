const express = require('express');
const {
  getDeliveryZones,
  calculateDeliveryFee,
  applyAsDeliveryAgent,
  getAgentProfile,
  updateAgentAvailability,
  getAgentDeliveries,
  updateDeliveryStatus,
  getAllAgents,
  updateAgentStatus,
  assignDeliveryAgent,
  createDeliveryZone,
  updateDeliveryZone
} = require('../controllers/delivery');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/zones', getDeliveryZones);
router.post('/calculate-fee', calculateDeliveryFee);

// Protected routes
router.use(protect);

// Delivery agent routes
router.post('/agents/apply', applyAsDeliveryAgent);
router.get('/agents/profile', getAgentProfile);
router.put('/agents/availability', updateAgentAvailability);
router.get('/agents/deliveries', getAgentDeliveries);
router.put('/orders/:orderId/status', updateDeliveryStatus);

// Admin routes
router.use(authorize('admin'));

router.get('/admin/agents', getAllAgents);
router.put('/admin/agents/:id/status', updateAgentStatus);
router.post('/admin/assign', assignDeliveryAgent);
router.post('/admin/zones', createDeliveryZone);
router.put('/admin/zones/:id', updateDeliveryZone);

module.exports = router;