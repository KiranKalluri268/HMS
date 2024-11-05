// models/Hospital.js
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: false, // Made optional
    },
    phone: {
        type: String,
        required: false, // Made optional
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true, // Made optional
    },
    admin: {
        type: String,
        required: true,
    },
    admin_id: { // New field for hospital admin
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model if applicable
        required: true, // Change as necessary
    },
    password: { // New field for admin password
        type: String,
        required: true, // Change as necessary
    },
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    }],
}, { timestamps: true });

module.exports = mongoose.models.Hospital || mongoose.model('Hospital', hospitalSchema);
