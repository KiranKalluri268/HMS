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
    const sendOtpButton = document.getElementById('send-otp');
    const otpSection = document.getElementById('otp-section');
    const otpInput = document.getElementById('otp');

    let isOtpSent = false;
    let otpVerified = false;
    let isOtpRequestInProgress = false;

    // Debugging logs to see when the event listeners are attached
    console.log('Register.js loaded');

    // Disable OTP button if email is not provided
    sendOtpButton.disabled = true;
    emailInput.addEventListener('input', function () {
        sendOtpButton.disabled = !emailInput.value.trim();
    });

    // Event listener for "Send OTP" button
    sendOtpButton.addEventListener('click', async function (e) {
        e.preventDefault(); // Prevent default button behavior
        console.log('Send OTP button clicked');

        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter your email to receive the OTP.');
            return;
        }

        if (isOtpSent) {
            alert('OTP has already been sent. Please check your email.');
            return;
        }

        if (isOtpRequestInProgress) {
            console.log('OTP request already in progress');
            return;
        }

        // Mark request as in progress
        isOtpRequestInProgress = true;

        // Send OTP request to the server
        try {
            console.log('Sending OTP to:', email);

            const otpResponse = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const otpResult = await otpResponse.json();

            if (otpResponse.ok) {
                alert(otpResult.message || 'OTP sent successfully to your email.');
                otpSection.style.display = 'block';
                isOtpSent = true;
            } else {
                throw new Error(otpResult.message || 'Failed to send OTP.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert(error.message);
        } finally {
            isOtpRequestInProgress = false;
        }
    });

    // Event listener for OTP verification
    otpInput.addEventListener('input', async function () {
        if (otpInput.value.trim().length === 6) { // Assuming OTP is 6 digits
            const otp = otpInput.value.trim();
            const email = emailInput.value.trim();

            try {
                const verifyResponse = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, otp }),
                });

                const verifyResult = await verifyResponse.json();
                if (verifyResponse.ok) {
                    alert('OTP verified successfully!');
                    otpVerified = true;
                } else {
                    throw new Error(verifyResult.message || 'OTP verification failed.');
                }
            } catch (error) {
                otpVerified = false;
                alert(error.message);
            }
        }
    });

    // Event listener for form submission
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log('Register form submitted');

        let isValid = true;

        if (passwordInput.value !== confirmPasswordInput.value) {
            isValid = false;
            alert('Passwords do not match. Please try again.');
        }

        const phoneNumber = phoneInput.value.trim();
        if (!/^\d{10}$/.test(phoneNumber)) {
            isValid = false;
            alert('Phone number must be exactly 10 digits.');
        }

        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            alert('Please enter a valid email address.');
        }

        if (!addressInput.value.trim()) {
            isValid = false;
            alert('Please enter your address.');
        }

        if (!isOtpSent) {
            isValid = false;
            alert('Please send an OTP to your email.');
        }

        if (!otpVerified) {
            isValid = false;
            alert('Please verify the OTP sent to your email.');
        }

        if (!isValid) return;

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
            const response = await fetch('/api/patient/register', {
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

            alert('Registration successful!');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message || 'An error occurred while registering.');
        }
    });
});
