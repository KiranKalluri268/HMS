document.addEventListener('DOMContentLoaded', async () => {
    const hospitalListDiv = document.getElementById('hospital-list');

    try {
        const response = await fetch('/api/hospital/list');
        if (!response.ok) throw new Error('Failed to fetch hospitals');

        const hospitals = await response.json();

        if (hospitals.length === 0) {
            hospitalListDiv.innerHTML = '<p>No hospitals available at the moment.</p>';
        } else {
            hospitalListDiv.innerHTML = hospitals.map(hospital => `
                <div class="hospital">
                    <h3>${hospital.name}</h3>
                    <p>Location: ${hospital.address}</p>
                    <p>Email: ${hospital.email || 'N/A'}</p>
                    <p>Phone: ${hospital.phone || 'N/A'}</p>
                    <p>Services: ${hospital.services?.join(', ') || 'Not specified'}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading hospitals:', error);
        hospitalListDiv.innerHTML = '<p>Error loading hospitals. Please try again later.</p>';
    }
});
