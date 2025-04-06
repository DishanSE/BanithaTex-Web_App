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

    if (!isLoggedIn) return <p>Please log in to view your orders.</p>;

    return (
        <div className="myorders-page">
            <Sidebar userType="customer" />
            <div className="myorders-container">
                <h1>My Orders</h1>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Placed On</th>
                                <th>Items</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody >
                            {orders.map((order) => (
                                <React.Fragment key={order.order_id}>
                                    <tr>
                                        <td rowSpan={order.items.length}>{order.order_id}</td>
                                        <td rowSpan={order.items.length}>
                                            {format(new Date(order.placed_on), "MM-dd-yyyy")}
                                        </td>
                                        <td>{order.items[0].product_name}</td>
                                        <td>{order.items[0].quantity}</td>
                                        <td rowSpan={order.items.length}>Rs. {parseFloat(order.total).toLocaleString('en-us', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}</td>
                                        <td rowSpan={order.items.length}>{order.status}</td>
                                    </tr>
                                    {order.items.slice(1).map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyOrders;