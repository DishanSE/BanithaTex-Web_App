const { route } = require('../app.js')
const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const transporter = require('../config/nodemailer.js');

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
                GROUP_CONCAT(DISTINCT yc.count_value ORDER BY yc.count_value ASC SEPARATOR ', ') AS counts
            FROM products p
            JOIN yarn_types yt ON p.type_id = yt.id
            LEFT JOIN product_yarn_counts pyc ON p.id = pyc.product_id
            LEFT JOIN yarn_counts yc ON pyc.yarn_count_id = yc.id
            GROUP BY p.id
            ORDER BY p.updated_at DESC
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
        const { id } = req.params;

        // Query to fetch product details along with associated counts
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
                GROUP_CONCAT(DISTINCT yc.count_value ORDER BY yc.count_value ASC SEPARATOR ', ') AS counts
            FROM products p
            JOIN yarn_types yt ON p.type_id = yt.id
            LEFT JOIN product_yarn_counts pyc ON p.id = pyc.product_id
            LEFT JOIN yarn_counts yc ON pyc.yarn_count_id = yc.id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Process the result
        const product = rows[0];
        product.price = parseFloat(product.price);

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
};

// Fetch available colors for a product
exports.getProductColors = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the product name using the provided product ID
        const [productRows] = await db.query('SELECT name FROM products WHERE id = ?', [id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const productName = productRows[0].name;

        // Query the database to get available colors for the product name
        const [rows] = await db.query(
            `
            SELECT DISTINCT p.color 
            FROM products p
            WHERE p.name = ?
            `,
            [productName]
        );

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

        // Fetch the product name using the provided product ID
        const [productRows] = await db.query('SELECT name FROM products WHERE id = ?', [id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const productName = productRows[0].name;

        // Fetch all counts for the product name
        const [rows] = await db.query(
            `
            SELECT DISTINCT yc.id, yc.count_value 
            FROM products p
            JOIN product_yarn_counts pyc ON p.id = pyc.product_id
            JOIN yarn_counts yc ON pyc.yarn_count_id = yc.id
            WHERE p.name = ?
            `,
            [productName]
        );

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
            'INSERT INTO products (name, description, price, color, stock_quantity, image_url, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, color, stock_quantity, savedImagePath, type_id]
        );

        const productId = result.insertId;

        // Now insert into product_yarn_counts table
        await connection.query(
            'INSERT INTO product_yarn_counts (product_id, yarn_count_id, color) VALUES (?, ?, ?)',
            [productId, count_id, color]
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
        const { id } = req.params; // Extract product ID from URL
        const { name, description, price, color, stock_quantity, image_url, type_id, count_id } = req.body;

        // Validate required fields
        if (!name || !description || !price || !color || stock_quantity === undefined || !type_id || !count_id) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate that stock_quantity is a positive number
        if (stock_quantity < 0 || isNaN(stock_quantity)) {
            return res.status(400).json({ message: 'Stock quantity must be a non-negative number' });
        }

        // Validate that price is a positive number
        if (price <= 0 || isNaN(price)) {
            return res.status(400).json({ message: 'Price must be a positive number' });
        }

        // Validate type_id
        const [typeRows] = await db.query('SELECT id FROM yarn_types WHERE id = ?', [type_id]);
        if (typeRows.length === 0) {
            return res.status(400).json({ message: 'Invalid type_id' });
        }

        // Validate count_id
        const [countRows] = await db.query('SELECT id FROM yarn_counts WHERE id = ?', [count_id]);
        if (countRows.length === 0) {
            return res.status(400).json({ message: 'Invalid count_id' });
        }

        // Update the product in the database
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, color = ?, stock_quantity = ?, image_url = ?, type_id = ? WHERE id = ?',
            [name, description, price, color, stock_quantity, image_url, type_id, id]
        );

        // Check if the product was found and updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Notify admin if stock is below 500 kg
        if (stock_quantity <= 300) {
            console.log(`ALERT: Stock for product ID ${id} is below 300 kg. Current stock: ${stock_quantity} kg`);
            await notifyAdminLowStock(id, name, type_id, color,count_id, stock_quantity); // Optional: Send email or log notification
        }

        // Return success response
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error', details: error.message });
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

// Function to notify the admin via email
const notifyAdminLowStock = async (productId, productName, typeID, productColor, countID, stockQuantity) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'dishanraj13@gmail.com',
            subject: 'Low Stock Alert',
            // text: `Product ID ${productId} (Name: ${productName} | Product Type: ${typeID} | Color: ${productColor} | Count ID: ${countID}) has low stock: ${stockQuantity} kg`,
            html:`
                <h1>LOW STOCK ALERT! FROM BANITHA TEX</h1>
                <p>Product Deatils for ID: ${productId}</p>
                <li>
                    <strong>Name: ${productName}</strong> -
                    Type ID: ${typeID},
                    Color: ${productColor},
                    Count ID:${countID}
                <li>
                <p>has low stock: ${stockQuantity} kg</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.getAvailableCounts = async (req, res) => {
    try {
        const { id, color } = req.params;

        // Fetch the product name using the provided product ID
        const [productRows] = await db.query('SELECT name FROM products WHERE id = ?', [id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const productName = productRows[0].name;

        // Query the database to get available counts for the product name and color
        const [rows] = await db.query(
            `
            SELECT DISTINCT yc.id, yc.count_value 
            FROM products p
            JOIN product_yarn_counts pyc ON p.id = pyc.product_id
            JOIN yarn_counts yc ON pyc.yarn_count_id = yc.id
            WHERE p.name = ? AND p.color = ?
            `,
            [productName, color]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No counts found for the given product and color.' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching available counts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
