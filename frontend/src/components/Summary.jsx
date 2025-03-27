import React from 'react';
import Pay from '../assets/pay.png';
import COD from '../assets/cod.png';

const Summary = ({ selectedItems, cart, onButtonClick, buttonText }) => {
    // Calculate subtotal
    const calculateSubtotal = () => {
        const slectedCart = cart.filter((item) => selectedItems.includes(item.cart_item_id));
        return slectedCart.reduce((total, item) => total + Number(item.price),0);
    };

    const subtotal = calculateSubtotal();
    const shippingFee = 50;
    const estimatedTotal = subtotal + shippingFee;

    return (
        <>
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
                <button onClick={onButtonClick} className="checkout btn">
                    {buttonText}
                </button>
            </div>
            {/* payemt option */}
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
        </>
    )
};

export default Summary;