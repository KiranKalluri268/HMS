// admin.js (Frontend)

// Fetch hospitals from the backend and display them in the table
async function fetchHospitals() {
    try {
        const response = await fetch('/api/admin/hospitals');
        if (!response.ok) {
            throw new Error('Failed to fetch hospitals');
        }
        const hospitals = await response.json();

        // Get the hospitals-list tbody element
        const hospitalsList = document.getElementById('hospitals-list');
        hospitalsList.innerHTML = ''; // Clear existing content

        // Populate the table with hospital data
        hospitals.forEach(hospital => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${hospital.name}</td>
                <td>${hospital.admin}</td>
                <td><button class="delete-btn" data-id="${hospital._id}">Delete</button></td>
            `;
            hospitalsList.appendChild(row);
        });

        // Add delete button functionality
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const hospitalId = e.target.getAttribute('data-id');
                await deleteHospital(hospitalId);
            });
        });

    } catch (error) {
        console.error('Error fetching hospitals:', error);
        alert('Error fetching hospitals. Please try again later.');
    }
}

// Function to delete a hospital
async function deleteHospital(id) {
    if (confirm('Are you sure you want to delete this hospital?')) {
        try {
        const response = await fetch(`/api/admin/hospitals/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Log response for debugging
            const text = await response.text();
            console.error("Response Text:", text); // This logs any HTML error page or message
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        alert(data.message);
        // Reload or update hospital list after deletion
        fetchHospitals(); // Call to refresh the list after deletion
    } catch (error) {
        console.error("Error deleting hospital:", error);
        alert("Error deleting hospital. Please try again.");
    }
    }
}

// Event listener for adding a hospital

document.getElementById('add-hospital-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
        name: document.getElementById('hospital-name').value,
        admin: document.getElementById('h_admin').value,
        email: document.getElementById('h_email').value,
        password: document.getElementById('h_password').value, // Change h_password to password for consistency
    };

    console.log('Form Data:', formData); // Debugging: Log form data

    try {
        const response = await fetch('/api/admin/add-hospital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); // Show success message
            fetchHospitals();
            // Optionally, reset the form or redirect
            document.getElementById('add-hospital-form').reset(); // Reset form after successful submission
        } else {
            const errorData = await response.json();
            alert(errorData.message); // Show error message
        }
    } catch (error) {
        console.error('Error adding hospital :', error);
        alert('Error adding hospital. Please try again1.');
    }
});

    // Fetch doctors list on page load
    async function fetchDoctors() {
        try {
            const response = await fetch('/api/admin/doctors'); // Replace with correct API endpoint if necessary
            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }
            const doctors = await response.json();
    
            // Populate the doctors list in the HTML
            const doctorsList = document.getElementById('doctors-list');
            doctorsList.innerHTML = ''; // Clear existing content
    
            doctors.forEach(doctor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doctor.name}</td>
                    <td>${doctor.specialization}</td>
                    <td>${doctor.hospital.name}</td>
                    <td><button onclick="deleteDoctor('${doctor._id}')">Delete</button></td>
                `;
                doctorsList.appendChild(row);
            });

            // Add delete button functionality
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const doctorId = e.target.getAttribute('data-id');
                await deleteDoctor(doctorId);
            });
        });

            
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }
    

    // Delete a doctor
    window.deleteDoctor = async function (doctorId) {
        try {
            const response = await fetch(`/api/admin/doctors/${doctorId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Doctor deleted successfully!');
                fetchDoctors(); // Refresh the doctors list
            } else {
                alert('Error deleting doctor.');
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    fetchDoctors(); // Initial load of doctors


// Call fetchHospitals when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchHospitals(); // This calls the hospital fetch function
    fetchDoctors();   // Add this to fetch doctors on page load
});