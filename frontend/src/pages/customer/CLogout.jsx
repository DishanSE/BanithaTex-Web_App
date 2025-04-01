import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import './style/CLogout.css'
import { useNavigate } from 'react-router-dom'

const CLogout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  return (
    <div className='c-logout-page'>
      <Sidebar userType='customer'/>
      <div className="c-logout-container">
        <h1>Confirm Log Out</h1>
        <div className="logout-info">
          <p>Are you sure you want to logout?</p>
          <button className='btn' onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  )
}

export default CLogout