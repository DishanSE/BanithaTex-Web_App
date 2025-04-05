import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { ImBin } from "react-icons/im";
import './style/ManageOrders.css';
import { parseISO, format } from 'date-fns';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/allorders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status });
      alert('Order status updated successfully.');
      fetchOrders(); // Refresh the list after updating
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      alert('Order deleted successfully.');
      fetchOrders(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  return (
    <div className="admin-orders-page">
      <Sidebar userType="admin" />
      <div className="admin-orders-container">
        {/* Heading and View Full Details Button */}
        <div className="heading-container">
          <h1>Orders</h1>
          <button
            className="view-details-btn"
            onClick={() => setIsModalOpen(true)} // Open admin-modal with full details
            disabled={orders.length === 0} // Disable if no orders exist
          >
            View Full Details
          </button>
        </div>

        {/* Orders Table */}
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Items</th>
              <th>Quantity</th>
              <th>Placed On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <p key={index}>{item.product_name}</p>
                    ))}
                  </td>
                  <td>{order.total_quantity}</td>
                  <td>{order.placed_on ? format(parseISO(order.placed_on), 'MM-dd-yyyy') : 'N/A'}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteOrder(order.order_id)}
                    >
                      <ImBin />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Order Details */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>All Orders</h2>
              <span className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </span>
            </div>
            <div className="admin-modal-body">
              {orders.length === 0 ? (
                <p>No orders available.</p>
              ) : (
                <table className="full-orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Color</th>
                      <th>Price (per kg)</th>
                      <th>Total Amount</th>
                      <th>P. Method</th>
                      <th>Address</th>
                      <th>Placed On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.flatMap((order) =>
                      order.items.map((item, index) => (
                        <tr key={`${order.order_id}-${index}`}>
                          {index === 0 && (
                            <td rowSpan={order.items.length}>{order.order_id}</td>
                          )}
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              {order.first_name} {order.last_name}
                            </td>
                          )}
                          <td>{item.product_name}</td>
                          <td>{item.quantity} kg</td>
                          <td>{item.color}</td>
                          <td>Rs. {Number(item.price).toFixed(2)}</td>
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              Rs. {order.total_amount}
                            </td>
                          )}
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              {order.payment_method}
                            </td>
                          )}
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              {order.shipping_address}
                            </td>
                          )}
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              {format(new Date(order.placed_on), "MM-dd-yyyy")}
                            </td>
                          )}
                          {index === 0 && (
                            <td rowSpan={order.items.length}>
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleUpdateStatus(order.order_id, e.target.value)
                                }
                              >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </td>
                          )}
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteOrder(order.order_id)}
                            >
                              <ImBin />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;