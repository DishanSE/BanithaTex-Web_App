import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Product.css';
import Loader from '../assets/loader.gif'
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div class="loader"><img src={Loader} /></div>;
    if (error) return <p>{error}</p>;

    // Group products by type_name and ensure unique product names within each type
    const groupedProducts = products.reduce((acc, product) => {
        const typeName = product.type_name;
        if (!acc[typeName]) {
            acc[typeName] = {};
        }
        if (!acc[typeName][product.name]) {
            acc[typeName][product.name] = product;
        }

        return acc;
    }, {});

    return (
        <>
            <div className="product">
                <div className="products-text">
                    <h1>Our Products</h1>
                </div>
            </div>

            {/* Render products grouped by type */}
            {Object.keys(groupedProducts).map((type) => {
                const uniqueProducts = Object.values(groupedProducts[type]);

                return (
                    <section key={type} className="yarn-type">
                        <h2>{type} Yarn</h2>
                        <div className="products-container">
                            {uniqueProducts.map((product) => (
                                <div key={product.id} className="product-item">
                                    {/* Use the image URL from the database */}
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}${product.image_url}`} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <button onClick={() => navigate(`/product/${product.id}`)} className="buy-now">Buy Now</button>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}
        </>
    );
};

export default Product;