const { router } = require('../app');
const db = require('../config/db'); // Database connection

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


// Add a new product 
exports.addProduct = async (req, res) => {
    try {
        const {name, description, price, stock_quantity, image_url} = req.body;
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock_quantity, image_url) VALUES (?,?,?,?,?)',
            [name, description, price, stock_quantity, image_url]
        );
        res.status(201).json({message: 'Product added successfully!', productId: result.insertId});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
      const {name, description, price, stock_quantity, image_url} = req.body;
      const [result] = await db.query(
        'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ? WHERE id = ?',
        [name, description, price, stock_quantity, image_url, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
      const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};