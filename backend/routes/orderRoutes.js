const express = require('express');
const router = express.Router();
const  orderController = require('../controllers/orderController.js');

// Place Order Route
router.post('/orders', orderController.placeOrder);

// Fetch User Orders Route
router.get('/users/:id/orders', orderController.getUserOrders);

// Fetch All Orders
router.get('/allorders', orderController.getAllOrders);

// Update Order Status
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Delete Order
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;