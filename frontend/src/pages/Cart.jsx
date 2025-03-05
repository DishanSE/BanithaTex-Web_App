import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import '../styles/Cart.css'

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id}>
                                Product ID: {item.product_id}
                                Quantity: {item.quantity}
                                Color: {item.color}
                                Price: Rs. {Number(item.price).toFixed(2)} {/* Convert to number */}
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={clearCart}>Clear Cart</button>
                </>
            )}
        </div>
    );
};

export default Cart;