const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, changePassword, getAllCustomers, deleteCustomer } = require('../controllers/userController');

// Fetch User Profile
router.get('/users/:id', getUserProfile);

// Update User Profile
router.put('/users/:id', updateUserProfile);

// Change password
router.post('/users/:id/change-password', changePassword);

// Fetch All Customers
router.get('/customers', getAllCustomers);

// Delete Customer
router.delete('/customers/:id', deleteCustomer);

module.exports = router;