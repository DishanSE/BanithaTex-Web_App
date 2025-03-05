const express = require('express');
const router = express.Router();
const { signup, login, logout, getUser } = require('../controllers/authController.js');
const {authenticate} = require('../midleware/authMiddleware.js')


// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Protected route to get user details (including role)
router.get('/user', authenticate(['customer', 'admin']), getUser);

// Protected route for the customer dashboard
router.get('/customer/dashboard', authenticate(['customer']), (req, res) => {
    res.status(200).json({
        message: 'Welcome to the customer dashboard!',
        user: req.user,
    });
});

router.post('/logout', logout)

module.exports = router;