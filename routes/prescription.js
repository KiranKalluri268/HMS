// routes/prescription.js
const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// Issue a new prescription
router.post('/add', async (req, res) => {
    try {
        const { patientId, doctorId, notes } = req.body;
        console.log("req.body",req.body);

        const newPrescription = new Prescription({
            patient: patientId,
            doctor: doctorId,
            notes,
            date: new Date()
        });

        await newPrescription.save();
        res.status(201).json({ message: 'Prescription issued successfully' });
    } catch (error) {
        console.error('Error issuing prescription:', error);
        res.status(500).json({ error: 'Error issuing prescription' });
    }
});

module.exports = router;
