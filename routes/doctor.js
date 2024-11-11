// routes/doctor.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
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

// Fetch patient records for the logged-in doctor
router.get('/patient-records', async (req, res) => {
    try {
        // Ensure doctorId is available in the session
        const doctorId = req.session.user.role_id; // Assuming userId is saved in session

        if (!doctorId) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Find all appointments for this doctor
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient')
            .sort({ appointmentDate: -1 });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching patient records:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
