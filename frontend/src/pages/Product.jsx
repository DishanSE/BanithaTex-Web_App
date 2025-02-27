import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Product.css';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data); // Store the fetched products in state
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    // Group products by type_name and ensure unique product names within each type
    const groupedProducts = products.reduce((acc, product) => {
        const typeName = product.type_name;

        // Ensure the type exists in the accumulator
        if (!acc[typeName]) {
            acc[typeName] = {};
        }

        // Add only the first occurrence of each product name
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
                const uniqueProducts = Object.values(groupedProducts[type]); // Convert grouped products to an array

                return (
                    <section key={type} className="yarn-type">
                        <h2>{type} Yarn</h2>
                        <div className="products-container">
                            {uniqueProducts.map((product) => (
                                <div key={product.id} className="product-item">
                                    {/* Use the image URL from the database */}
                                    <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <button className="buy-now">Buy Now</button>
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