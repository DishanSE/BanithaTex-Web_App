const cartModel = require('../models/cartModel');

// Fetch user's cart
exports.getCart = async (req, res) => {
    try {
        const { user_id } = req.query;

        // Log the user_id for debugging
        console.log("Fetching cart for user_id:", user_id);

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id in query parameters." });
        }

        // Fetch the user's cart ID
        const cart_id = await cartModel.getUserCartId(user_id);
        console.log("Fetched cart_id:", cart_id);

        // Fetch cart items
        const cartItems = await cartModel.getCartItems(cart_id);
        console.log("Fetched cartItems:", cartItems);

        // Return the cart items
        res.json(cartItems);
    } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).json({ error: "Failed to fetch cart." });
    }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity, selected_count_id, color } = req.body;

        // Log the request body for debugging
        console.log("Request Body:", req.body);

        // Fetch the user's cart ID
        const cart_id = await cartModel.getUserCartId(user_id);

        // Add the item to the cart
        await cartModel.addItemToCart(cart_id, product_id, quantity, selected_count_id, color);

        // Return a success response
        res.status(200).json({ message: "Item added to cart successfully." });
    } catch (error) {
        // Log the error for debugging
        console.error("Error adding item to cart:", error);

        // Return an error response
        res.status(500).json({ message: error.message });
    }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        await cartModel.updateCartItem(id, quantity);
        res.json({ message: "Cart item updated successfully." });
    } catch (err) {
        console.error("Error updating cart item:", err);
        res.status(500).json({ error: "Failed to update cart item." });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        await cartModel.removeCartItem(id);
        res.json({ message: "Cart item removed successfully." });
    } catch (err) {
        console.error("Error removing cart item:", err);
        res.status(500).json({ error: "Failed to remove cart item." });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const { user_id } = req.query;
        const cart_id = await cartModel.getUserCartId(user_id);
        await cartModel.clearCart(cart_id);
        res.json({ message: "Cart cleared successfully." });
    } catch (err) {
        console.error("Error clearing cart:", err);
        res.status(500).json({ error: "Failed to clear cart." });
    }
};