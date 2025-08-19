const db = require('../config/db.js');

// Get monthly sales trends
exports.getMonthlySales = async (req, res) => {
    // Extract query parameters
    const { start_date, end_date } = req.query;

    // Validate and provide default values if missing
    if (!start_date || !end_date) {
        return res.status(400).json({ message: 'start_date and end_date are required as query parameters.' });
    }

    try {
        // Ensure the query parameters are valid dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Fetch monthly sales data
        const query = `
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM') AS month, 
                SUM(total_amount) AS total_sales
            FROM orders
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY month ASC
        `;
        const result = await db.query(query, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get top products by revenue
exports.getTopProducts = async (req, res) => {
    const { start_date, end_date } = req.query;

    // Validate and provide default values if missing
    if (!start_date || !end_date) {
        return res.status(400).json({ message: 'start_date and end_date are required as query parameters.' });
    }

    try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const query = `
            SELECT 
                p.name AS product_name,
                SUM(oi.quantity * oi.price) AS total_revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.created_at BETWEEN $1 AND $2
            GROUP BY p.name
            ORDER BY total_revenue DESC
            LIMIT 5
        `;
        const result = await db.query(query, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get new customers per month
exports.getNewCustomersPerMonth = async (req, res) => {
    const { start_date, end_date } = req.query;

    // Validate and provide default values if missing
    if (!start_date || !end_date) {
        return res.status(400).json({ message: 'start_date and end_date are required as query parameters.' });
    }

    try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const query = `
            SELECT 
                TO_CHAR(created_at, 'YYYY-MM') AS month, 
                COUNT(*) AS new_customers
            FROM users
            WHERE role = 'customer' AND created_at BETWEEN $1 AND $2
            GROUP BY TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY month ASC
        `;
        const result = await db.query(query, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get revenue by yarn type
exports.getRevenueByYarnType = async (req, res) => {
    const { start_date, end_date } = req.query;

    // Validate and provide default values if missing
    if (!start_date || !end_date) {
        return res.status(400).json({ message: 'start_date and end_date are required as query parameters.' });
    }

    try {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const query = `
            SELECT 
                yt.name AS yarn_type,
                SUM(oi.quantity * oi.price) AS total_revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN yarn_types yt ON p.type_id = yt.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.created_at BETWEEN $1 AND $2
            GROUP BY yt.name
            ORDER BY total_revenue DESC
        `;
        const result = await db.query(query, [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};