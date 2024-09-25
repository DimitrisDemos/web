document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map').setView([your_latitude, your_longitude], 13); // Set your starting coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    function fetchAdminData() {
        fetch("dmin_map_data.php")
            .then(response => response.json())
            .then(data => {
                updateMap(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function updateMap(data) {
        // Base location marker
        const baseMarker = L.marker([data.base_latitude, data.base_longitude], { draggable: true }).addTo(map);
        baseMarker.bindPopup('Base Location');
        
        baseMarker.on('dragend', function (event) {
            const newPos = event.target.getLatLng();
            if (confirm("Are you sure you want to change the base location?")) {
                updateBaseLocation(newPos.lat, newPos.lng);
            } else {
                baseMarker.setLatLng([data.base_latitude, data.base_longitude]); // Reset the position
            }
        });

        // Vehicle markers
        data.vehicles.forEach(vehicle => {
            const vehicleMarker = L.marker([vehicle.location_lat, vehicle.location_lng]).addTo(map);
            vehicleMarker.bindPopup(`Vehicle: ${vehicle.username}<br>Load: ${vehicle.load}<br>Status: ${vehicle.status}`);

            if (vehicle.active_tasks.length > 0) {
                vehicle.active_tasks.forEach(task => {
                    // Connect vehicle to tasks with a line
                    L.polyline([[vehicle.location_lat, vehicle.location_lng], [task.request_lat, task.request_lng]], { color: 'blue' }).addTo(map);
                });
            }
        });

        // Requests
        data.requests.forEach(request => {
            const requestMarker = L.marker([request.location_lat, request.location_lng], { icon: L.divIcon({ className: 'request-marker' }) }).addTo(map);
            requestMarker.bindPopup(`Request by: ${request.citizen_name} (${request.citizen_phone})<br>Requested: ${request.item_type} (Qty: ${request.quantity})`);
        });

        // Offers
        data.offers.forEach(offer => {
            const offerMarker = L.marker([offer.location_lat, offer.location_lng], { icon: L.divIcon({ className: 'offer-marker' }) }).addTo(map);
            offerMarker.bindPopup(`Offer by: ${offer.citizen_name} (${offer.citizen_phone})<br>Offering: ${offer.item_type} (Qty: ${offer.quantity})`);
        });
    }

    function updateBaseLocation(lat, lng) {
        fetch("update_base_location.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latitude: lat, longitude: lng })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Base location updated successfully.");
            } else {
                alert("Failed to update base location.");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    // Initialize fetching data
    fetchAdminData();
});
