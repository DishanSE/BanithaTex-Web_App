import React from 'react'
import Sidebar from '../../components/Sidebar';
import './style/AdminDashboard.css'

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar userType="admin" />
      <div className="admin-content">
        <h1 className='a-heaing'>Welcome to the Admin Dashboard</h1>
        <p className='a-para'>Manage inventory, orders, users, and generate reports here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard