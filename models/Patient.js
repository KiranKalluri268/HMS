// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Optional: Ensure unique email
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true, // Ensure this field is required
    },
    medicalHistory: String,
    googleId: String,
    otp: String,
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);