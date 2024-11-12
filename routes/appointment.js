const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

// Create a new appointment
router.post('/create', async (req, res) => {
    try {
        const { patientId, doctorId, hospitalId, date, time, notes } = req.body;
        
        // Validate required fields
        if (!patientId || !doctorId || !hospitalId || !date || !time) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create the appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            hospital: hospitalId,
            date,
            time,
            notes
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error });
    }
});

// Get all appointments for a specific patient
router.get('/patient/:patientId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId })
            .populate('doctor', 'name')
            .populate('hospital', 'name');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving appointments', error });
    }
});

// Get all appointments for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId })
            .populate('patient', 'name')
            .populate('hospital', 'name');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving appointments', error });
    }
});

// Update an appointment status (e.g., Confirmed, Completed, Cancelled)
router.put('/update-status/:appointmentId', async (req, res) => {
    try {
        const { status } = req.body;

        // Update appointment status
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment status updated', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment status', error });
    }
});

// Cancel an appointment
router.delete('/cancel/:appointmentId', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error });
    }
});

module.exports = router;
