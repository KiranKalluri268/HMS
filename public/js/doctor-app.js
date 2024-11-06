document.addEventListener("DOMContentLoaded", async () => {
    async function fetchAppointments() {
        try {
            const response = await fetch('api/doctor/appointments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Ensure session credentials are included
            });

            if (!response.ok) {
                throw new Error(`Error fetching appointments: ${response.status} ${response.statusText}`);
            }

            const appointments = await response.json();

            const appointmentsList = document.getElementById('appointments-list');
            appointmentsList.innerHTML = ''; // Clear any previous data

            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="d-patient-details.html?patientId=${appointment.patient._id}">${appointment.patient.name}</a></td>
                    <td>${new Date(appointment.date).toLocaleDateString()}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.reason}</td>
                `;
                appointmentsList.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }

    fetchAppointments(); // Call the function to load appointments
});
