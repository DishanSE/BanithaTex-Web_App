import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Summary from '../components/Summary'
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const location = useLocation();
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
        try {
            if (!shippingAddress.trim()) {
                alert("Please enter a valid shipping address.");
                return;
            }

            if (paymentMethod === 'card') {
                setIsModalOpen(true);
            } else {
                console.log("Placing order with the following details:");
                console.log("Shipping Address:", shippingAddress);
                console.log("Payment Method:", paymentMethod);
                console.log("Selected Products:", selectedProducts);

                alert("Order placed successfully!");
                clearCart()
            }
        } catch (err) {
            console.error("Error placing order:", err);
        }
    };

    const handleSaveCardDetails = () => {
        console.log("Card Details: ", cardDetails);
        console.log("Placing order with following deatails: ");
        console.log("Shipping Address: ", shippingAddress);
        console.log("Payment Method: ", paymentMethod);
        console.log("Selected Products: ", selectedProducts);

        alert("Order placed succesfully!..");
        setIsModalOpen(false);
        clearCart();
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
                                            src={`http://localhost:5000${item.product_image}`}
                                            alt={item.product_name}
                                        />
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
                            <button className="save btn" type="button" onClick={handleSaveCardDetails}>
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