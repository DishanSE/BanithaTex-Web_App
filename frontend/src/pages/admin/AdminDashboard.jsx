import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './style/AdminDashboard.css';
import { FaUsers, FaBoxes, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { format } from "date-fns";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentCustomers, setRecentCustomers] = useState([]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total customers
                const customersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/total-customers`);
                const totalCustomers = customersResponse.data.total_customers;

                // Fetch total products
                const productsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/total-products`);
                const totalProducts = productsResponse.data.total_products;

                // Fetch total orders
                const ordersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/total-orders`);
                const totalOrders = ordersResponse.data.total_orders;

                // Fetch total sales
                const salesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/total-sales`);
                const totalSales = salesResponse.data.total_sales;

                // Fetch recent orders
                const recentOrdersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/recent-orders`);
                const recentOrders = recentOrdersResponse.data;

                // Fetch recent customers
                const recentCustomersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/recent-customers`);
                const recentCustomers = recentCustomersResponse.data;

                // Update state
                setStats({
                    totalCustomers,
                    totalProducts,
                    totalOrders,
                    totalSales,
                });
                setRecentOrders(recentOrders);
                setRecentCustomers(recentCustomers);
            } catch (err) {
                console.error('Error fetching dashboard data:', err.response?.data || err.message);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="admin-dashboard-page">
            <Sidebar userType="admin" />
            <div className="admin-dashboard-container">
                {/* Header */}
                <h1>Admin Dashboard</h1>

                {/* Cards Section */}
                <div className="dashboard-cards">
                    <div className="card">
                        <FaUsers className="card-icon" />
                        <h3>Total Customers</h3>
                        <p>{stats.totalCustomers}</p>
                    </div>
                    <div className="card">
                        <FaBoxes className="card-icon" />
                        <h3>Total Products</h3>
                        <p>{stats.totalProducts}</p>
                    </div>
                    <div className="card">
                        <FaShoppingCart className="card-icon" />
                        <h3>Total Orders</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                    <div className="card">
                        <FaDollarSign className="card-icon" />
                        <h3>Total Sales</h3>
                        <p>Rs. {parseFloat(stats.totalSales).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</p>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="recent-orders">
                    <h2>Recent Orders</h2>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Order Date</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer_name} {order.lastName}</td>
                                        <td>{format(new Date(order.created_at), "MM-dd-yyyy")}</td>
                                        <td>Rs. {parseFloat(order.total_amount).toLocaleString('en-us', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No recent orders.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Recent Customers Table */}
                <div className="recent-customers">
                    <h2>Recent Customers</h2>
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCustomers.length > 0 ? (
                                recentCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.first_name} {customer.last_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{format(new Date(customer.created_at), "MM-dd-yyyy")}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No recent customers.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;