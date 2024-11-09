document.getElementById('logout-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include' // Include credentials for session handling
        });

        if (response.ok) {
            // Clear session storage
            sessionStorage.clear();
            window.location.href = 'login.html';
        } else {
            const data = await response.json();
            alert(data.message || 'Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred. Please try again.');
    }
});
