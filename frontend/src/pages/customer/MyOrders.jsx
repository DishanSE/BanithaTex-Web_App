import React from 'react';

const MyOrders = () => {
    const orders = [
        { id: 1, placedOn: '2023-10-01', items: 'Product A', quantity: 2, total: 500, status: 'Delivered' },
        { id: 2, placedOn: '2023-10-05', items: 'Product B', quantity: 1, total: 300, status: 'Shipped' },
        { id: 3, placedOn: '2023-10-10', items: 'Product C', quantity: 3, total: 900, status: 'Processing' },
    ];

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <table>
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
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.placedOn}</td>
                            <td>{order.items}</td>
                            <td>{order.quantity}</td>
                            <td>Rs. {order.total.toFixed(2)}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyOrders;