// admin.js (Backend)
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const Hospital = require('../models/Hospital'); // Ensure you have a Hospital model
const Doctor = require('../models/Doctor'); // Ensure you have a Doctor model
const hospitalController = require('../controllers/hospitalController');
// Route to get the list of all hospitals
router.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ message: 'Error fetching hospitals' });
    }
});

// Route for adding a new hospital
router.post('/add-hospital', hospitalController.addHospital);


// Route to delete a hospital by ID
router.delete('/hospitals/:id', async (req, res) => {
    const { id } = req.params; // Get hospital ID from the URL
    try {
        const result = await Hospital.findByIdAndDelete(id); // Delete hospital from the database
        if (!result) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }
        res.json({ message: 'Hospital deleted successfully.' });
    } catch (error) {
        console.error('Error deleting hospital:', error);
        res.status(500).json({ message: 'Error deleting hospital.' });
    }
});

module.exports = router;

// Route to get the list of all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('hospital', 'name');
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

// Route to delete a doctor by ID
router.delete('/doctors/:id', async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ message: 'Error deleting doctor' });
    }
});

module.exports = router;