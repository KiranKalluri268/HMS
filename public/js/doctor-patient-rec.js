document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/doctor/patient-records');
        
        if (!response.ok) {
            throw new Error('Failed to fetch records');
        }

        const records = await response.json();

        const recordsContainer = document.getElementById('records-container');
        
        records.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.classList.add('record');
            recordElement.innerHTML = `
                <h3>Patient: ${record.patient.name}</h3>
                <p>Date: ${new Date(record.appointmentDate).toLocaleDateString()}</p>
                <p>Status: ${record.status}</p>
            `;
            recordsContainer.appendChild(recordElement);
        });
    } catch (error) {
        console.error('Error loading patient records:', error);
        const recordsContainer = document.getElementById('records-container');
        recordsContainer.innerHTML = `<p>Error loading records.</p>`;
    }
});
