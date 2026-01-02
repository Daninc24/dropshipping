const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
} = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/:slug', getCategory);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', validateCategory, createCategory);
router.put('/:id', validateCategory, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;