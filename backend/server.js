const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const app = require('./app');
const multer = require('multer');

// Load environment variables
dotenv.config();

// Port configuration
const PORT = process.env.PORT;

// Test database connection
db.getConnection()
    .then(() => {
        console.log('Database connected successfully...');
    })
    .catch((err) => {
        console.error('Database connection failed:(', err);
        process.exit(1);
    });

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

// Configure multer to save files in the "uploads" folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// API endpoint to handle image uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});