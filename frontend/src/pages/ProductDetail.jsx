import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details from the backend
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                console.log(response.data)
                setProduct(response.data); // Store the fetched product in state
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
            <p>{product.description}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Stock Quantity: {product.stock_quantity}</p>
            <p>Type: {product.type_name}</p>
            <p>Count: {product.count_value}</p>
        </div>
    );
};

export default ProductDetail;