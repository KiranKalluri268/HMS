document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const verificationCodeDiv = document.getElementById('verification-code');
    const verifyCodeButton = document.getElementById('verify-code-button');
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('code');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');

    // Simulating the sending of a verification code
    forgotPasswordForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = emailInput.value.trim();
        
        // Here you would typically send the email to your server for processing
        // Simulating email sending
        alert(`A verification code has been sent to ${email}.`);

        // Show the verification code input fields
        verificationCodeDiv.style.display = 'block';
    });

    // Verify code and reset password
    verifyCodeButton.addEventListener('click', function () {
        const code = codeInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmNewPassword = confirmNewPasswordInput.value.trim();

        // Here you would typically verify the code with your server
        // Simulating code verification
        if (code === '123456') { // Simulate a correct code
            if (newPassword === confirmNewPassword) {
                // Here you would typically send the new password to your server
                alert('Your password has been successfully updated.');
                // Redirect to login page or another action
                window.location.href = 'login.html';
            } else {
                alert('New passwords do not match. Please try again.');
            }
        } else {
            alert('Invalid verification code. Please try again.');
        }
    });
});
