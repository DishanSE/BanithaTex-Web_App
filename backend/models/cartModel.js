const db = require('../config/db');

// Get user's cart ID
const getUserCartId = async (user_id) => {
    const [rows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [user_id]);
    if (rows.length === 0) {
        const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [user_id]);
        return result.insertId;
    }
    return rows[0].id;
};

// Fetch user's cart items
const getCartItems = async (cart_id) => {
    const [rows] = await db.query(
        `SELECT ci.id, ci.product_id, ci.quantity, yc.count_value, ci.color, CAST(p.price AS DECIMAL(10, 2)) AS price 
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         JOIN yarn_counts yc ON ci.selected_count_id = yc.id
         WHERE ci.cart_id = ?`,
        [cart_id]
    );
    return rows;
};

// Add item to cart
const addItemToCart = async (cart_id, product_id, quantity, selected_count_id, color) => {
    // Validate that the selected_count_id exists in the yarn_counts table
    const [countRows] = await db.query('SELECT id FROM yarn_counts WHERE id = ?', [selected_count_id]);
    if (countRows.length === 0) {
        throw new Error("Invalid selected_count_id");
    }

    // Insert the item into the cart_items table
    await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, selected_count_id, color)
         VALUES (?, ?, ?, ?, ?)`,
        [cart_id, product_id, quantity, selected_count_id, color]
    );
};

// Update cart item
const updateCartItem = async (item_id, quantity) => {
    await db.query(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [quantity, item_id]);
};

// Remove item from cart
const removeCartItem = async (item_id) => {
    await db.query(`DELETE FROM cart_items WHERE id = ?`, [item_id]);
};

// Clear user's cart
const clearCart = async (cart_id) => {
    await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart_id]);
};

module.exports = {
    getUserCartId,
    getCartItems,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
};