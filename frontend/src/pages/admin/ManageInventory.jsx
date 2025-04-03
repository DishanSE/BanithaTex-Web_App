import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './style/ManageInventory.css';
import { AiFillEdit } from "react-icons/ai";
import { ImBin } from "react-icons/im";

const ManageInventory = () => {
    const [products, setProducts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        color: '',
        stock_quantity: 0,
        image_url: '',
        type_id: '',
        count_id: '',
    });
    const [yarnTypes, setYarnTypes] = useState([]); // Available yarn types
    const [yarnCounts, setYarnCounts] = useState([]); // Available yarn counts

    // Fetch all products, yarn types, and yarn counts
    useEffect(() => {
        fetchProducts();
        fetchYarnTypes();
        fetchYarnCounts();
    }, []);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    // Fetch available yarn types
    const fetchYarnTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/yarn-types');
            setYarnTypes(response.data);
        } catch (err) {
            console.error('Error fetching yarn types:', err);
        }
    };

    // Fetch available yarn counts
    const fetchYarnCounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/yarn-counts');
            setYarnCounts(response.data);
        } catch (err) {
            console.error('Error fetching yarn counts:', err);
        }
    };

    // Open modal for editing a product
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    // Update product details
    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const { id, name, description, price, color, stock_quantity, image_url, type_id, count_id } = selectedProduct;

            await axios.put(`http://localhost:5000/api/products/${id}`, {
                name,
                description,
                price,
                color,
                stock_quantity,
                image_url,
                type_id,
                count_id,
            });

            alert('Product updated successfully.');
            setIsEditModalOpen(false); // Close the modal
            fetchProducts(); // Refresh the list after updating
        } catch (err) {
            console.error('Error updating product:', err.response?.data || err.message);
            alert('Failed to update product. Please try again.');
        }
    };

    // Handle Add New Product Modal
    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            const { name, description, price, color, stock_quantity, image_url, type_id, count_id } = newProduct;

            await axios.post('http://localhost:5000/api/products', {
                name,
                description,
                price,
                color,
                stock_quantity,
                image_url,
                type_id,
                count_id,
            });

            alert('Product added successfully.');
            setIsAddModalOpen(false); // Close the modal
            fetchProducts(); // Refresh the list after adding
            setNewProduct({
                name: '',
                description: '',
                price: 0,
                color: '',
                stock_quantity: 0,
                image_url: '',
                type_id: '',
                count_id: '',
            }); // Reset form fields
        } catch (err) {
            console.error('Error adding product:', err.response?.data || err.message);
            alert('Failed to add product. Please try again.');
        }
    };

    // Delete a product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`);
            alert('Product deleted successfully.');
            fetchProducts(); // Refresh the product list
        } catch (err) {
            console.error('Error deleting product:', err.response?.data || err.message);
            alert('Failed to delete product. Please try again.');
        }
    };

    return (
        <div className="admin-inventory-page">
            <Sidebar userType="admin" />
            <div className="admin-inventory-container">
                {/* Heading and Add New Product Button */}
                <div className="heading-container">
                    <h1>Inventory</h1>
                    <button className="view-details-btn" onClick={() => setIsAddModalOpen(true)}>
                        Add New Product
                    </button>
                </div>

                {/* Products Table */}
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Yarn Type</th>
                            <th>Count Value</th>
                            <th>Quantity</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="8">No products found.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.color}</td>
                                    <td>{product.type_name}</td>
                                    <td>{product.count_value}</td>
                                    <td>{product.stock_quantity}</td>
                                    <td>{new Date(product.last_updated).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className='delete-btn'
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <AiFillEdit />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className='delete-btn'
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <ImBin />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Product Modal */}
            {isEditModalOpen && selectedProduct && (
                <div className="update-modal-overlay">
                    <div className="update-modal-content">
                        <div className="update-modal-header">
                            <h2>Edit Product</h2>
                            <span className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                                &times;
                            </span>
                        </div>
                        <form className="update-modal-body" onSubmit={handleUpdateProduct}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={selectedProduct.name}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={selectedProduct.description}
                                    rows={1}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Price:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={selectedProduct.price}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            price: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Color:
                                <input
                                    type="text"
                                    value={selectedProduct.color}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            color: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Stock Quantity:
                                <input
                                    type="number"
                                    value={selectedProduct.stock_quantity}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            stock_quantity: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Image URL:
                                <input
                                    type="text"
                                    value={selectedProduct.image_url}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            image_url: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Yarn Type:
                                <select
                                    value={selectedProduct.type_id}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            type_id: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    <option value="">Select Yarn Type</option>
                                    {yarnTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Yarn Count:
                                <select
                                    value={selectedProduct.count_id}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            count_id: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    <option value="">Select Yarn Count</option>
                                    {yarnCounts.map((count) => (
                                        <option key={count.id} value={count.id}>
                                            {count.count_value}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit" className="save-btn">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add New Product Modal */}
            {isAddModalOpen && (
                <div className="update-modal-overlay">
                    <div className="update-modal-content">
                        <div className="update-modal-header">
                            <h2>Add New Product</h2>
                            <span className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                                &times;
                            </span>
                        </div>
                        <form className="update-modal-body" onSubmit={handleAddProduct}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={newProduct.description}
                                    rows={1}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Price:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            price: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Color:
                                <input
                                    type="text"
                                    value={newProduct.color}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            color: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Stock Quantity:
                                <input
                                    type="number"
                                    value={newProduct.stock_quantity}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            stock_quantity: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Image URL:
                                <input
                                    type="text"
                                    value={newProduct.image_url}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            image_url: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Yarn Type:
                                <select
                                    value={newProduct.type_id}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            type_id: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    <option value="">Select Yarn Type</option>
                                    {yarnTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Yarn Count:
                                <select
                                    value={newProduct.count_id}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            count_id: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    <option value="">Select Yarn Count</option>
                                    {yarnCounts.map((count) => (
                                        <option key={count.id} value={count.id}>
                                            {count.count_value}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit" className="save-btn">
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageInventory;