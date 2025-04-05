// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import apiClient from '../api/apiClient';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isLoggedIn, user } = useContext(AuthContext); // Access authentication state
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchUserCart();
        }
    }, [isLoggedIn, user]);

    // Fetch user's cart
    const fetchUserCart = async () => {
        try {
            const response = await apiClient.get(`/cart?user_id=${user.id}`);
            setCart(response.data);
        } catch (err) {
            console.error("Error fetching user cart:", err);
        }
    };


    // Add item to cart
    const addToCart = async (product, selectedOptions) => {
        if (!isLoggedIn) {
            alert("Please log in to add items to your cart.");
            return;
        }

        try {
            const calculatedPrice = product.price * selectedOptions.quantity;
            console.log("Adding item to cart:", {
                user_id: user.id,
                product_id: product.id,
                quantity: selectedOptions.quantity,
                selected_count_id: selectedOptions.count,
                color: selectedOptions.color,
                price: calculatedPrice,
            });

            const response = await apiClient.post('/cart', {
                user_id: user.id,
                product_id: product.id,
                quantity: selectedOptions.quantity,
                selected_count_id: selectedOptions.count,
                color: selectedOptions.color,
                price: calculatedPrice,
            });

            console.log("API Response:", response.data);
            fetchUserCart(); // Refresh cart after adding an item
        } catch (err) {
            console.error("Error adding item to cart:", err.response?.data || err.message);
            alert("Failed to add item to cart. Please try again.");
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            alert("Please log in to add items to your cart.");
            return;
        }
        try {
            const selectedOptions = {
                color: selectedColor,
                count: selectedCount, // This is now the ID of the count
                quantity: quantity,
            };
            await addToCart(product, selectedOptions);
            setSuccessMessage(`${product.name} has been added to the cart!`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error adding item to cart:", err);
            alert("Failed to add item to cart. Please try again.");
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            await apiClient.delete(`/cart/${itemId}`);
            fetchUserCart(); // Refresh cart after removing an item
        } catch (err) {
            console.error("Error removing item from cart:", err);
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            await apiClient.delete('/cart', { params: { user_id: user.id } });
            setCart([]); // Clear cart locally
        } catch (err) {
            console.error("Error clearing cart:", err);
        }
    };

    // Remove specific items from the cart
    const removeSelectedItems = (selectedCartItemIds) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !selectedCartItemIds.includes(item.cart_item_id))
        );
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, handleAddToCart, removeFromCart, clearCart, removeSelectedItems }}>
            {children}
        </CartContext.Provider>
    );
};