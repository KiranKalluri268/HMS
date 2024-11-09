// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;  // Expecting role in login form data
        console.log("login credentials:",req.body);

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (!user) {
            return res.status(401).json({ error: "Invalid email" });
        }

        // Verify the role matches the user's role
        if (user.role !== role) {
            return res.status(403).json({ error: "Unauthorized role" });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // If the user is a hospital-admin, fetch the corresponding hospital
        if (role === 'hospital-admin') {
            const hospital = await Hospital.findOne({ admin_id : user._id });
            if (!hospital) {
                return res.status(404).json({ error: "Hospital not found for this admin" });
            }

            // Save the hospital's _id to the session
            req.session.adminId = hospital._id;
        }

        if (role === 'doctor'){
            req.session.doctorId = user.role_id;
            console.log('doctorId:',req.session.doctorId);
        }

        req.session.userId = user._id;
        // Set user info in session
        req.session.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            role_id: user.role_id,
        };
        // Send success response
        res.status(200).json({ message: "Login successful" , user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
