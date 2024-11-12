const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // Ensure you have a User model
const bcrypt = require('bcryptjs'); // For password hashing
const nodemailer = require('nodemailer');
const passport = require('passport');
const Patient = require('../models/Patient');
const Otp = require('../models/Otp'); // Adjust the path as needed

// Route to start Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google OAuth
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/otp-verification');
    }
);

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        });

        // Save OTP in your database or a temporary store
        await Otp.create({ email, otp });
        console.log('otp sent:',otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});


// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    console.log('Received request body:', req.body);

    if (!email || !otp) {
        console.log('Missing email or OTP in the request body');
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        // Search for the OTP document
        const otpDoc = await Otp.findOne({ email, otp });
        
        // Log the found OTP document
        console.log('OTP Document:', otpDoc);

        if (!otpDoc) {
            console.log('Invalid OTP or OTP not found in the database');
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Optionally delete the OTP after successful verification
        await Otp.deleteOne({ _id: otpDoc._id });

        console.log('OTP verified successfully');
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



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
