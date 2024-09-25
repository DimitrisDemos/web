document.getElementById('announcementForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Send the form data to the PHP script via AJAX
    fetch('php/create_announcement.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message and clear the form
            document.getElementById('successMessage').innerText = data.message;
            document.getElementById('errorMessage').innerText = '';
            document.getElementById('announcementForm').reset();
        } else {
            // Show error message
            document.getElementById('errorMessage').innerText = data.message;
            document.getElementById('successMessage').innerText = '';
        }
    })
    .catch(error => {
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
        console.error('Error:', error);
    });
});
