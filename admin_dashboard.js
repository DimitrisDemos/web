document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the default way

    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;

    // Prepare the data for the POST request
    const formData = new FormData();
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);

    // Fetch the data from the server
    fetch('get_statistics.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Update the chart with the received data
        renderChart(data);
    })
    .catch(error => console.error('Error:', error));
});

function renderChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['New Requests', 'Completed Requests', 'New Offers', 'Completed Offers'],
            datasets: [{
                label: 'Count',
                data: [
                    data.new_requests, 
                    data.completed_requests, 
                    data.new_offers, 
                    data.completed_offers
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', 
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', 
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
