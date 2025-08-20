const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const transporter = require('../config/nodemailer');
const crypto = require('crypto');
require('../app');
require('dotenv').config();

// Signup logic
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, gender, contact_no, password, role } = req.body;

        // Check if user already exists
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate role (only allow 'customer' or 'admin')
        if (role && !['customer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user into database with the correct role
        await db.query(
            `INSERT INTO users (first_name, last_name, email, gender, contact_no, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [first_name, last_name, email, gender, contact_no, passwordHash, role || 'customer']
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Set token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7200000,
        });

        // Return user details in the response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

exports.getUser = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch the authenticated user's details from the database
        const { rows } = await db.query('SELECT id, email, role FROM users WHERE id = $1', [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user details, including the id
        const user = rows[0];
        res.json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Failed to fetch user details' });
    }
};

// Forgot Password with JWT
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = rows[0].id;

        // Generate a JWT token that expires in 1 hour
        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Save the token in the database
        const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
        await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
            [token, expiresAt, userId]
        );

        // Send the password reset email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Banitha Tex<h2/>
                <p>You are receiving this email because you (or someone else) requested a password reset.</p>
                <p>Please click the following link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'A password reset link has been sent to your email.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Fetch user details from the database
        const [rows] = await db.query(
            `SELECT id FROM users WHERE id = $1 AND reset_password_token = $2 AND reset_password_expires > NOW()`,
            [decoded.id, token]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const userId = rows[0].id;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password_hash and clear the reset token
        await db.query(
            `UPDATE users 
             SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL 
             WHERE id = $2`,
            [hashedPassword, userId]
        );

        res.json({ message: "Your password has been reset successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};