const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, changePassword } = require('../controllers/userController');

// Fetch User Profile
router.get('/users/:id', getUserProfile);

// Update User Profile
router.put('/users/:id', updateUserProfile);

// Change password
router.post('/users/:id/change-password', changePassword);

module.exports = router;