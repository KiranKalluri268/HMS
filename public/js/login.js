// login.js

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role }),
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const data = await response.json();

        // Save the user info in local storage or session storage
        localStorage.setItem('user', JSON.stringify(data.user)); // Example of storing user info

        // Redirect based on role
        switch (role) {
            case 'patient':
                window.location.href = 'patient.html'; // Redirect to patient dashboard
                break;
            case 'doctor':
                window.location.href = 'doctor.html'; // Redirect to doctor dashboard (if you have one)
                break;
            case 'admin':
                window.location.href = 'admin.html'; // Redirect to admin dashboard
                break;
            case 'hospital-admin':
                window.location.href = 'hospital-admin.html'; // Redirect to hospital admin dashboard
                break;
            default:
                throw new Error('Invalid role selected.');
        }
    } catch (error) {
        alert(error.message);
    }
});
