document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        // If no user is found in session storage, redirect to login
        alert('Please log in first');
        window.location.href = 'login.html';
    }
    
    const feedback = document.getElementById('feedback').value;
    const rating = document.getElementById('rating').value;
    
    if (feedback && rating) {
        alert("Thank you for your feedback!");
        
        // Reset form fields
        document.getElementById('feedback-form').reset();

        // Here, you could also add code to send the feedback to a server
    } else {
        alert("Please fill out all fields.");
    }
});
