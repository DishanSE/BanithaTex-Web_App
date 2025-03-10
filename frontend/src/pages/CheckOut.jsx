import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const loation = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];

    const handlePlaceOrder = async () => {
        try {
            // Simulate placing an order (replace with actual API call)
            console.log("Placing order with cart items:", cart);
            clearCart(); // Clear cart after placing the order
            alert("Order placed successfully!");
        } catch (err) {
            console.error("Error placing order:", err);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            {selectedProducts.length === 0 ? (
                <p>No items selected for checkout.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {selectedProducts.map((item) => (
                            <div key={item.id} className="cart-item">
                                <h3>{item.name}</h3>
                                <p>Color: {item.color}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: Rs. {Number(item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="summary">
                        <h2>Summary</h2>
                        <p>Subtotal: Rs. {subtotal.toFixed(2)}</p>
                        <p>Shipping Fee: Rs. {shippingFee.toFixed(2)}</p>
                        <p>Estimated Total: Rs. {estimatedTotal.toFixed(2)}</p>
                    </div>
                    <button onClick={handlePlaceOrder}>Place Order</button>
                </>
            )}
        </div>
    );
};

export default Checkout;