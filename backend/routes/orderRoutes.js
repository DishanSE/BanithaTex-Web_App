const express = require('express');
const router = express.Router();
const  orderController = require('../controllers/orderController.js');

// Place Order Route
router.post('/orders', orderController.placeOrder);

// Fetch User Orders Route
router.get('/orders', orderController.fetchUserOrders);

module.exports = router;