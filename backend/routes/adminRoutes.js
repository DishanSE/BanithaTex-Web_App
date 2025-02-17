const express = require('express');
const {authenticate} = require('../midleware/authMiddleware');

const router = express.Router();

router.get('/admin/orders', authenticate(['admin']), async (req, res) => {
    try 
    {
        const [rows] = await db.query('SELECT * FROM orders');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;