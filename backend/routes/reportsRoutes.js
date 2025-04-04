const express = require('express');
const reportsController = require('../controllers/reportsController.js');
const router = express.Router();

router.get('/monthly-sales', reportsController.getMonthlySales);

router.get('/top-products', reportsController.getTopProducts);

router.get('/new-customers', reportsController.getNewCustomersPerMonth);

router.get('/revenue-by-yarn-type', reportsController.getRevenueByYarnType);

module.exports = router;