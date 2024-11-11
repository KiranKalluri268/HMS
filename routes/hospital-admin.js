// routes/hospital-admin.js

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const hospitalController = require('../controllers/hospitalController');
const { getHospitalInfo } = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');


// Route to get hospital info
router.get('/hospital-info', (req, res, next) => {
    console.log('Received request for hospital info in hospital-admin.js');
    next();
}, getHospitalInfo);

// Route to add a new doctor
router.post('/add-doctor', doctorController.addDoctor);

// Route to get doctors by hospital ID
router.get('/doctors/:hospitalId', doctorController.getDoctorsByHospital);

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
