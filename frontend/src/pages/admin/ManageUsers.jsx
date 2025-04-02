import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar.jsx';
import './style/ManageUsers.css';
import { ImBin } from "react-icons/im";

const ManageUsers = () => {
  const [customers, setCustomers] = useState([]);

  // Fetch all customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      alert('Customer deleted successfully.');
      fetchCustomers(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer. Please try again.');
    }
  }

  return (
    <div className="admin-customers-page">
      <Sidebar userType="admin" />
      <div className="admin-customers-container">
        <h1>Customers</h1>
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Contact No</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="7">No customers found.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.contact_no || 'N/A'}</td>
                  <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteCustomer(customer.id)}
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
    </div>
  );
}

export default ManageUsers;