// middlewares/authMiddleware.js
module.exports = (req, res, next) => {
    console.log('Session:', req.session);

    // Check if the user is authenticated as either an admin or a regular user
    if (req.session.adminId || req.session.userId) {
        next(); // User is authenticated, proceed to the next middleware
    } else {
        return res.status(401).json({ error: 'Unauthorized,middleware/authMiddleware.js' }); // User is not authenticated
    }
};
