const express = require('express');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const {authenticate, isAdmin} = require('./midleware/authMiddleware');
const cookieParser = require('cookie-parser');
const path = require('path');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Increase the JSON payload limit to 10 MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase the URL-encoded payload limit

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes);
app.use('/api/products', authenticate, isAdmin);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;