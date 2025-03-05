const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Fetch user's cart
router.get('/cart', (req, res, next) => {
    console.log("GET /api/cart hit with query:", req.query); // Debugging
    next();
}, cartController.getCart);

// Add item to cart
router.post('/cart', (req, res, next) => {
    console.log("POST /api/cart hit with body:", req.body); // Debugging
    next();
}, cartController.addItemToCart);

// Update cart item
router.put('/cart/:id', cartController.updateCartItem);

// Remove item from cart
router.delete('/cart/:id', cartController.removeCartItem);

// Clear cart
router.delete('/cart', cartController.clearCart);

module.exports = router;