import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import Summary from '../components/Summary.jsx'
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
    const [addressError, setAddressError] = useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('cod');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardError, setCardError] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const handlePlaceOrder = async () => {
        if (!isLoggedIn) {
            alert("Please log in to place an order.");
            navigate('/login');
            return;
        }
        setAddressError('');

        // Validate shipping address
        if (!shippingAddress || shippingAddress.trim() === '') {
            setAddressError('Shipping address is required');
            return;
        }

        try {
            const orderData = {
                user_id: user.id,
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                cart: selectedProducts.map((item) => ({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    selected_count_id: Number(item.selected_count_id),
                    color: item.color,
                    price: item.price,
                })),
            };

            const token = localStorage.getItem('token');

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    maxRedirects: 0
                }
            );

            const selectedCartItemIds = selectedProducts.map(item => item.cart_item_id);
            removeSelectedItems(selectedCartItemIds);
            
            alert("Order placed successfully!");
            navigate('/customer/orders');
        } catch (err) {
            console.error("Error placing order:", err);
        }
    };

    const isValidCardNumber = (number) => {
        // Basic validation: check if it's 16 digits and passes Luhn algorithm
        if (!number || number.length !== 16) return false;

        // Luhn algorithm (credit card checksum)
        let sum = 0;
        let shouldDouble = false;

        // Loop through values starting from the rightmost digit
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    };

    const isValidExpiryDate = (date) => {
        // Check format
        if (!date || !date.match(/^\d{2}\/\d{2}$/)) return false;

        const [month, year] = date.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // January is 0

        // Convert to numbers
        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        // Check month is between 1 and 12
        if (expMonth < 1 || expMonth > 12) return false;

        // Check year is current or future
        if (expYear < currentYear) return false;

        // If same year, check month is current or future
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    };

    const handleValidatedPlaceOrder = () => {
        // Validate all fields first
        const isCardHolderValid = cardDetails.cardHolderName.trim() !== '';
        const isCardNumberValid = isValidCardNumber(cardDetails.cardNumber.replace(/\s/g, ''));
        const isExpiryValid = isValidExpiryDate(cardDetails.expiryDate);
        const isCvvValid = cardDetails.cvv.length >= 3 && cardDetails.cvv.length <= 4;

        if (isCardHolderValid && isCardNumberValid && isExpiryValid && isCvvValid) {
            // All validation passed, proceed with order
            handlePlaceOrder();
        } else {
            // Set error state to trigger error messages
            setCardError(true);
        }
    };

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
                                className={addressError ? "error" : ""}
                            />
                            {addressError && <p className="error-message">{addressError}</p>}
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
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-grid">
                                {/* Column 1 */}
                                <div className="forms-group">
                                    <input
                                        type="text"
                                        id="cardHolderName"
                                        value={cardDetails.cardHolderName}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-Z\s\-'.]/g, '');
                                            setCardDetails({ ...cardDetails, cardHolderName: value });
                                        }}
                                        placeholder="Card Holder Name"
                                        className={cardError && !cardDetails.cardHolderName ? 'error' : ''}
                                    />
                                    {cardError && !cardDetails.cardHolderName && (
                                        <span className="error-message">Please enter card holder name</span>
                                    )}
                                </div>

                                <div className="forms-group">
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        value={cardDetails.expiryDate}
                                        onChange={(e) => {
                                            // Format as MM/YY
                                            let value = e.target.value.replace(/\D/g, '');
                                            if (value.length > 0) {
                                                // Limit first digit of month to 0 or 1
                                                if (value.length === 1 && parseInt(value) > 1) {
                                                    value = '0' + value;
                                                }
                                                // Limit second digit of month to make month <= 12
                                                if (value.length >= 2) {
                                                    const month = parseInt(value.substring(0, 2));
                                                    if (month > 12) {
                                                        value = '12' + value.substring(2);
                                                    }
                                                }
                                                // Format with slash
                                                if (value.length > 2) {
                                                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                }
                                            }
                                            // Max length of MM/YY (5 characters)
                                            value = value.slice(0, 5);
                                            setCardDetails({ ...cardDetails, expiryDate: value });
                                        }}
                                        placeholder="Expiry Date (MM/YY)"
                                        className={cardError && !isValidExpiryDate(cardDetails.expiryDate) ? 'error' : ''}
                                    />
                                    {cardError && !isValidExpiryDate(cardDetails.expiryDate) && (
                                        <span className="error-message">Please enter a valid future expiry date</span>
                                    )}
                                </div>

                                {/* Column 2 */}
                                <div className="forms-group">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => {
                                            // Only allow numbers and auto-format with spaces
                                            const value = e.target.value.replace(/\D/g, '');
                                            const formattedValue = value
                                                .replace(/(\d{4})/g, '$1 ')
                                                .trim()
                                                .slice(0, 19); // 16 digits + 3 spaces
                                            setCardDetails({ ...cardDetails, cardNumber: formattedValue });
                                        }}
                                        placeholder="Card Number"
                                        className={cardError && !isValidCardNumber(cardDetails.cardNumber.replace(/\s/g, '')) ? 'error' : ''}
                                    />
                                    {cardError && !isValidCardNumber(cardDetails.cardNumber.replace(/\s/g, '')) && (
                                        <span className="error-message">Please enter a valid 16-digit card number</span>
                                    )}
                                </div>

                                <div className="forms-group">
                                    <input
                                        type="text"
                                        id="cvv"
                                        value={cardDetails.cvv}
                                        onChange={(e) => {
                                            // Only allow numbers, max 4 digits
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            setCardDetails({ ...cardDetails, cvv: value });
                                        }}
                                        placeholder="CVV"
                                        className={cardError && (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) ? 'error' : ''}
                                    />
                                    {cardError && (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) && (
                                        <span className="error-message">CVV must be 3 or 4 digits</span>
                                    )}
                                </div>
                            </div>

                            {/* Save and Place Order Button */}
                            <button className="save" type="button" onClick={handleValidatedPlaceOrder}>
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