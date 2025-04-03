const { route } = require('../app.js')
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Get all products with yarn type, subtype, and count details
exports.getProducts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.price, 
                p.color,
                p.stock_quantity, 
                p.image_url,
                p.updated_at,
                yt.name AS type_name,
                yc.count_value
            FROM products p
            JOIN yarn_types yt ON p.type_id = yt.id
            JOIN yarn_counts yc ON p.count_id = yc.id
            ORDER BY p.id DESC
        `);

        const products = rows.map(row => ({
          ...row,
          price: parseFloat(row.price),
          updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
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
                p.color,
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

        const product = rows[0];
        product.price = parseFloat(product.price);
        
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch available colors for a product
exports.getProductColors = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
            SELECT DISTINCT p1.color 
            FROM products p1
            JOIN products p2 ON p1.name = p2.name
            WHERE p2.id = ?
        `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No colors found for this product' });
        }

        const colors = rows.map(row => row.color);
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Fetch available count values for a product
exports.getProductCounts = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate product_id
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        // Fetch counts for the product
        const [rows] = await db.query(
            `SELECT yc.id, yc.count_value 
             FROM product_yarn_counts pyc
             JOIN yarn_counts yc ON pyc.yarn_count_id = yc.id
             WHERE pyc.product_id = ?`,
            [id]
        );

        // Return the counts
        if (rows.length === 0) {
            return res.status(404).json({ message: "No counts found for this product." });
        }

        res.json(rows);
    } catch (error) {
        console.error("Error fetching product counts:", error);
        res.status(500).json({ message: "Failed to fetch product counts." });
    }
};


// Add a new product
exports.addProduct = async (req, res) => {
    const connection = await db.getConnection(); // Begin a DB connection
    try {
        const { name, description, price, color, stock_quantity, image_url, type_id, count_id } = req.body;

        // Validate that type_id exists in yarn_types
        const [typeRows] = await connection.query('SELECT id FROM yarn_types WHERE id = ?', [type_id]);
        if (typeRows.length === 0) {
            return res.status(400).json({ message: 'Invalid type_id' });
        }

        // Validate that count_id exists in yarn_counts
        const [countRows] = await connection.query('SELECT id FROM yarn_counts WHERE id = ?', [count_id]);
        if (countRows.length === 0) {
            return res.status(400).json({ message: 'Invalid count_id' });
        }

        // Decode and save the Base64 image
        let savedImagePath = '';
        if (image_url) {
            const imageBuffer = Buffer.from(image_url, 'base64'); // Decode Base64
            const fileName = `${Date.now()}-product.jpg`; // Generate a unique filename
            const filePath = path.join(__dirname, '../uploads', fileName);
            fs.writeFileSync(filePath, imageBuffer); // Save the file
            savedImagePath = `/uploads/${fileName}`; // Relative path for database
        }

        // Insert the new product
        const [result] = await connection.query(
            'INSERT INTO products (name, description, price, color, stock_quantity, image_url, type_id, count_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, color, stock_quantity, savedImagePath, type_id, count_id]
        );

        const productId = result.insertId;

        // Now insert into product_yarn_counts table
        await connection.query(
            'INSERT INTO product_yarn_counts (product_id, yarn_count_id) VALUES (?, ?)',
            [productId, count_id]
        );
        
        // Commit transaction
        await connection.commit();

        res.status(201).json({ message: 'Product added successfully!', productId: productId });
    } catch (error) {
        await connection.rollback();
        console.error('Error adding product:', error);
        res.status(500).json({ message: error.message });
    } finally {
        connection.release(); // Release the DB connection
    }
};


// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, color, stock_quantity, image_url, type_id, count_id } = req.body;

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
            'UPDATE products SET name = ?, description = ?, price = ?, color = ?, stock_quantity = ?, image_url = ?, type_id = ?, count_id = ? WHERE id = ?',
            [name, description, price, color, stock_quantity, image_url, type_id, count_id, req.params.id]
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

// Fetch All Yarn Types
exports.getYarnTypes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name FROM yarn_types');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No yarn types found' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching yarn types:', error);
        res.status(500).json({ message: 'Failed to fetch yarn types' });
    }
};

// Fetch All Yarn Counts
exports.getYarnCounts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, count_value FROM yarn_counts');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No yarn counts found' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching yarn counts:', error);
        res.status(500).json({ message: 'Failed to fetch yarn counts' });
    }
};