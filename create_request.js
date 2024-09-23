document.addEventListener('DOMContentLoaded', function() {
    // Load categories
    fetch('get_categories.php')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.category_name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading categories:', error));

    // Handle form submission
    document.getElementById('requestForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {
            item: formData.get('item'),
            category: formData.get('category'),
            people: formData.get('people')
        };

        fetch('create_request.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Request created successfully');
                loadRequests(); // Reload requests list
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Load current and past requests
    function loadRequests() {
        fetch('get_requests.php')
            .then(response => response.json())
            .then(data => {
                const requestList = document.getElementById('requestList');
                requestList.innerHTML = ''; // Clear previous list
                data.requests.forEach(request => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <strong>Request ID: ${request.request_id}</strong><br>
                        Item: ${request.item_name}<br>
                        Number of People: ${request.number_of_people}<br>
                        Status: ${request.request_status}<br>
                        <hr>
                    `;
                    requestList.appendChild(div);
                });
            })
            .catch(error => console.error('Error loading requests:', error));
    }

    loadRequests(); // Initial load
});
