import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart } = useContext(CartContext);
    const { isLoggedIn } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [counts, setCounts] = useState([]); // All count values for the product
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for selected options
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedCount, setSelectedCount] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch product details, colors, and counts from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
                setProduct(productResponse.data);
                setCalculatedPrice(productResponse.data.price);

                // Handle color
                if (productResponse.data.color_value) {
                    setSelectedColor(productResponse.data.color_value);
                } else {
                    setSelectedColor("");
                }

                // Handle count
                if (productResponse.data.count_value) {
                    setSelectedCount(productResponse.data.count_value);
                } else {
                    setSelectedCount("");
                }

                // Fetch all colors for the product
                const colorsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/colors`);
                setColors(colorsResponse.data);

                // Set default color
                if (colorsResponse.data.length > 0) {
                    setSelectedColor(colorsResponse.data[0]);
                }

                // Fetch all count values for the product
                const countsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/counts/${productResponse.data.color}`);
                setCounts(countsResponse.data);

                // Fetch all products for similar products section
                const allProductsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
                setAllProducts(allProductsResponse.data);

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

    // Ensure unique product names in similar products
    const similarProducts = [...new Map(
        allProducts
            .filter((item) => item.name !== product.name) // Exclude the current product
            .map((item) => [item.name, item]) // Use the product name as the key
    ).values()];

    // Handle quantity change
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0 && newQuantity <= product.stock_quantity) {
            setQuantity(newQuantity);
            setCalculatedPrice(product.price * newQuantity);
        }
    };

    const handleColorChange = async (e) => {
        const selectedColor = e.target.value;
        setSelectedColor(selectedColor);

        // Fetch counts for the selected color
        try {
            const countsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/counts/${selectedColor}`);
            if (countsResponse.data.length === 0) {
                console.warn("No counts available for the selected color.");
                setCounts([]); // Reset counts to an empty array
                setSelectedCount(""); // Reset selected count
            } else {
                setCounts(countsResponse.data);
            }
        } catch (error) {
            console.error("Error fetching counts:", error);
            alert("Failed to fetch counts. Please try again.");
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            alert("Please log in to add items to your cart.");
            return;
        }
        try {
            const selectedOptions = {
                color: selectedColor,
                count: selectedCount, // This is now the ID of the count
                quantity: quantity,
            };
            await addToCart(product, selectedOptions);
            setSuccessMessage(`${product.name} has been added to the cart!`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error adding item to cart:", err);
            alert("Failed to add item to cart. Please try again.");
        }
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            alert("Please log in to proceed with the purchase.");
            return;
        }

        // Prepare the selected product data
        const selectedProduct = {
            cart_item_id: Date.now(), // Temporary ID for the item
            product_id: product.id,
            product_name: product.name,
            product_image: product.image_url,
            price: calculatedPrice,
            quantity: quantity,
            color: selectedColor,
            selected_count_id: selectedCount,
        };

        // Navigate to the checkout page with the selected product
        navigate('/checkout', { state: { selectedProducts: [selectedProduct] } });
    };

    if (!product) return <p>Loading product details...</p>;

    return (
        <>
            <div className="product-detail">
                <div className="product-container">
                    <div className="product-image">
                        <img src={`${import.meta.env.VITE_BACKEND_URL}${product?.image_url}`} alt={product.name} />
                    </div>

                    <div className="product-info">
                        <h1 className='name'>{product.name}</h1>
                        <p className="price">Rs. {calculatedPrice.toFixed(2)} <small>(per kg)</small></p>

                        {/* Color Dropdown */}
                        <div className="form-group">
                            <label htmlFor="color">Choose Color:</label>
                            <select id="color" value={selectedColor} onChange={handleColorChange}>
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
                            <select id="count" value={selectedCount} onChange={(e) => setSelectedCount(e.target.value)}>
                                <option value="">Select Count</option>
                                {counts.length > 0 ? (
                                    counts.map((count) => (
                                        <option key={count.id} value={count.id}>
                                            {count.count_value}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No counts available</option>
                                )}
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
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                        </div>

                        <div className="buttons">
                            <button className="btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
                            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
                        </div>

                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>

                {/* Similar Products Section */}
                <section className="similar-products">
                    <h2>Similar Products</h2>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={4}
                        navigation
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        className='swiper-container'
                    >
                        {similarProducts.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="product-item">
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}${item.image_url}`} alt={item.name} />
                                    <h3>{item.name}</h3>
                                    <button onClick={() => navigate(`/product/${item.id}`)} className="buy-now">Buy Now</button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
            </div>
        </>
    );
};

export default ProductDetail;