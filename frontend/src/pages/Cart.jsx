import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import Summary from '../components/Summary.jsx';
import { useNavigate } from 'react-router-dom';
import { ImBin } from "react-icons/im";
import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [itemToRemove, setItemToRemove] = useState(null); // Track the item to remove

    // Handle checkbox selection
    const handleSelectItem = (itemId, isChecked) => {
        setSelectedItems((prevSelectedItems) => {
            if (isChecked) {
                return [...prevSelectedItems, itemId]; // Add item ID
            } else {
                return prevSelectedItems.filter((id) => id !== itemId); // Remove item ID
            }
        });
    };

    // Handle checkout
    const handleCheckout = () => {
        const selectedProducts = cart.filter((item) => selectedItems.includes(item.cart_item_id));
        navigate('/checkout', { state: { selectedProducts } });
    };

    // Handle Remove Button Click with Confirmation
    const handleRemoveItem = (itemId) => {
        const isConfirmed = window.confirm("Are you sure you want to remove this item from your cart?");
        if (isConfirmed) {
            removeFromCart(itemId); // Call the removeFromCart function only if confirmed
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Left Side: Product List */}
                <div className="products-list">
                    <h1>Cart</h1>
                    {cart.length === 0 ? (
                        <p>Your cart is empty...</p>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item.cart_item_id} className="cart-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.cart_item_id)} // Tie checkbox to state
                                        onChange={(e) => handleSelectItem(item.cart_item_id, e.target.checked)}
                                        className="cart-checkbox"
                                    />
                                    <img
                                        src={`http://localhost:5000${item.product_image}`}
                                        alt={item.product_name}
                                        className="products-image"
                                    />
                                    <div className="products-info">
                                        <h3 className="products-name">{item.product_name}</h3>
                                        <div className="products-details">
                                            <p>Color: {item.color}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Count: {item.count_value}</p>
                                        </div>
                                        <p className="products-price">Price: Rs. {Number(item.price).toFixed(2)}</p>
                                    </div>
                                    <button
                                        className="remove-button"
                                        onClick={() => {
                                            setItemToRemove(item.cart_item_id);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <ImBin />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={clearCart} className="clear btn">
                        Clear Cart
                    </button>
                </div>

                {/* Right Side: Summary and Payment Options */}
                <div className="right-side">
                    <Summary selectedItems={selectedItems}
                        cart={cart}
                        onButtonClick={handleCheckout}
                        buttonText="Checkout" />
                </div>
            </div>
            {isModalOpen && (
                <div className="modals-overlay">
                    <div className="modals-content">
                        <h2>Confirm Removal</h2>
                        <p>Are you sure you want to remove this item from your cart?</p>
                        <div className="modals-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)} // Close the modal
                            >
                                No
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    removeFromCart(itemToRemove); // Remove the item
                                    setIsModalOpen(false); // Close the modal
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;