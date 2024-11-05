document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
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
