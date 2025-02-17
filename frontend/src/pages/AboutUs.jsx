import React from 'react'
import About from '../assets/about.jpg'
import '../styles/AboutUs.css'
import { TbTargetArrow } from "react-icons/tb";
import { PiEyesBold } from "react-icons/pi";

const AboutUs = () => {
  return (
    <>
    <div className="abouts container">
        <div className="abouts-text">
          <h1>About Us...</h1>
        </div>
      </div>
    <section className="about-container">
      
      <div className="about-content">
        <div className="about-image">
          <img src={About} alt="about image" />
        </div>
        <div className="about-text">
          <h2>About US</h2>
          <div className="heading-bar"></div>
          <p>Banitha Tex excels in importing and exporting premium yarns for the textile, 
            fashion, and home décor industries. We bridge the gap between global yarn suppliers and manufacturers, 
            ensuring a seamless supply chain. Our diverse offerings include cotton, polyester, silk, and blended 
            yarns designed to meet the high standards of our clients</p>
        </div>
      </div>
    </section>

    <section className="mission-container">
        <div className="mission-box">
          <h2>Our Mission <TbTargetArrow /></h2>
          <p>To provide top-quality yarn to businesses worldwide with efficiency and reliability.</p>
          <p>To embrace innovation and sustainable practices in the textile industry.</p>
          <p>To ensure seamless import and export operations with exceptional customer service.</p>
          <p>To build long-term relationships with clients through trust and excellence.</p>
          <p>To continuously evolve with modern technologies for better product quality and business.</p>
        </div>

        <div className="mission-box">
          <h2>Our Vision <PiEyesBold /></h2>
          <p>To be a global leader in the yarn industry by delivering unparalleled value to our customers.</p>
          <p>To promote eco-friendly solutions and sustainable growth in the textile sector.</p>
          <p>To expand our network of suppliers and partners worldwide.</p>
          <p>To empower businesses with innovative yarn solutions tailored to their needs.</p>
          <p>To foster a culture of excellence, integrity, and teamwork within our organization.</p>
        </div>
      </section>
    </>
  )
}

export default AboutUs