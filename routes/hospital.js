// routes/hospital.js
const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');  // Adjust path to your model
const Doctor = require('../models/Doctor');      // Adjust path to your model

// Register a hospital
router.post('/register', async (req, res) => {
    try {
        const hospital = new Hospital(req.body);
        await hospital.save();
        res.status(201).json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Error registering hospital', error });
    }
});

// Get list of hospitals
router.get('/list', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospitals', error });
    }
});

// Add doctor to a hospital
router.post('/:hospitalId/add-doctor', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const doctor = new Doctor({ ...req.body, hospitalId });
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error adding doctor', error });
    }
});

// Remove doctor from a hospital
router.delete('/:hospitalId/remove-doctor/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        await Doctor.findByIdAndDelete(doctorId);
        res.json({ message: 'Doctor removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing doctor', error });
    }
});

// Additional routes for managing appointments, patients, etc., would go here

module.exports = router;
