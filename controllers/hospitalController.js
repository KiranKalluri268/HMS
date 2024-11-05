const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Doctor = require('../models/Doctor'); // Doctor model import
const bcrypt = require('bcrypt'); 
const mongoose = require('mongoose');

exports.getHospitalInfo = async (req, res) => {
    console.log('Received request for hospital info in controller');
    const adminId = req.session.adminId; // This should be an ObjectId

    console.log('Admin ID:', adminId);
    if (!adminId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Logging the type of adminId
        console.log('Type of adminId:', typeof adminId);

        // Fetching the hospital by admin ID
        const hospital = await Hospital.findOne({ _id : new mongoose.Types.ObjectId(adminId) }).populate('doctors');

        console.log('Hospital fetched:', hospital); // Log the fetched hospital

        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        res.json(hospital);
    } catch (error) {
        console.error('Error fetching hospital info:', error);
        res.status(500).json({ error: 'Failed to fetch hospital info' });
    }
};


// Add a new hospital (if needed in the application)
exports.addHospital = async (req, res) => {
    try {
        const { name, address, phone, email, admin, password } = req.body;

        // Step 1: Create the User for the Hospital Admin
        const hashedPassword = await bcrypt.hash(password, 10); // hash the password
        const newUser = new User({
            email: email,
            password: hashedPassword,
            role: 'hospital-admin',
        });
        const savedUser = await newUser.save();

        // Step 2: Use the saved User ID to set the 'admin' field in Hospital
        const newHospital = new Hospital({
            name,
            address,
            phone,
            email,
            admin, // storing the admin's name directly
            admin_id: savedUser._id, // storing the User ID reference here
            password: hashedPassword
        });

        const savedHospital = await newHospital.save();

        req.session.adminId = savedHospital._id;
        
        res.status(201).json({ message: 'Hospital and admin created successfully', hospital: savedHospital });

    } catch (error) {
        console.error('Error creating hospital:', error);
        res.status(500).json({ error: 'Failed to create hospital' });
    }
};


// Delete a hospital (if needed)
exports.deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHospital = await Hospital.findByIdAndDelete(id);
        
        if (!deletedHospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        res.json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        console.error('Error deleting hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};