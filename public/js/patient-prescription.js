document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        // If no user is found in session storage, redirect to login
        alert('Please log in first');
        window.location.href = 'login.html';
    }
    fetchPatientPrescriptions();
});
const user = JSON.parse(sessionStorage.getItem('user'));
const patientId = user.role_id;
console.log(user.role_id);
async function fetchPatientPrescriptions(patientId) {
    console.log("fetching prescriptions of:",user);
    try {
        const patientId = user.role_id;
        console.log("fetching presceiptionss of 2:",patientId);
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

