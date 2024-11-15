async function fetchFeedbacks() {
    try {
        const response = await fetch('/api/feedback/all');
        if (!response.ok) throw new Error('Failed to fetch feedbacks');

        const feedbacks = await response.json();
        const feedbackList = document.getElementById('feedback-list');
        feedbackList.innerHTML = '';

        feedbacks.forEach(feedback => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>User:</strong> ${feedback.userId?.name || 'Anonymous'} | <strong>Rating:</strong> ${feedback.rating} | <strong>Feedback:</strong> ${feedback.feedback} | <strong>Date:</strong> ${new Date(feedback.date).toLocaleDateString()}`;
            feedbackList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    fetchFeedbacks();
    if (!user) {
        // If no user is found in session storage, redirect to login
        alert('Please log in first');
        window.location.href = 'login.html';
    }
});

