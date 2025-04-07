const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { signup, login, logout, getUser, forgotPassword, resetPassword } = require('../controllers/authController.js');
const { authenticate } = require('../midleware/authMiddleware.js');

// Signup route - Allows new users to register
router.post('/signup', signup);

// Login route - Authenticates users and returns a token
router.post('/login', login);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Token Validation Route
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    try {
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET);
        // If valid, render the reset password page or return success
        res.status(200).json({ message: 'Token is valid', token });
    } catch (error) {
        console.error("Token validation error:", error.message);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
});

// Reset Password Route
router.post('/reset-password', resetPassword);

// Protected route to get user details (including role)
router.get('/user', authenticate(['customer', 'admin']), getUser);

// Protected route for the customer dashboard
router.get('/customer/dashboard', authenticate(['customer']), (req, res) => {
    res.status(200).json({
        message: 'Welcome to the customer dashboard!',
        user: req.user,
    });
});

// Protected route for the admin dashboard
router.get('/admin/dashboard', authenticate(['admin']), (req, res) => {
    res.status(200).json({
        message: 'Welcome to the admin dashboard!',
        user: req.user,
    });
});

// Logout route - Logs the user out by invalidating the token
router.post('/logout',  logout);

module.exports = router;