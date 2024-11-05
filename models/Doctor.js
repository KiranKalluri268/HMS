// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId, // Reference by ObjectId
        ref: 'Hospital', // Reference to the Hospital model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['doctor'],
        default: 'doctor', // Default to 'doctor' for this model
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
