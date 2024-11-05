document.addEventListener('DOMContentLoaded', function () {
    const uploadBtn = document.getElementById('upload-btn');
    const prescriptionForm = document.getElementById('prescription-form');
    const fileList = document.getElementById('file-list');

    // Show the form when the "Upload Prescription" button is clicked
    uploadBtn.addEventListener('click', function () {
        prescriptionForm.classList.toggle('hidden');
    });

    // Handle form submission and file upload
    prescriptionForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const prescriptionName = document.getElementById('prescription-name').value;
        const prescriptionFile = document.getElementById('prescription-file').files[0];

        // Validate file presence
        if (!prescriptionFile) {
            alert('Please upload a valid file.');
            return;
        }

        // Add the uploaded file to the list in the folder
        const listItem = document.createElement('li');
        listItem.textContent = `${prescriptionName} - ${prescriptionFile.name}`;
        fileList.appendChild(listItem);

        // Reset the form and hide it again
        prescriptionForm.reset();
        prescriptionForm.classList.add('hidden');
    });
});
