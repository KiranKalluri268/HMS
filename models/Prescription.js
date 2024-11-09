const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, default: Date.now },
    medicine: String,
    dosage: String,
    notes: String
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
