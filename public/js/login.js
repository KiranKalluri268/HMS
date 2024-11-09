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
            credentials: 'include' // Include credentials for session handling
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed. Please check your credentials.');
        }

        const data = await response.json();

        // Save the user info in session storage
        sessionStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user && data.user.role) {
            switch (data.user.role) {
                case 'patient':
                    window.location.href = 'patient.html';
                    break;
                case 'doctor':
                    window.location.href = 'doctor.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                case 'hospital-admin':
                    window.location.href = 'hospital-admin.html';
                    break;
                default:
                    throw new Error('Invalid role detected.');
            }
        } else {
            throw new Error('Role not found. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert(error.message);
    }
});
