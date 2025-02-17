import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import '../styles/Footer.css';


function Footer() {
  return (
    <footer className='footer'>
      <div className="footer-nav">
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About Us</Link></li>
          <li><Link to='/product'>Product</Link></li>
          <li><Link to='/contact'>Contact Us</Link></li>
        </ul>
      </div>

      <div className="footer-brand">
        <h2>Banitha Tex</h2>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </div>

      <div className="footer-social">
        <h2>Follow Us:</h2>
        <a className='social-btn' href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF  /></a>
        <a className='social-btn' href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram  /></a>
        <a className='social-btn' href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter  /></a>
      </div>
    </footer>
  );
};

export default Footer;