document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patientId');

    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log("user logged in:",user);

    if (!user) {
        // If no user is found in session storage, redirect to login
        alert('Please log in first');
        window.location.href = 'login.html';
    }

    if (patientId) {
        await fetchPatientDetails(patientId);
        await fetchPatientPrescriptions(patientId);
    }

    document.getElementById("prescription-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        await issuePrescription(patientId);
    });

async function fetchPatientDetails(patientId) {
    try {
        const response = await fetch(`/api/patient/details/${patientId}`, { method: 'GET', credentials: 'include' });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        
        const patient = await response.json();
        document.querySelector('.patient-details p:nth-child(2)').innerHTML = `<strong>Name:</strong> ${patient.name}`;
        document.querySelector('.patient-details p:nth-child(3)').innerHTML = `<strong>Age:</strong> ${patient.age}`;
        document.querySelector('.patient-details p:nth-child(4)').innerHTML = `<strong>Gender:</strong> ${patient.gender}`;
        document.querySelector('.patient-details p:nth-child(5)').innerHTML = `<strong>Contact:</strong> ${patient.email}`;
        document.querySelector('.patient-details p:nth-child(6)').innerHTML = `<strong>Phone:</strong> ${patient.phone}`;
        document.querySelector('.patient-details p:nth-child(7)').innerHTML = `<strong>Medical History:</strong> ${patient.medicalHistory}`;
    } catch (error) {
        console.error('Error fetching patient details:', error);
    }
}

async function fetchPatientPrescriptions(patientId) {
    try {
        const response = await fetch(`/api/patient/prescriptions/${patientId}`, { method: 'GET', credentials: 'include' });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        
        const prescriptions = await response.json();
        const prescriptionsList = document.getElementById('prescriptions-list');
        prescriptionsList.innerHTML = '';
        prescriptions.forEach(prescription => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Date:</strong> ${new Date(prescription.date).toLocaleDateString()} | <strong>Notes:</strong> ${prescription.notes}`;
            prescriptionsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
    }
}

async function issuePrescription(patientId) {
    const doctorId = user.role_id; // Replace with actual doctor ID if available in session
    const notes = document.getElementById("notes").value;

    try {
        const response = await fetch('/api/prescription/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ patientId, doctorId, notes })
        });
        
        if (response.ok) {
            alert('Prescription issued successfully');
            document.getElementById("notes").value = '';
            await fetchPatientPrescriptions(patientId); // Refresh prescription list
        } else {
            throw new Error('Error issuing prescription');
        }
    } catch (error) {
        console.error('Error issuing prescription:', error);
        alert('Failed to issue prescription');
    }
}
});