const { route } = require('../app.js')
const db = require('../config/db'); // Database connection

// Get all products with yarn type, subtype, and count details
exports.getProducts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.price, 
                p.stock_quantity, 
                p.image_url,
                yt.name AS type_name,
                yc.count_value
            FROM products p
            JOIN yarn_types yt ON p.type_id = yt.id
            JOIN yarn_counts yc ON p.count_id = yc.id
        `);

        const products = rows.map(row => ({
          ...row,
          price: parseFloat(row.price)
        }));
        
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get product by ID with yarn type, subtype, and count details
exports.getProductById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.price, 
                p.stock_quantity, 
                p.image_url,
                yt.name AS type_name,
                yc.count_value
            FROM products p
            JOIN yarn_types yt ON p.type_id = yt.id
            JOIN yarn_counts yc ON p.count_id = yc.id
            WHERE p.id = ?
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, image_url, type_id, subtype_id, count_id } = req.body;

        // Validate that type_id exists in yarn_types
        const [typeRows] = await db.query('SELECT id FROM yarn_types WHERE id = ?', [type_id]);
        if (typeRows.length === 0) return res.status(400).json({ message: 'Invalid type_id' });

        // Validate that count_id exists in yarn_counts
        const [countRows] = await db.query('SELECT id FROM yarn_counts WHERE id = ?', [count_id]);
        if (countRows.length === 0) return res.status(400).json({ message: 'Invalid count_id' });

        // Insert the new product
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock_quantity, image_url, type_id, count_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, image_url, type_id, count_id]
        );
        res.status(201).json({ message: 'Product added successfully!', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, image_url, type_id, subtype_id, count_id } = req.body;

        // Validate that type_id exists in yarn_types (if provided)
        if (type_id) {
            const [typeRows] = await db.query('SELECT id FROM yarn_types WHERE id = ?', [type_id]);
            if (typeRows.length === 0) return res.status(400).json({ message: 'Invalid type_id' });
        }

        // Validate that count_id exists in yarn_counts (if provided)
        if (count_id) {
            const [countRows] = await db.query('SELECT id FROM yarn_counts WHERE id = ?', [count_id]);
            if (countRows.length === 0) return res.status(400).json({ message: 'Invalid count_id' });
        }

        // Update the product
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ?, type_id = ?, count_id = ? WHERE id = ?',
            [name, description, price, stock_quantity, image_url, type_id, count_id, req.params.id]
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