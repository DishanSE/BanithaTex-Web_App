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
exports.getUserOrders = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                o.id AS order_id,
                o.created_at AS placed_on,
                p.name AS product_name, -- Fetch product name from products table
                oi.quantity,
                oi.price,
                o.status
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id -- Join with products table
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [id]);

        if (!rows.length) {
            return res.status(404).json({ error: 'No orders found' });
        }

        // Group items by order ID
        const orders = rows.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    placed_on: row.placed_on,
                    items: [],
                    total: 0,
                    status: row.status,
                };
            }
            acc[row.order_id].items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price,
            });
            acc[row.order_id].total += row.price * row.quantity;
            return acc;
        }, {});

        res.json(Object.values(orders));
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};

// Fetch All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                o.id AS order_id,
                u.first_name,
                u.last_name,
                p.name AS product_name,
                p.price,
                oi.quantity,
                oi.selected_count_id AS count_value,
                oi.color,
                o.created_at AS placed_on,
                o.total_amount,
                o.shipping_address,
                o.payment_method,
                o.status
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            ORDER BY o.created_at DESC
        `);

        if (!rows.length) {
            return res.status(404).json({ error: 'No orders found' });
        }

        // Group items by order ID
        const orders = rows.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    items: [],
                    total_quantity: 0,
                    placed_on: row.placed_on,
                    shipping_address: row.shipping_address,
                    total_amount: row.total_amount,
                    payment_method: row.payment_method,
                    status: row.status,
                };
            }
            acc[row.order_id].items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                count_value: row.count_value,
                color: row.color,
                price: row.price,
            });
            acc[row.order_id].total_quantity += row.quantity;
            return acc;
        }, {});

        // Convert object to an array and sort by `placed_on` in descending order (just in case)
        const sortedOrders = Object.values(orders).sort((a, b) => new Date(b.placed_on) - new Date(a.placed_on));

        res.json(sortedOrders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM orders WHERE id = ?', [id]);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};