// Initialize the map centered around Patras, Greece
var map = L.map('map').setView([38.2466, 21.7346], 13); // Coordinates for Patras

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Example markers for the base, rescuers, requests, and offers
// Replace these with dynamic data fetched from the database
var baseLocation = L.marker([38.2466, 21.7346]).addTo(map)
    .bindPopup('Base Location');

var vehicleMarker = L.marker([38.2500, 21.7400]).addTo(map)
    .bindPopup('Vehicle 1: Loaded with supplies');

var requestMarker = L.marker([38.2400, 21.7300], {icon: L.icon({iconUrl: 'icons/request.png', iconSize: [20, 20]})}).addTo(map)
    .bindPopup('Request: 10 Bottles of Water<br>By: John Doe<br>Phone: 1234567890');

var offerMarker = L.marker([38.2600, 21.7500], {icon: L.icon({iconUrl: 'icons/offer.png', iconSize: [20, 20]})}).addTo(map)
    .bindPopup('Offer: 5 First Aid Kits<br>By: Jane Smith<br>Phone: 0987654321');

// Function to update the base location
function updateBaseLocation() {
    // Add logic to update base location here
    alert('Base location updated!');
}

// Make the map draggable and confirm the base location change
map.on('click', function(e) {
    if (confirm("Do you want to set the base location here?")) {
        baseLocation.setLatLng(e.latlng);
        updateBaseLocation();
    }
});
