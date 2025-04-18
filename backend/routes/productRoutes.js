const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../config/multerConfig.js');
const router = express.Router();

// Public routes
router.get('/', productController.getProducts);

// Fetch yarn types & counts
router.get('/yarn-types', productController.getYarnTypes);
router.get('/yarn-counts', productController.getYarnCounts);

router.get('/:id/colors', productController.getProductColors);
router.get('/:id/counts', productController.getProductCounts);
router.get('/:id', productController.getProductById);
router.get('/:id/counts/:color', productController.getAvailableCounts);

// Admin-only routes
router.post('/', productController.addProduct);
router.post('/', upload.single('image'), productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
