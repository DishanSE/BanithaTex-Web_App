const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('../app');
require('dotenv').config();

// Signup logic
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, gender, contact_no, password, role } = req.body;

        // Check if user already exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
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
            'INSERT INTO users (first_name, last_name, email, gender, contact_no, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
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
            secure: false,
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