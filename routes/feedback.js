const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');

// Route to submit feedback
router.post('/', submitFeedback);

// Route to get all feedbacks for admin
router.get('/all', getAllFeedback);

module.exports = router;
