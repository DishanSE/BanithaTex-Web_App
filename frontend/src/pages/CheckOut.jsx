import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);

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
            {cart.length === 0 ? (
                <p>Your cart is empty. Please add items to proceed.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <p>Product ID: {item.product_id}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Color: {item.color}</p>
                                <p>Price: Rs. {item.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={handlePlaceOrder}>Place Order</button>
                </>
            )}
        </div>
    );
};

export default Checkout;