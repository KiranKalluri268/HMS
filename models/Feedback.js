const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
