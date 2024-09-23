document.addEventListener('DOMContentLoaded', function() {
    // Load announcements
    fetch('get_announcements.php')
        .then(response => response.json())
        .then(data => {
            const announcementSelect = document.getElementById('announcement');
            const announcementsList = document.getElementById('announcementsList');

            data.announcements.forEach(announcement => {
                const option = document.createElement('option');
                option.value = announcement.announcement_id;
                option.textContent = announcement.announcement_text;
                announcementSelect.appendChild(option);

                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>Announcement ID: ${announcement.announcement_id}</strong><br>
                    Text: ${announcement.announcement_text}<br>
                    Date: ${announcement.created_at}<br>
                    <hr>
                `;
                announcementsList.appendChild(div);
            });
        })
        .catch(error => console.error('Error loading announcements:', error));

    // Handle offer form submission
    document.getElementById('offerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {
            announcementId: formData.get('announcement'),
            item: formData.get('item'),
            quantity: formData.get('quantity')
        };

        fetch('make_offer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Offer submitted successfully');
                loadOffers(); // Reload offers list
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Load current and past offers
    function loadOffers() {
        fetch('get_offers.php')
            .then(response => response.json())
            .then(data => {
                const offersList = document.getElementById('offersList');
                offersList.innerHTML = ''; // Clear previous list
                data.offers.forEach(offer => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <strong>Offer ID: ${offer.offer_id}</strong><br>
                        Item: ${offer.item_name}<br>
                        Quantity: ${offer.quantity}<br>
                        Status: ${offer.offer_status}<br>
                        <button onclick="cancelOffer(${offer.offer_id})">Cancel Offer</button>
                        <hr>
                    `;
                    offersList.appendChild(div);
                });
            })
            .catch(error => console.error('Error loading offers:', error));
    }

    loadOffers(); // Initial load

    // Cancel offer function
    window.cancelOffer = function(offerId) {
        fetch('cancel_offer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offer_id: offerId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Offer cancelled successfully');
                loadOffers(); // Reload offers list
            }
        })
        .catch(error => console.error('Error:', error));
    };
});
