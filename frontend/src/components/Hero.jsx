import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Hero.css'
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="hero container">
      <div className="hero-text">
        <h1>Banitha Tex</h1>
        <p>Your Gateway to Quality Yarn...</p>
        <Link to='./about'><button className='btn'>Explore more... <ArrowRight /> </button></Link>
      </div>
    </div>
  )
}

export default Hero