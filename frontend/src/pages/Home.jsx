import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import About from '../assets/about.jpg'
import BackgroundImage from '../assets/background_img.jpg'
import Cotton from '../assets/cotton.webp'
import Synthetic from '../assets/Synthetic.jpg'
import Blended from '../assets/blended.jpg'
import Specialty from '../assets/Speciality.jpg'
import '../styles/Home.css'

const Home = () => {
  return (
    <>
    <Hero />
    <section className="home-container">

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
            yarns designed to meet the high standards of our clients...<Link to='/about'><span className='more'>More</span></Link> </p>
        </div>
      </div>

      <div className="product-content">
        <div className="product-img">
          <img src={ BackgroundImage } alt="" />
        </div>
        <div className="product-text">
          <h1>Quality Yarn for <br /> All Needs</h1>
          <div className="product-bar"></div>
          <p>Empoering your creativity...<Link to='/product'><span className='more'>More</span></Link></p>
        </div>
      </div>

      <div className="services-content">
        <h2>Services</h2>
        <div className="services-container">

          <div className="service-item">
            <h3>Custom Yarn Bending</h3>
            <p>Creating customized yarn blends tailored to meet specific requirements for diverse industry applications.</p>
          </div>

          <div className="service-item">
            <h3>Yarn Export</h3>
            <p>Distributing a wide range of yarn types to markets around the world, ensuring timely delivery and excellent quality.</p>
          </div>

          <div className="service-item">
            <h3>Yarn Import</h3>
            <p>Sourcing premium yarn materials from top international suppliers to provide you with the best quality.</p>
          </div>

        </div>
      </div>

      <div className="product-categories">
        <h2>Product Categories</h2>
        <div className="categories-container">

          <Link to='/product'>
            <div className="category-item">
              <div className="category-image">
                <img src={Cotton} alt="cotton yarn" />
              </div>
              <p>Cotton Yarn</p>
            </div>
          </Link>

          <Link to='/product'>
            <div className="category-item">
              <div className="category-image">
                <img src={Synthetic} alt="synthetic yarn" />
              </div>
              <p>Synthetic Yarn</p>
            </div>
          </Link>

          <Link to='/product'>
            <div className="category-item">
              <div className="category-image">
                <img src={Blended} alt="blended yarn" />
              </div>
              <p>Blended Yarn</p>
            </div>
          </Link>

          <Link to='/product'>
            <div className="category-item">
              <div className="category-image">
                <img src={Specialty} alt="specialty yarn" />
              </div>
              <p>Specialty Yarn</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
    </>
  )
}

export default Home;