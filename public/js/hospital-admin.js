document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

if (!user) {
    // If no user is found in session storage, redirect to login
    alert('Please log in first');
    window.location.href = 'login.html';
}
    async function fetchHospitalInfo() {
        try {
            const response = await fetch('/api/hospital-admin/hospital-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Ensure credentials are included
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const hospital = await response.json();
            console.log('Hospital Info:', hospital); // Debugging line
            // Optionally, update the DOM with hospital info here

            // Set the page title to the hospital name
            document.title = hospital.name; // Change the document title to hospital.name
            document.getElementById('hospital-name-header').innerText = `${hospital.name} Admin dashboard`;
            document.getElementById('hospital-id').value = hospital._id;// Set the hidden input value for hospital ID

            // Fetch doctors once hospital info is loaded
            fetchDoctorsByHospital(hospital._id);


        } catch (error) {
            console.error('Error fetching hospital information:', error);
        }
    }
    
    // Call this function after logging in successfully
    fetchHospitalInfo();
    
    // Function to fetch and display doctors in the table
    async function fetchDoctorsByHospital(hospitalId) {
        try {
            const response = await fetch(`/api/hospital-admin/doctors/${hospitalId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Ensure credentials are included
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching doctors: ${response.status} ${response.statusText}`);
            }
    
            const doctors = await response.json();
            const doctorsTableBody = document.getElementById('doctors-table-body');
            doctorsTableBody.innerHTML = ''; // Clear existing rows

            if (doctors.length === 0) {
                // Display a message if no doctors are available
                doctorsTableBody.innerHTML = `<tr><td colspan="4">No doctors available.</td></tr>`;
                return;
            }

            doctors.forEach(doctor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doctor.name}</td>
                    <td>${doctor.specialization}</td>
                    <td>${doctor.email}</td>
                    <td>
                        <button onclick="deleteDoctor('${doctor._id}')">Delete</button>
                    </td>
                `;
                doctorsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    // Handle the form submission for adding a doctor
    document.getElementById('add-doctor-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const hospitalId = document.getElementById('hospital-id').value; // Get the hospital ID
    
    console.log('Hospital ID:', hospitalId); // Debugging line
        
        const doctorData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('doctor-password').value,
            specialization: document.getElementById('specialization').value,
            hospitalId: hospitalId
        };

        console.log('Doctor Data:', doctorData); // Debugging line to see the entire object
        
        try {
            const response = await fetch('/api/hospital-admin/add-doctor', { // Ensure the endpoint is correct
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doctorData)
            });
            
            const result = await response.json();
            alert(result.message || "Failed to add doctor."); // Use the message from the server response
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    });
});
