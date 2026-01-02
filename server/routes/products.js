const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages
} = require('../controllers/products');
const { protect, authorize } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProduct);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/upload', upload.array('images', 10), uploadProductImages);

module.exports = router;