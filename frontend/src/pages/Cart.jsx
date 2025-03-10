import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import Pay from '../assets/pay.png';
import COD from '../assets/cod.png';
import { ImBin } from "react-icons/im";
import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);

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

    // Calculate subtotal
    const calculateSubtotal = () => {
        const selectedCart = cart.filter((item) => selectedItems.includes(item.cart_item_id));
        return selectedCart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
    };

    const subtotal = calculateSubtotal();
    const shippingFee = 50;
    const estimatedTotal = subtotal + shippingFee;

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Left Side: Product List */}
                <div className="products-list">
                    <h1>Your Cart</h1>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
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
                                        onClick={() => removeFromCart(item.cart_item_id)}
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
                    <div className="summary">
                        <h2>Summary</h2>
                        <div className="summary-details">
                            <p>
                                <strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)}
                            </p>
                            <p>
                                <strong>Shipping Fee:</strong> Rs. {shippingFee.toFixed(2)}
                            </p>
                            <p>
                                <strong>Estimated Total:</strong> Rs. {estimatedTotal.toFixed(2)}
                            </p>
                        </div>
                        <button onClick={handleCheckout} className="checkout btn">
                            Checkout Selected Items
                        </button>
                    </div>

                    {/* Payment Options */}
                    <div className="payment-options">
                        <h3>Pay With</h3>
                        <div className="payment-icons">
                            <img
                                className="pay"
                                src={Pay}
                                alt="Card Payment"
                                title="Card Payment"
                            />
                            <img
                                className="cod"
                                src={COD}
                                alt="Cash on Delivery"
                                title="Cash on Delivery"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;