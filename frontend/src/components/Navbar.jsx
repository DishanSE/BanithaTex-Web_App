import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MdOutlineShoppingCart, MdLogout, MdMenu, MdClose } from "react-icons/md";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Set active link based on current path
    const path = location.pathname;
    if (path === '/') setActiveLink('home');
    else if (path === '/about') setActiveLink('about');
    else if (path === '/product') setActiveLink('product');
    else if (path === '/contact') setActiveLink('contact');
    else if (path === '/login') setActiveLink('login');
    else if (path === '/cart') setActiveLink('cart');
    else if (path.includes('/customer/profile')) setActiveLink('profile');
    else if (path.includes('/admin/dashboard')) setActiveLink('profile');
  }, [location.pathname]);

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfileClick = () => {
    if (userRole === 'customer') {
      navigate('/customer/profile');
      setActiveLink('profile');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
      setActiveLink('profile');
    } else {
      navigate('/');
    }
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
    setActiveLink('home');
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
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container container">
        {/* Left side with logo */}
        <div className="navbar-left">
          <img src={logo} alt="Banitha Tex Logo" className="logo" />
          
          {/* Mobile menu toggle button */}
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
        
        {/* Middle section with navigation links */}
        <div className={`navbar-middle ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <ul className="nav-links">
            <li><Link to='/' onClick={() => setActiveLink('home')} className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}>Home</Link></li>
            <li><Link to='/about' onClick={() => setActiveLink('about')} className={`nav-link ${activeLink === 'about' ? 'active' : ''}`}>About Us</Link></li>
            <li><Link to='/product' onClick={() => setActiveLink('product')} className={`nav-link ${activeLink === 'product' ? 'active' : ''}`}>Product</Link></li>
            <li><Link to='/contact' onClick={() => setActiveLink('contact')} className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`}>Contact Us</Link></li>
            
            {/* Mobile-only items */}
            <li className="mobile-only">
              <Link to='/cart' onClick={() => setActiveLink('cart')} className={`nav-link ${activeLink === 'cart' ? 'active' : ''}`}>
                <MdOutlineShoppingCart className="nav-icon" /> Cart
              </Link>
            </li>
            
            {isLoggedIn ? (
              <li className="mobile-only">
                <Link to={userRole === 'admin' ? '/admin/dashboard' : '/customer/profile'} 
                  onClick={() => setActiveLink('profile')} 
                  className={`nav-link ${activeLink === 'profile' ? 'active' : ''}`}>
                  <FaRegUser className="nav-icon" /> My Profile
                </Link>
                <button onClick={handleLogout} className="mobile-logout">
                  <MdLogout className="nav-icon" /> Logout
                </button>
              </li>
            ) : (
              <li className="mobile-only">
                <Link to='/login' onClick={() => setActiveLink('login')} className={`nav-link ${activeLink === 'login' ? 'active' : ''}`}>
                  <FaRegUser className="nav-icon" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        {/* Right side with actions */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="profile-container">
              <button className={`profile-btn ${activeLink === 'profile' ? 'active-profile' : ''}`} onClick={toggleDropdown}>
                <FaRegUser />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleProfileClick}>
                    <FaRegUser size={20} /> My Profile
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <MdLogout size={20} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login'>
              <button className={`btn ${activeLink === 'login' ? 'active-btn' : ''}`}>
                Login
              </button>
            </Link>
          )}
          <Link to='/cart'>
            <button className={`cart-btn ${activeLink === 'cart' ? 'active-cart' : ''}`}>
              <MdOutlineShoppingCart />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;