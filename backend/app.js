const express = require('express');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const {authenticate, isAdmin} = require('./midleware/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', authenticate, isAdmin);


module.exports = app;