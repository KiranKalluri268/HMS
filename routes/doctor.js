// routes/doctor.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const doctor = require('../models/Doctor');

// Route to get appointments for the logged-in doctor
router.get('/appointments', async (req, res) => {
    console.log('found doctorId in routee/doctor.js:',req.session.doctorId);
    try {
        if (!req.session.doctorId) {
            return res.status(401).json({ error: 'Unauthorized access,routes/doctor.js' });
        }
        const doctorId = req.session.doctorId;
        const appointments = await Appointment.find({ doctor: doctorId }).populate('patient') ;
        console.log('fetched appoinment:',appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
