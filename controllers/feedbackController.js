const Feedback = require('../models/Feedback');

// Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { feedback, rating } = req.body;
        const userId = req.session.user.role_id; // Assuming session contains logged-in user's ID

        const newFeedback = new Feedback({ userId, feedback, rating });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all feedbacks for admin
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId');
        console.log("fetched feedbacks:",feedbacks);
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
