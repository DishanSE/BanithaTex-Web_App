import React, { useEffect } from 'react';
import '../styles/ContactUs.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Conatct from '../assets/contact.webp'
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';



const ContactUs = () => {
  const form = useRef();
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_y735w6y',
      'template_cm5s1c9',
      form.current,
      'v5_uYGX1TuCTy3rBJ'
    )
    .then(
      (result) => {
        console.log(result.text);
        setMessage('Message sent successfully!');
      },
      (error) => {
        console.log(error.text);
        setMessage('Failed to send message. Try again later.');
      }
    );
    e.target.reset();
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
    <div className="contact container">
        <div className="contact-text">
          <h1>Contact Us...</h1>
        </div>
    </div>

    <div className="contact-info">

      <div className="info-box">
        <FaPhone className='icon'/>
        <div className="info-text">
          <p>Call us</p>
          <p>+947 7833 0417 </p>
        </div>
      </div>

      <div className="info-box">
        <FaEnvelope className='icon'/>
        <div className="info-text">
          <p>Email us</p>
          <p>BANITHATEX11@GMAIL.COM </p>
        </div>
      </div>

      <div className="info-box">
        <FaMapMarkerAlt className='icon'/>
        <div className="info-text">
          <p>Visit us</p>
          <p>NO 225, DUWA ROAD, MABOLE, WATTALA, SRI LANKA</p>
        </div>
      </div>

      <div className="info-box">
        <FaClock className='icon'/>
        <div className="info-text">
          <p>Working Hours</p>
          <p>Mon-Sat: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>

    <div className="contact-form-section">
      <div className="contact-image">
        <img src={Conatct} alt="contact image" loading='lazy'/>
      </div>

      <div className="contact-form">
        <form ref={form} onSubmit={sendEmail}>
          <div className='form-row'>
            <input type="text" name='user_name' placeholder="Name" required/>
            <input type="tel" name='user_phone' placeholder="Phone" No required/>
          </div>
          <input type="email" name='user_email' placeholder="Email" required/>
          <textarea name='message' placeholder="Message" rows={4} required></textarea>
          <button type='submit'>CONTACT US</button>
        </form>
        {message && <p className="message-feedback">{message}</p>}
      </div>
    </div>

    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0574843664367!2d79.89611367475777!3d7.002513592998757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f7eaf672830d%3A0x2123653b845bd7b5!2sDuwa%20Road%2C%20Wattala%2011300!5e0!3m2!1sen!2slk!4v1739636209067!5m2!1sen!2slk"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
    </div>
    </>
  )
}

export default ContactUs