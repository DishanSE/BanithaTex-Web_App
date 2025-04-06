import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineShoppingCart, MdLogout } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext.jsx'
import logo from '../assets/logo.png'
import '../styles/Navbar.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const userRole = user?.role;
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    if (userRole === 'customer') {
      navigate('/customer/profile');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer && !profileContainer.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`container ${scrolled ? 'navbar-scrolled' : ''}`}>
        <img src={logo} alt="Banitha Tex Logo" className='logo' />
        <ul>
            <li><Link to='/' onClick={() => setActiveLink('home')} className={`Nav-link ${activeLink === 'home' ? 'active' : ''}`}>Home</Link></li>
            <li><Link to='/about' onClick={() => setActiveLink('about')} className={`Nav-link ${activeLink === 'about' ? 'active' : ''}`}>About Us</Link></li>
            <li><Link to='/product' onClick={() => setActiveLink('product')} className={`Nav-link ${activeLink === 'product' ? 'active' : ''}`}>Product</Link></li>
            <li><Link to='/contact' onClick={() => setActiveLink('contact')} className={`Nav-link ${activeLink === 'contact' ? 'active' : ''}`}>Contact Us</Link></li>
            {isLoggedIn ? (
              <li className='profile-container'>
                <button className="profile-btn" onClick={toggleDropdown}><FaRegUser /></button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      <FaRegUser size={20} /> My Profile
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}> <MdLogout size={20} /> Logout</button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to='/login'><button className="btn">Login</button></Link>
              </li>
            )}
            <li><Link to='/cart'><button className='cart-btn'> <MdOutlineShoppingCart /> </button></Link></li>
        </ul>
    </nav>
  )
}

export default Navbar;