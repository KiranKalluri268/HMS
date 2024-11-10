document.getElementById('feedback-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const feedback = document.getElementById('feedback').value;
    const rating = document.getElementById('rating').value;

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback, rating }),
            credentials: 'include'
        });

        if (response.ok) {
            alert('Feedback submitted successfully!');
            window.location.reload();
        } else {
            throw new Error('Failed to submit feedback');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Error submitting feedback. Please try again.');
    }
});
