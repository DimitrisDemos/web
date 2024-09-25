document.getElementById('rescuersForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Send an AJAX request to the PHP backend
    fetch('php/manage_rescuers.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Display success message
            document.getElementById('successMessage').innerText = data.message;
            document.getElementById('errorMessage').innerText = '';

            // Clear form inputs
            document.getElementById('rescuersForm').reset();
        } else {
            // Display error message
            document.getElementById('errorMessage').innerText = data.message;
            document.getElementById('successMessage').innerText = '';
        }
    })
    .catch(error => {
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
        console.error('Error:', error);
    });
});
