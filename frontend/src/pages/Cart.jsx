import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import Summary from '../components/Summary.jsx';
import { useNavigate } from 'react-router-dom';
import { ImBin } from "react-icons/im";
import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

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
        if (selectedItems.length === 0) {
            alert("Please select at least one item to checkout");
            return;
        }
        const selectedProducts = cart.filter((item) => selectedItems.includes(item.cart_item_id));
        navigate('/checkout', { state: { selectedProducts } });
    };

    // Handle clear cart with confirmation
    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            clearCart();
            setSelectedItems([]);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Left Side: Product List */}
                <div className="products-list">
                    <h1>Shopping Cart</h1>
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty...</p>
                            <button 
                                onClick={() => navigate('/product')} 
                                className="checkout"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.cart_item_id} className="cart-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.cart_item_id)}
                                            onChange={(e) => handleSelectItem(item.cart_item_id, e.target.checked)}
                                            className="cart-checkbox"
                                            aria-label={`Select ${item.product_name}`}
                                        />
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${item.product_image}`}
                                            alt={item.product_name}
                                            className="products-image"
                                            loading="lazy"
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
                                            aria-label={`Remove ${item.product_name} from cart`}
                                        >
                                            <ImBin />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleClearCart} className="clear">
                                Clear Cart
                            </button>
                        </>
                    )}
                </div>

                {/* Right Side: Summary and Payment Options */}
                {cart.length > 0 && (
                    <div className="right-side">
                        <Summary 
                            selectedItems={selectedItems}
                            cart={cart}
                            onButtonClick={handleCheckout}
                            buttonText="Proceed to Checkout" 
                        />
                    </div>
                )}
            </div>
            
            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="modals-overlay">
                    <div className="modals-content">
                        <h2>Confirm Removal</h2>
                        <p>Are you sure you want to remove this item from your cart?</p>
                        <div className="modals-actions">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    removeFromCart(itemToRemove);
                                    // Also remove from selected items if present
                                    setSelectedItems(prev => prev.filter(id => id !== itemToRemove));
                                    setIsModalOpen(false);
                                }}
                            >
                                Remove
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;