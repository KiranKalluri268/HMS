document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the doctor's profile from the server
        const response = await fetch('/api/doctor/profile');
        
        if (!response.ok) {
            throw new Error('Failed to load profile');
        }
        
        const doctorProfile = await response.json();
        
        // Populate the form with doctor profile data
        document.getElementById('name').value = doctorProfile.name;
        document.getElementById('email').value = doctorProfile.email;
        document.getElementById('phone').value = doctorProfile.phone;
        document.getElementById('specialization').value = doctorProfile.specialization;
        document.getElementById('experience').value = doctorProfile.experience;

        // Edit button logic
        document.getElementById('edit-btn').addEventListener('click', () => {
            document.getElementById('name').readOnly = false;
            document.getElementById('email').readOnly = false;
            document.getElementById('phone').readOnly = false;
            document.getElementById('specialization').readOnly = false;
            document.getElementById('experience').readOnly = false;
            document.getElementById('save-btn').style.display = 'inline-block';
            document.getElementById('edit-btn').style.display = 'none';
        });

        // Save button logic
        document.getElementById('doctor-profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedProfile = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                specialization: document.getElementById('specialization').value,
                experience: document.getElementById('experience').value,
            };

            // Send the updated profile to the server
            const updateResponse = await fetch('/api/doctor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (updateResponse.ok) {
                alert('Profile updated successfully');
                location.reload(); // Reload the page to show updated data
            } else {
                alert('Error updating profile');
            }
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile');
    }
});
