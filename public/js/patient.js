// patient.js (Frontend)

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        // If no user is found in session storage, redirect to login
        alert('Please log in first');
        window.location.href = 'login.html';
    }
    const hospitalSelect = document.getElementById('hospital');
    const doctorSelect = document.getElementById('doctor');
    const confirmationMessage = document.getElementById('confirmation-message');

    // Fetch and display hospitals in the dropdown
    async function fetchHospitals() {
        try {
            const response = await fetch('/api/patient/hospitals');
            const hospitals = await response.json();
            console.log('Fetching hospitals');

            hospitals.forEach(hospital => {
                const option = document.createElement('option');
                option.value = hospital._id;
                option.textContent = hospital.name;
                hospitalSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    }

    // Fetch and display doctors based on selected hospital
    hospitalSelect.addEventListener('change', async () => {
        const hospitalId = hospitalSelect.value;
        doctorSelect.innerHTML = '<option value="" disabled selected>Select a doctor</option>'; // Reset doctor list

        try {
            const response = await fetch(`/api/patient/hospitals/${hospitalId}/doctors`);
            const doctors = await response.json();

            if (doctors.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No doctor is available for appointments';
                option.disabled = true;
                doctorSelect.appendChild(option);
            } else {
                doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor._id;
                    option.textContent = `${doctor.name} - ${doctor.specialization}`;
                    doctorSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    });

    // Call fetchHospitals on page load
    fetchHospitals();
    fetchAppointments();

// Handle appointment booking
document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = {
        hospital: document.getElementById('hospital').value,
        doctor: document.getElementById('doctor').value,
        reason: document.getElementById('reasonforappointment').value,
        date: document.getElementById('appointment-date').value,
        time: document.getElementById('appointment-time').value,
    };

    try {
        const response = await fetch('/api/patient/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        confirmationMessage.textContent = response.ok ? 'Appointment booked successfully!' : data.message;
        confirmationMessage.style.display = 'block';

        if (response.ok) {
            document.getElementById('appointment-form').reset(); // Reset form
            fetchAppointments(); // Refresh booked appointments
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
    }
});

// Fetch booked appointments for the patient
async function fetchAppointments() {
    try {
        const response = await fetch('/api/patient/appointments'); // Replace with your actual API endpoint
        const appointments = await response.json();

        const appointmentsTableBody = document.getElementById('appointments-table').getElementsByTagName('tbody')[0];
        appointmentsTableBody.innerHTML = ''; // Clear existing rows

        appointments.forEach(appointment => {
            const row = appointmentsTableBody.insertRow();
            row.insertCell(0).textContent = appointment.date;
            row.insertCell(1).textContent = appointment.time;
            row.insertCell(2).textContent = appointment.hospital.name;
            row.insertCell(3).textContent = appointment.doctor.name;
            row.insertCell(4).textContent = appointment.doctor.specialization;
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

});
