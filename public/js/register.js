// public/js/register.js (client-side JavaScript)
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const fullnameInput = document.getElementById('fullname');
    const ageInput = document.getElementById('age');
    const genderInput = document.getElementById('gender');
    const addressInput = document.getElementById('address');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        let isValid = true;

        // Check if passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            isValid = false;
            alert('Passwords do not match. Please try again.');
        }

        // Check if phone number is exactly 10 digits
        const phoneNumber = phoneInput.value.trim();
        if (!/^\d{10}$/.test(phoneNumber)) {
            isValid = false;
            alert('Phone number must be exactly 10 digits.');
        }

        // Check if email is valid
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            alert('Please enter a valid email address.');
        }

        // Check if address is provided
        if (!addressInput.value.trim()) {
            isValid = false;
            alert('Please enter your address.');
        }

        if (!isValid) return;

        // Gather data to send
        const formData = {
            name: fullnameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            age: ageInput.value,
            gender: genderInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
        };

        try {
            const response = await fetch('api/patient/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            // Redirect to the login page after successful registration
            window.location.href = 'login.html';

        } catch (error) {
            alert(error.message || 'An error occurred while registering.');
        }
    });
});
