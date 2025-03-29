const db = require("../config/db");

// Place Order Controller
exports.placeOrder = async (req, res) => {
    const { user_id, shipping_address, payment_method, cart } = req.body;

    let connection;
    try {
        let totalAmount = 0;
        connection = await db.getConnection(); // Get a connection from the pool

        // Start transaction
        await connection.beginTransaction();

        // Check stock and calculate total amount
        for (const item of cart) {
            const [product] = await connection.query(
                "SELECT stock_quantity FROM products WHERE id = ?",
                [item.product_id]
            );

            if (!product.length || product[0].stock_quantity < item.quantity) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ error: `Insufficient stock for product ID ${item.product_id}` });
            }

            // Convert price to number before multiplication
            const itemPrice = parseFloat(item.price);
            totalAmount += itemPrice;
        }

        totalAmount += 50;


        // Insert into orders table
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)",
            [user_id, totalAmount, "pending", shipping_address, payment_method]
        );

        const orderId = orderResult.insertId;

        // Insert into order_items table and update stock
        for (const item of cart) {
            await connection.query(
                "INSERT INTO order_items (order_id, product_id, quantity, selected_count_id, color, price) VALUES (?, ?, ?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, item.selected_count_id, item.color, item.price]
            );

            await connection.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

        // Commit transaction
        await connection.commit();
        connection.release(); // Release connection back to pool

        res.status(201).json({ message: "Order placed successfully!", orderId });
    } catch (err) {
        if (connection) {
            await connection.rollback(); // Rollback transaction on error
            connection.release();
        }
        console.error("Error placing order:", err);
        res.status(500).json({ error: "Failed to place order" });
    }
};


// Fetch User Orders Controller
exports.fetchUserOrders = async (req, res) => {
    const { user_id } = req.query;

    try {
        const [orders] = await db.query(
            `SELECT o.id, o.total_amount, o.status, o.shipping_address, o.payment_method, o.created_at
             FROM orders o
             WHERE o.user_id = ?`,
            [user_id]
        );

        const [orderItems] = await db.query(
            `SELECT oi.order_id, oi.product_id, p.name AS product_name, p.image_url, oi.quantity, oi.color, oi.price
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id`
        );

        // Group order items by order ID
        const ordersWithItems = orders.map((order) => ({
            ...order,
            items: orderItems.filter((item) => item.order_id === order.id),
        }));

        res.json(ordersWithItems);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
