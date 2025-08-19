const db = require("../config/db");
const transporter = require('../config/nodemailer.js');

// Place Order Controller
exports.placeOrder = async (req, res) => {
    const { user_id, shipping_address, payment_method, cart } = req.body;

    // Add validation for shipping address and cart
    if (!shipping_address) {
        return res.status(400).json({ error: "Shipping address is required" });
    }
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "Cart is required and must be a non-empty array" });
    }

    const client = await db.connect();
    try {
        let totalAmount = 0;

        // Start transaction
        await client.query('BEGIN');

        // Check stock and validate selected_count_id
        for (const item of cart) {
            // Validate required fields in cart item
            if (!item.product_id || !item.quantity || !item.price) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: `Invalid cart item: missing product_id, quantity, or price` });
            }

            // Check stock
            const productResult = await client.query(
                "SELECT stock_quantity FROM products WHERE id = $1",
                [item.product_id]
            );

            if (!productResult.rows.length || productResult.rows[0].stock_quantity < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: `Insufficient stock for product ID ${item.product_id}` });
            }

            // Validate selected_count_id if provided
            if (item.selected_count_id) {
                const countResult = await client.query(
                    "SELECT id FROM yarn_counts WHERE id = $1",
                    [item.selected_count_id]
                );
                if (!countResult.rows.length) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: `Invalid selected_count_id ${item.selected_count_id} for product ID ${item.product_id}` });
                }
            }

            // Calculate total amount
            const itemPrice = parseFloat(item.price);
            totalAmount += itemPrice * item.quantity; // Fixed: Multiply by quantity
        }

        totalAmount += 50; // Shipping or fixed fee

        // Insert into orders table
        const orderResult = await client.query(
            "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [user_id, totalAmount, "pending", shipping_address, payment_method]
        );

        const orderId = orderResult.rows[0].id;

        // Insert into order_items table and update stock
        for (const item of cart) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, selected_count_id, color, price) VALUES ($1, $2, $3, $4, $5, $6)",
                [orderId, item.product_id, item.quantity, item.selected_count_id || null, item.color, item.price]
            );

            await client.query(
                "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
                [item.quantity, item.product_id]
            );
        }

        // Commit transaction
        await client.query('COMMIT');

        // Fetch user email for notification
        const userResult = await client.query("SELECT email FROM users WHERE id = $1", [user_id]);
        const userEmail = userResult.rows[0]?.email;

        // Notify the user via email
        if (userEmail) {
            notifyUserOrderPlaced(userEmail, orderId, cart);
        }

        res.status(201).json({ message: "Order placed successfully!", orderId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error placing order:", err);
        res.status(500).json({ error: "Failed to place order", details: err.message });
    } finally {
        client.release();
    }
};


exports.getUserOrders = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(`
            SELECT 
                o.id AS order_id,
                o.created_at AS placed_on,
                p.name AS product_name,
                oi.quantity,
                o.payment_method,
                p.price AS product_price,
                o.total_amount,
                o.status
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            ORDER BY placed_on DESC
        `, [id]);

        if (!result.rows.length) {
            return res.status(404).json({ error: 'No orders found' });
        }

        // Track order IDs in the order they appear
        const orderIds = [];
        
        // Group items by order ID
        const ordersMap = result.rows.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    placed_on: row.placed_on,
                    items: [],
                    payment_method: row.payment_method,
                    total: row.total_amount, // Use the total_amount from the database
                    status: row.status,
                };
                // Add to orderIds array only once per order_id
                orderIds.push(row.order_id);
            }
            acc[row.order_id].items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.product_price, // Use the product_price from query
            });
            return acc;
        }, {});

        // Construct result array in the correct order
        const orders = orderIds.map(id => ordersMap[id]);

        res.json(orders);
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};

// Fetch All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const result = await db.query(`
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

        if (!result.rows.length) {
            return res.status(404).json({ error: 'No orders found' });
        }

        // Group items by order ID
        const orders = result.rows.reduce((acc, row) => {
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
    const { id } = req.params; // Extract order ID from URL
    const { status } = req.body; // Extract new status from request body

    try {
        // Validate required fields
        if (!id || !status) {
            return res.status(400).json({ message: "Order ID and status are required." });
        }

        // Update the order status in the database
        const result = await db.query(
            "UPDATE orders SET status = $1 WHERE id = $2",
            [status, id]
        );

        // Check if the order was found and updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Fetch user email for notification
        const orderResult = await db.query(
            "SELECT user_id FROM orders WHERE id = $1",
            [id]
        );
        const userId = orderResult[0]?.user_id;

        if (userId) {
            const userResult = await db.query("SELECT email FROM users WHERE id = $1", [userId]);
            const userEmail = userResult[0]?.email;

            // Notify the user via email
            if (userEmail) {
                notifyUserOrderStatusUpdate(userEmail, id, status);
            }
        }

        res.status(200).json({ message: "Order status updated successfully." });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM orders WHERE id = $1', [id]);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

// Function to notify the user about order placement
const notifyUserOrderPlaced = async (userEmail, orderId, cartItems) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Order Confirmation',
            html: `
                <h1>Thank you for your order!</h1>
                <p>Your order has been placed successfully. Here are the details:</p>
                <ul>
                    ${cartItems.map(item => `
                        <li>
                            <strong>${item.product_name}</strong> - 
                            Quantity: ${item.quantity}, 
                            Color: ${item.color}, 
                            Price: Rs. ${Number(item.price + 50).toFixed(2)}
                        </li>
                    `).join('')}
                </ul>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p>We will notify you once your order is shipped.</p>
            `,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};


// Function to notify the user about order status updates
const notifyUserOrderStatusUpdate = async (userEmail, orderId, status) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Order Status Update',
            html: `
                <h1>Your Order Status Has Been Updated</h1>
                <p>Your order with ID <strong>${orderId}</strong> has been updated to <strong>${status}</strong>.</p>
                <p>Thank you for shopping with us!</p>
            `,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending order status update email:', error);
    }
};

