// Initialize the map centered on Patras, Greece
const map = L.map('map').setView([38.2466, 21.7346], 13);  // Coordinates for Patras, Greece

// Load and display map tiles from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define custom icons for vehicles, requests, and offers
const baseIcon = L.icon({
    iconUrl: 'base-icon.png',  // Replace with your own base icon
    iconSize: [50, 50],  // Make icons larger
    iconAnchor: [25, 50],  // Anchor the icon to the bottom
    popupAnchor: [0, -50]  // Adjust popup position
});

const vehicleIcon = L.icon({
    iconUrl: 'vehicle-icon.png',  // Replace with your own vehicle icon
    iconSize: [50, 50],  // Make icons larger
    iconAnchor: [25, 50],  // Anchor the icon to the bottom
    popupAnchor: [0, -50]  // Adjust popup position
});

const pendingRequestIcon = L.icon({
    iconUrl: 'pending-request-icon.png',  // Replace with your own pending request icon
    iconSize: [40, 40],  // Make icons larger
    iconAnchor: [20, 40],  // Anchor the icon to the bottom
    popupAnchor: [0, -40]  // Adjust popup position
});

const processedRequestIcon = L.icon({
    iconUrl: 'processed-request-icon.png',  // Replace with your own processed request icon
    iconSize: [40, 40],  // Make icons larger
    iconAnchor: [20, 40],  // Anchor the icon to the bottom
    popupAnchor: [0, -40]  // Adjust popup position
});

const pendingOfferIcon = L.icon({
    iconUrl: 'pending-offer-icon.png',  // Replace with your own pending offer icon
    iconSize: [40, 40],  // Make icons larger
    iconAnchor: [20, 40],  // Anchor the icon to the bottom
    popupAnchor: [0, -40]  // Adjust popup position
});

const processedOfferIcon = L.icon({
    iconUrl: 'processed-offer-icon.png',  // Replace with your own processed offer icon
    iconSize: [40, 40],  // Make icons larger
    iconAnchor: [20, 40],  // Anchor the icon to the bottom
    popupAnchor: [0, -40]  // Adjust popup position
});

// Function to load markers for the base, vehicles, requests, and offers
function loadMarkers() {
    fetch('fetch_map_data.php')  // Fetch data from backend
        .then(response => response.json())
        .then(data => {
            // Ensure data is valid and properly structured
            const vehicles = data.vehicles || [];
            const requests = data.requests || [];
            const offers = data.offers || [];

            // Add base marker (Assuming you have a single base with coordinates)
            L.marker([38.2466, 21.7346], { icon: baseIcon }).addTo(map)
                .bindPopup('Base Location');

            // Iterate through vehicles and add vehicle markers
            vehicles.forEach(vehicle => {
                if (vehicle.lat && vehicle.lng) {
                    const vehicleMarker = L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon }).addTo(map);
                    vehicleMarker.bindPopup(`
                        <strong>Vehicle: ${vehicle.username || 'Unknown'}</strong><br>
                        Load Capacity: ${vehicle.load_capacity || 'N/A'}<br>
                        Status: ${vehicle.status || 'N/A'}<br>
                        ${vehicle.tasks && vehicle.tasks.length > 0 ? 'Active tasks: ' + vehicle.tasks.map(task => task.item_name).join(', ') : 'No active tasks'}
                    `);

                    // Draw lines to tasks if vehicle has active tasks
                    if (vehicle.tasks) {
                        vehicle.tasks.forEach(task => {
                            if (task.lat && task.lng) {
                                L.polyline([[vehicle.lat, vehicle.lng], [task.lat, task.lng]], { color: 'blue' }).addTo(map);
                            }
                        });
                    }
                }
            });

            // Iterate through requests and add request markers
            requests.forEach(request => {
                if (request.lat && request.lng) {
                    const requestIcon = request.processed ? processedRequestIcon : pendingRequestIcon;
                    const requestMarker = L.marker([request.lat, request.lng], { icon: requestIcon }).addTo(map);
                    requestMarker.bindPopup(`
                        <strong>Request from: ${request.citizen_name || 'Unknown'}</strong><br>
                        Phone: ${request.phone || 'N/A'}<br>
                        Date: ${request.date || 'N/A'}<br>
                        Item: ${request.item_name || 'N/A'}<br>
                        Quantity: ${request.quantity || 'N/A'}<br>
                        Pickup by: ${request.vehicle_username || 'Not picked up yet'}
                    `);

                    // Draw a line if the request is picked up by a vehicle
                    if (request.vehicle_lat && request.vehicle_lng) {
                        L.polyline([[request.lat, request.lng], [request.vehicle_lat, request.vehicle_lng]], { color: 'green' }).addTo(map);
                    }
                }
            });

            // Iterate through offers and add offer markers
            offers.forEach(offer => {
                if (offer.lat && offer.lng) {
                    const offerIcon = offer.processed ? processedOfferIcon : pendingOfferIcon;
                    const offerMarker = L.marker([offer.lat, offer.lng], { icon: offerIcon }).addTo(map);
                    offerMarker.bindPopup(`
                        <strong>Offer from: ${offer.citizen_name || 'Unknown'}</strong><br>
                        Phone: ${offer.phone || 'N/A'}<br>
                        Date: ${offer.date || 'N/A'}<br>
                        Item: ${offer.item_name || 'N/A'}<br>
                        Quantity: ${offer.quantity || 'N/A'}<br>
                        Pickup by: ${offer.vehicle_username || 'Not picked up yet'}
                    `);

                    // Draw a line if the offer is picked up by a vehicle
                    if (offer.vehicle_lat && offer.vehicle_lng) {
                        L.polyline([[offer.lat, offer.lng], [offer.vehicle_lat, offer.vehicle_lng]], { color: 'red' }).addTo(map);
                    }
                }
            });
        })
        .catch(error => console.error('Error loading map data:', error));
}

// Call the function to load markers
loadMarkers();
