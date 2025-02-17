const jwt = require('jsonwebtoken');

const authenticate = (roles) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: `Access denied. This route is restricted to ${roles.join(', ')} users.` });
            }
            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    };
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
};

module.exports = {authenticate, isAdmin};