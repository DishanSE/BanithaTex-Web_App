import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import './style/MyOrders.css';
import { format } from "date-fns";

const MyOrders = () => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    // Fetch user orders
    useEffect(() => {
        if (isLoggedIn && user) {
            fetchOrders();
        }
    }, [isLoggedIn, user]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}/orders`);
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    // Format price with commas and decimal places
    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-us', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Format payment method to capitalize first letter
    const formatPaymentMethod = (method) => {
        return method.charAt(0).toUpperCase() + method.slice(1);
    };

    if (!isLoggedIn) return <p>Please log in to view your orders.</p>;

    return (
        <div className="myorders-page">
            <Sidebar userType="customer" />
            <div className="myorders-container">
                <h1>My Orders</h1>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <>
                        {/* Desktop/tablet view with traditional table */}
                        <div className="table-container">
                            <table className="orders-table desktop-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Placed On</th>
                                        <th>Items</th>
                                        <th>Quantity</th>
                                        <th>Pay. Method</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <React.Fragment key={order.order_id}>
                                            <tr>
                                                <td rowSpan={order.items.length}>{order.order_id}</td>
                                                <td rowSpan={order.items.length}>
                                                    {format(new Date(order.placed_on), "MM-dd-yyyy")}
                                                </td>
                                                <td>{order.items[0].product_name}</td>
                                                <td>{order.items[0].quantity} kg</td>
                                                <td rowSpan={order.items.length}>
                                                    {formatPaymentMethod(order.payment_method)}
                                                </td>
                                                <td rowSpan={order.items.length}>Rs. {formatPrice(order.total)}</td>
                                                <td rowSpan={order.items.length}>{order.status}</td>
                                            </tr>
                                            {order.items.slice(1).map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.quantity} kg</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile view with card layout */}
                        <div className="mobile-cards">
                            {orders.map((order) => (
                                <div className="order-card" key={order.order_id}>
                                    <div className="order-card-header">
                                        <div>
                                            <strong>Order ID:</strong> {order.order_id}
                                        </div>
                                        <div>
                                            <strong>Date:</strong> {format(new Date(order.placed_on), "MM-dd-yyyy")}
                                        </div>
                                    </div>
                                    
                                    <div className="order-card-items">
                                        <strong>Items:</strong>
                                        {order.items.map((item, index) => (
                                            <div className="order-card-item" key={index}>
                                                <span>{item.product_name}</span>
                                                <span>{item.quantity} kg</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="order-card-footer">
                                        <div>
                                            <strong>Payment:</strong> {formatPaymentMethod(order.payment_method)}
                                        </div>
                                        <div>
                                            <strong>Total:</strong> Rs. {formatPrice(order.total)}
                                        </div>
                                        <div>
                                            <strong>Status:</strong> {order.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyOrders;