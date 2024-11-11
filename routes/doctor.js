// routes/doctor.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

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

// Get the doctor's profile (from session or JWT)
router.get('/profile', async (req, res) => {
    try {
        const doctorId = req.session.doctorId; // Assumes the doctor’s ID is stored in the session
        console.log("fetching profile of doctor:",doctorId);

        if (!doctorId) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            experience: doctor.experience
        });
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update doctor profile
router.put('/profile', async (req, res) => {
    try {
        const doctorId = req.session.doctorId;  // Assuming JWT authentication
        const profileData = req.body;  // Get profile data from the request body

        // Log incoming data for debugging
        console.log('Updating profile for doctor:', doctorId);
        console.log('Profile data:', profileData);

        const doctor = await Doctor.findByIdAndUpdate(doctorId, profileData, {
            new: true,
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);  // Send the updated doctor object as the response
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
