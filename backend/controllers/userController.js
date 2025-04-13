const db = require('../config/db');
const bcrypt = require('bcrypt');

// Fetch User Profile
exports.getUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT id, first_name, last_name, email, gender, contact_no FROM users WHERE id = ?', [id]);

        if (!rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]); // Return the user profile
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, gender, contactNo } = req.body;

    try {
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, gender = ?, contact_no = ? WHERE id = ?',
            [firstName, lastName, email, gender, contactNo, id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // Fetch the user's current password hash
        const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [id]);
        if (!rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        const storedHash = rows[0].password_hash;

        // Compare the current password with the stored hash
        const isMatch = await bcrypt.compare(currentPassword, storedHash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, id]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// Fetch All Customers
exports.getAllCustomers = async (req, res) => {
    try {
        // Query the database for users with role = 'customer'
        const [rows] = await db.query(
            'SELECT id, first_name, last_name, email, gender, contact_no, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
            ['customer']
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'No customers found' });
        }

        res.json(rows); // Return the list of customers
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure only customers can be deleted (not admins)
        await db.query('DELETE FROM users WHERE id = ? AND role = "customer"', [id]);
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};