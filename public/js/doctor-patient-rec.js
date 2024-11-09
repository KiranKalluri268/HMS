document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        // If no user is found in session storage, redirect to login
        alert('Please log in first');
        window.location.href = 'login.html';
    }
    const recordsContainer = document.getElementById('records-container');

    // Sample data for appointments grouped by date
    const appointmentsByDate = {
        '2024-11-01': [
            { name: 'John Doe', time: '10:00 AM', reason: 'Routine Check-up' },
            { name: 'Jane Smith', time: '11:00 AM', reason: 'Follow-up' }
        ],
        '2024-11-02': [
            { name: 'Emily Johnson', time: '9:30 AM', reason: 'Consultation' },
            { name: 'Michael Brown', time: '1:00 PM', reason: 'General Check-up' }
        ],
        '2024-11-03': [
            { name: 'Chris Evans', time: '10:00 AM', reason: 'Flu Symptoms' }
        ]
    };

    // Function to create a table row for a patient appointment
    function createAppointmentRow(appointment) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = appointment.name;
        row.appendChild(nameCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = appointment.time;
        row.appendChild(timeCell);

        const reasonCell = document.createElement('td');
        reasonCell.textContent = appointment.reason;
        row.appendChild(reasonCell);

        return row;
    }

    // Function to generate and display patient records grouped by date
    Object.keys(appointmentsByDate).forEach(date => {
        // Create the date header
        const dateGroup = document.createElement('div');
        dateGroup.classList.add('date-group');

        const dateHeader = document.createElement('div');
        dateHeader.classList.add('date-header');
        dateHeader.textContent = `Appointments for ${date}`;
        dateGroup.appendChild(dateHeader);

        // Create the table for the appointments
        const table = document.createElement('table');
        const tableHead = document.createElement('thead');
        const tableBody = document.createElement('tbody');

        // Define table headers
        const headerRow = document.createElement('tr');
        const headers = ['Patient Name', 'Time', 'Reason for Visit'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Add rows for each appointment
        appointmentsByDate[date].forEach(appointment => {
            const row = createAppointmentRow(appointment);
            tableBody.appendChild(row);
        });

        table.appendChild(tableHead);
        table.appendChild(tableBody);
        dateGroup.appendChild(table);

        recordsContainer.appendChild(dateGroup);
    });
});
