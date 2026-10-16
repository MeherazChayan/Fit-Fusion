const adminOnly = (req, res, next) => {
    // authMiddleware already set req.isAdmin
    if (!req.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};

module.exports = adminOnly;
