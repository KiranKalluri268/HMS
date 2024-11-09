// middlewares/authMiddleware.js

module.exports = (requiredRole) => {
    return (req, res, next) => {
        console.log('Session:', req.session);

        // Check if user is authenticated
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized: No active session found' });
        }

        const { userId, role } = req.session.user;

        // Ensure userId exists in session
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: Missing user information in session' });
        }

        // If a specific role is required, check if the user's role matches
        if (requiredRole && role !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        // User is authenticated, proceed to the next middleware
        next();
    };
};


exports.isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    }

    // If not authenticated, respond with a 401 Unauthorized error
    return res.status(401).json({ message: 'Please log in first' });
};

