document.getElementById('book-btn').addEventListener('click', function() {
    alert('Redirecting to the appointment booking page...');
    // Here, you can redirect the user to a different page for booking or open a modal
});

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting normally
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert(`Thank you, ${name}! We will respond to your inquiry shortly.`);
        document.getElementById('contact-form').reset(); // Reset form
    } else {
        alert('Please fill out all fields.');
    }
});
