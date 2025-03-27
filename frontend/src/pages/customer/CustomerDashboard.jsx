import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './style/CustomerDashboard.css'
import { AuthContext } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className='cutomer-dashboard'>
      <h2>My Account</h2>
      <div className="tabs">
        <Link to="/cutomer/profile" className='tab-link'> My Profile </Link>
        <Link to="/cutomer/orders" className='tab-link'> My Orders </Link>
        <button onClick={handleLogout}> Log Out </button>
      </div>
    </div>
  )
}

export default CustomerDashboard;