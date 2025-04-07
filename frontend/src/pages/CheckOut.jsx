import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import Summary from '../components/Summary'
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart, removeSelectedItems, clearCart } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const { isLoggedIn, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const selectedProducts = location.state?.selectedProducts || [];
    

    // State for shipping address, payment method, and modal visibility
    const [shippingAddress, setShippingAddress] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('cod'); // Default to "Card Payment"
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const handlePlaceOrder = async () => {
        if (!isLoggedIn) {
            alert("Please log in to place an order.");
            return;
        }
        try {
            const orderData = {
                user_id: user.id,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                cart: selectedProducts.map((item) => ({
                    product_id: item.product_id,
                    product_name: item.product_name, // Include product_name
                    quantity: item.quantity,
                    selected_count_id: Number(item.selected_count_id), // Ensure count ID is a number
                    color: item.color,
                    price: item.price,
                })),
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, orderData);
            clearCart(); // Clear cart after successful order placement
            alert("Order placed successfully!");
            navigate('/customer/orders');
        } catch (err) {
            console.error("Error placing order:", err.response?.data || err.message);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleSaveCardDetails = () => {
        console.log("Card Details: ", cardDetails);
        console.log("Placing order with following deatails: ");
        console.log("Shipping Address: ", shippingAddress);
        console.log("Payment Method: ", paymentMethod);
        console.log("Selected Products: ", selectedProducts);

        const selectedCartItemIds = selectedProducts.map((item) => item.cart_item_id);
        removeSelectedItems(selectedCartItemIds);
        setSelectedItems([]);
        alert("Order placed succesfully!..");
        setIsModalOpen(false);
        navigate('/customer/orders');
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            {selectedProducts.length === 0 ? (
                <p>No items selected for checkout.</p>
            ) : (
                <div className="checkout-container">
                    {/* Left Side: Shipping Address, Payment Method, and Item Details */}
                    <div className="left-side">
                        {/* 1. Shipping Address Input */}
                        <div className="shipping-address">
                            <h2>Shipping Address</h2>
                            <textarea
                                placeholder="Enter your shipping address"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                rows="1"
                            />
                        </div>

                        {/* 2. Payment Method */}
                        <div className="payment-method">
                            <h2>Payment Method</h2>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => {
                                            setPaymentMethod('cod');
                                            setIsModalOpen(false);
                                        }}
                                    />
                                    Cash on Delivery
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => {
                                            setPaymentMethod('card');
                                            setIsModalOpen(true);
                                        }}
                                    />
                                    Card Payment
                                </label>
                            </div>
                        </div>

                        {/* 3. Item Details */}
                        <div className="item-details">
                            <h2>Item Details</h2>
                            <div className="yarn-items">
                                {selectedProducts.map((item) => (
                                    <div key={item.cart_item_id} className="yarn-item">
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${item.product_image}`}
                                            alt={item.product_name}
                                        />
                                        <h3 className="products-name">{item.product_name}</h3>
                                        <p>Rs. {Number(item.price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Summary and Place Order Button */}
                    <div className="right-side">
                        <Summary
                            selectedItems={selectedProducts.map((item) => item.cart_item_id)}
                            cart={selectedProducts}
                            onButtonClick={handlePlaceOrder}
                            buttonText="Place Order"
                        />
                    </div>
                </div>
            )}

            {/* Model for Card Payment */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {/* Header with Close Button */}
                        <div className="modal-header">
                            <h2>Card Details</h2>
                            <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
                        </div>

                        {/* Form with Two Columns */}
                        <form action="">
                            <div className="form-grid">
                                {/* Column 1 */}
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="cardHolderName"
                                        value={cardDetails.cardHolderName}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolderName: e.target.value })}
                                        placeholder="Card Holder Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                        placeholder="Card Number"
                                    />
                                </div>

                                {/* Column 2 */}
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        value={cardDetails.expiryDate}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                        placeholder="Expiry Date (MM/YY)"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="cvv"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        placeholder="CVV"
                                    />
                                </div>
                            </div>

                            {/* Save and Place Order Button */}
                            <button className="save btn" type="button" onClick={handlePlaceOrder}>
                                Save & Place Order
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;