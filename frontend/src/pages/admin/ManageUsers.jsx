import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar.jsx';
import './style/ManageUsers.css';
import { ImBin } from "react-icons/im";
import { AiFillEdit } from "react-icons/ai";

const ManageUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
  };

  // Open modal for editing a customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer); // Set the selected customer
    setIsModalOpen(true); // Open the modal
  };

  // Update customer profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const { id, first_name, last_name, email, gender, contact_no } = selectedCustomer;
      await axios.put(`http://localhost:5000/api/users/${id}`, {
        firstName: first_name,
        lastName: last_name,
        email,
        gender,
        contactNo: contact_no,
      });

      alert('User profile updated successfully.');
      setIsModalOpen(false); // Close the modal
      fetchCustomers(); // Refresh the list after updating
    } catch (err) {
      console.error('Error updating user profile:', err.response?.data || err.message);
      alert('Failed to update user profile. Please try again.');
    }
  };

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
                <td colSpan="8">No customers found.</td>
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
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <AiFillEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal for Editing Customer */}
        {isModalOpen && selectedCustomer && (
          <div className="user-modal-overlay">
            <div className="user-modal-content">
              <div className="user-modal-header">
                <h2>Edit Customer</h2>
                <span className="close-btn" onClick={() => setIsModalOpen(false)}>
                  &times;
                </span>
              </div>
              <form className="user-modal-body" onSubmit={handleUpdateProfile}>
                <label>
                  First Name:
                  <input
                    type="text"
                    value={selectedCustomer.first_name}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        first_name: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={selectedCustomer.last_name}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        last_name: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={selectedCustomer.email}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        email: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Gender:
                  <select
                    value={selectedCustomer.gender}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Contact No:
                  <input
                    type="text"
                    value={selectedCustomer.contact_no || ''}
                    onChange={(e) =>
                      setSelectedCustomer({
                        ...selectedCustomer,
                        contact_no: e.target.value,
                      })
                    }
                  />
                </label>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;