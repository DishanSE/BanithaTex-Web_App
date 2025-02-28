import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [counts, setCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details, colors, and counts from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`http://localhost:5000/api/products/${id}`);    
                const colorsResponse = await axios.get(`http://localhost:5000/api/products/${id}/colors`);    
                const countsResponse = await axios.get(`http://localhost:5000/api/products/${id}/counts`);
                setProduct(productResponse.data);
                setColors(colorsResponse.data);
                setCounts(countsResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="product-detail">
                <div className="product-container">
                    <div className="product-image">
                        <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
                    </div>

                    <div className="product-info">
                        <h1 className='name'>{product.name}</h1>
                        <p className="price">Rs. {product.price.toFixed(2)} per kg</p>

                        {/* Color Dropdown */}
                        <div className="form-group">
                            <label htmlFor="color">Choose Color:</label>
                            <select id="color" defaultValue={colors[0]}>
                                {colors.map((color, index) => (
                                    <option key={index} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Count Dropdown */}
                        <div className="form-group">
                            <label htmlFor="count">Choose Count Value:</label>
                            <select id="count" defaultValue={counts[0]}>
                                {counts.map((count, index) => (
                                    <option key={index} value={count}>
                                        {count}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity Input */}
                        <div className="form-group">
                            <label htmlFor="quantity">Choose Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={product.stock_quantity}
                                defaultValue="1"
                            />
                        </div>

                        <div className="buttons">
                            <button className="buyy">Buy Now</button>
                            <button className="add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h1>Similar Products</h1>
            </div>
        </>
    );
};

export default ProductDetail;