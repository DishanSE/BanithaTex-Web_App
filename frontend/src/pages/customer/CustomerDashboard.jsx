import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './style/CustomerDashboard.css'
import { AuthContext } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <Sidebar userType="customer" />
      <div className="customer-content">
        <h1>Welcome "Customer Name" </h1>
        <p>Manage your account and view your orders here.</p>
      </div>
    </div>
  );
}

export default CustomerDashboard;