const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // Ensure you have a User model
const bcrypt = require('bcrypt'); // For password hashing

// Route to handle user registration
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword, // Save the hashed password
            role
        });

        // Save user to database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user. Please try again.' });
    }
});

// Route to handle user login
router.post('/login', authController.login);

// Route to handle user logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed. Please try again.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
        console.log("logout succesful")
    });
});

module.exports = router;
