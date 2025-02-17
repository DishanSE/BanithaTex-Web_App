import React from 'react'
import '../styles/Product.css'
import CardedCotton from '../assets/product/carded_cotton.webp'
import Chenille from '../assets/product/chenille.webp'
import CombedCotton from '../assets/product/combed_cotton.webp'
import Linen from '../assets/product/linen.jpeg'
import Nylon from '../assets/product/nylon.webp'
import OrganicCotton from '../assets/product/organic_cotton.jpg'
import PolyCotton from '../assets/product/poly_cotton.webp'
import Polyester from '../assets/product/polyester.jpeg'
import Silk from '../assets/product/silk.webp'
import Spandex from '../assets/product/spandex.jpg'
import WhoolCotton from '../assets/product/wool_cotton.jpg'

const Product = () => {
  return (
    <>
    <div className="product">
      <div className="products-text">
        <h1>Our Products</h1>
      </div>
    </div>

    <section className="yarn-type">
      <h2>Cotton Yarn</h2>
      <div className="products-container">

        <div className="product-item">
          <img src={CardedCotton} alt="Carded Cotton Yarn" />
          <h3>Carded Cotton Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={CombedCotton} alt="Combed Cotton Yarn" />
          <h3>Combed Cotton Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={OrganicCotton} alt="Organic Cotton Yarn" />
          <h3>Organic Cotton Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

      </div>
    </section>

    <section className="yarn-type">
      <h2>Synthetic Yarn</h2>
      <div className="products-container">

        <div className="product-item">
          <img src={Polyester} alt="Polyster Yarn" />
          <h3>Polyster Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={Nylon} alt="Nylon Yarn" />
          <h3>Nylon Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={Spandex} alt="Spandex Yarn" />
          <h3>Spandex Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

      </div>
    </section>

    <section className="yarn-type">
      <h2>Blended Yarn</h2>
      <div className="products-container">

        <div className="product-item">
          <img src={WhoolCotton} alt="Wool-Cotton Blend Yarn" />
          <h3>Wool-Cotton Blend Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={PolyCotton} alt="Poly-Cotton Blend Yarn" />
          <h3>Poly-Cotton Blend Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

      </div>
    </section>

    <section className="yarn-type">
      <h2>Specialty Yarn</h2>
      <div className="products-container">

        <div className="product-item">
          <img src={Silk} alt="Silk Yarn" />
          <h3>Silk Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={Linen} alt="Linen Yarn" />
          <h3>Linen Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

        <div className="product-item">
          <img src={Chenille} alt="Chenille Yarn" />
          <h3>Chenille Yarn</h3>
          <button className="buy-now">Buy Now</button>
        </div>

      </div>
    </section>
    </>
  )
}

export default Product