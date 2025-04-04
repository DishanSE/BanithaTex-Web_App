const db = require("../config/db");

// Get total number of customers
exports.getTotalCustomers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS total_customers FROM users WHERE role = "customer"');
        res.status(200).json({ total_customers: rows[0].total_customers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get total number of products
exports.getTotalProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS total_products FROM products');
        res.status(200).json({ total_products: rows[0].total_products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get total number of orders
exports.getTotalOrders = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS total_orders FROM orders');
        res.status(200).json({ total_orders: rows[0].total_orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get total sales amount
exports.getTotalSales = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT SUM(total_amount) AS total_sales FROM orders');
        res.status(200).json({ total_sales: rows[0].total_sales || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.id, o.created_at, u.first_name AS customer_name, o.total_amount
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recent customers
exports.getRecentCustomers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, first_name, email, created_at
            FROM users
            WHERE role = 'customer'
            ORDER BY created_at DESC
            LIMIT 5
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};