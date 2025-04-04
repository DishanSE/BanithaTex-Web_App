const express = require('express');
const router = express.Router();
const  dashboardController = require('../controllers/dashboardController.js');

router.get('/total-customers', dashboardController.getTotalCustomers);

router.get('/total-products', dashboardController.getTotalProducts);

router.get('/total-orders', dashboardController.getTotalOrders);

router.get('/total-sales', dashboardController.getTotalSales);

router.get('/recent-orders', dashboardController.getRecentOrders);

router.get('/recent-customers', dashboardController.getRecentCustomers);

module.exports = router;