const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Fetch user's cart
router.get('/cart', (req, res, next) => {
    next();
}, cartController.getCart);

// Add item to cart
router.post('/cart', (req, res, next) => {
    next();
}, cartController.addItemToCart);

// Update cart item
router.put('/cart/:id', cartController.updateCartItem);

// Remove item from cart
router.delete('/cart/:id', cartController.removeCartItem);

// Clear cart
router.delete('/cart', cartController.clearCart);

module.exports = router;