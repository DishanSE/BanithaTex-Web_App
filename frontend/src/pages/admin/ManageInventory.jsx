import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './style/ManageInventory.css';
import { AiFillEdit } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import { parseISO, format } from 'date-fns';

const ManageInventory = () => {
    const [products, setProducts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        color: '',
        stock_quantity: 0,
        image: null,
        type_id: '',
        count_id: '',
    });
    const [yarnTypes, setYarnTypes] = useState([]);
    const [yarnCounts, setYarnCounts] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchYarnTypes();
        fetchYarnCounts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const fetchYarnTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/yarn-types');
            setYarnTypes(response.data);
        } catch (err) {
            console.error('Error fetching yarn types:', err);
        }
    };

    const fetchYarnCounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/yarn-counts');
            setYarnCounts(response.data);
        } catch (err) {
            console.error('Error fetching yarn counts:', err);
        }
    };

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
                price: Number(price),
                color,
                stock_quantity: Number(stock_quantity),
                image_url,
                type_id: Number(type_id),
                count_id: Number(count_id),
            });

            alert('Product updated successfully.');
            setIsEditModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.error('Error updating product:', err.response?.data || err.message);
            alert('Failed to update product. Please try again.');
        }
    };

    // Handle Add New Product Modal
    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            // Convert the image file to Base64
            let base64Image = '';
            if (newProduct.image) {
                const reader = new FileReader();
                base64Image = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result.split(',')[1]); // Extract Base64 data
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(newProduct.image); // Read the file as Data URL
                });
            }

            // Prepare the product data with the Base64-encoded image
            const { name, description, price, color, stock_quantity, type_id, count_id } = newProduct;

            await axios.post('http://localhost:5000/api/products', {
                name,
                description,
                price,
                color,
                stock_quantity,
                image_url: base64Image, // Send the Base64-encoded image
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
                image: null, // Reset the image field
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
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err.response?.data || err.message);
            alert('Failed to delete product. Please try again.');
        }
    };

    return (
        <div className="admin-inventory-page">
            <Sidebar userType="admin" />
            <div className="admin-inventory-container">
                <div className="heading-container">
                    <h1>Inventory</h1>
                    <button className="view-details-btn" onClick={() => setIsAddModalOpen(true)}>
                        Add New Product
                    </button>
                </div>

                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Type</th>
                            <th>Color</th>
                            <th>Count Value</th>
                            <th>Available Stock</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="9">No products found.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.type_name}</td>
                                    <td>{product.color}</td>
                                    <td>{product.count_value}</td>
                                    <td>{product.stock_quantity} kg</td>
                                    <td>
                                        {product.updated_at ? format(parseISO(product.updated_at), 'MM-dd-yyyy') : 'N/A'}
                                    </td>
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
                                    required
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
                                            price: e.target.value,
                                        })
                                    }
                                    required
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
                                    required
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
                                            stock_quantity: e.target.value,
                                        })
                                    }
                                    required
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
                                            type_id: e.target.value,
                                        })
                                    }
                                    required
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
                                            count_id: e.target.value,
                                        })
                                    }
                                    required
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
                                    required
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
                                            price: e.target.value,
                                        })
                                    }
                                    required
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
                                    required
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
                                            stock_quantity: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </label>
                            <label>
                                Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                                />
                            </label>
                            <label>
                                Yarn Type:
                                <select
                                    value={newProduct.type_id}
                                    onChange={(e) => {
                                        console.log("Selected type_id:", e.target.value);
                                        setNewProduct({
                                            ...newProduct,
                                            type_id: e.target.value,
                                        });
                                    }}
                                    required
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
                                    onChange={(e) => {
                                        console.log("Selected count_id:", e.target.value);
                                        setNewProduct({
                                            ...newProduct,
                                            count_id: e.target.value,
                                        });
                                    }}
                                    required
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