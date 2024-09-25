document.addEventListener("DOMContentLoaded", function () {
    const loadButton = document.getElementById("loadButton");
    const unloadButton = document.getElementById("unloadButton");
    const inventorySection = document.getElementById("inventorySection");
    const loadContainer = document.getElementById("loadContainer");
    const inventoryContainer = document.getElementById("inventoryContainer");
    const tasksContainer = document.getElementById("tasksContainer");
    const mapElement = document.getElementById("map");

    // Initialize Leaflet map
    const map = L.map(mapElement).setView([39.2466, 21.7346], 15); // Placeholder for the base coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Get current location of rescuer and enable buttons if within 100 meters of base
    function checkProximityToBase() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const rescuerLat = position.coords.latitude;
                const rescuerLng = position.coords.longitude;

                const baseLat = 39.2466; // Base coordinates
                const baseLng = 21.7346;

                const distance = getDistance(rescuerLat, rescuerLng, baseLat, baseLng);

                // Update rescuer location on the map
                L.marker([rescuerLat, rescuerLng]).addTo(map).bindPopup("Your Location").openPopup();
                map.setView([rescuerLat, rescuerLng]);

                if (distance <= 100) {
                    loadButton.disabled = false;
                    unloadButton.disabled = false;
                }
            });
        }
    }

    // Haversine formula to calculate distance between two lat/lng points in meters
    function getDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Radius of the Earth in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    // Fetch rescuer load, inventory, and tasks
    function fetchRescuerData() {
        fetch("rescuer_load.php")
            .then(response => response.json())
            .then(data => {
                loadContainer.innerHTML = generateLoadHTML(data.load);
                inventoryContainer.innerHTML = generateInventoryHTML(data.inventory);
                tasksContainer.innerHTML = generateTasksHTML(data.tasks);

                // Plot markers for requests and offers on the map
                plotMarkers(data.requests, data.offers);
            })
            .catch(error => console.error("Error:", error));
    }

    // Generate HTML for rescuer load
    function generateLoadHTML(load) {
        if (load.length === 0) return "<p>Your vehicle is empty.</p>";
        return load.map(item => `<p>${item.item_name}: ${item.quantity}</p>`).join("");
    }

    // Generate HTML for base inventory
    function generateInventoryHTML(inventory) {
        return inventory.map(item => `
            <label for="item_${item.item_id}">${item.item_name} (Available: ${item.quantity})</label>
            <input type="number" id="item_${item.item_id}" name="items[${item.item_id}]" min="0" max="${item.quantity}" value="0">
        `).join("");
    }

    // Generate HTML for current tasks
    function generateTasksHTML(tasks) {
        return tasks.map(task => `
            <div>
                <p>Citizen: ${task.citizen_name} (${task.citizen_phone})</p>
                <p>Date: ${task.date_entry}</p>
                <p>Item: ${task.item_type} (${task.item_quantity})</p>
                <button onclick="completeTask(${task.task_id})">Complete</button>
                <button onclick="cancelTask(${task.task_id})">Cancel</button>
            </div>
        `).join("");
    }

    // Plot markers for requests and offers on the map
    function plotMarkers(requests, offers) {
        requests.forEach(request => {
            const marker = L.marker([request.location_lat, request.location_lng], { icon: requestIcon });
            marker.bindPopup(`
                <strong>Request:</strong><br>
                ${request.citizen_name} (${request.citizen_phone})<br>
                ${request.date_entry}<br>
                ${request.item_type} (${request.item_quantity})<br>
                <button onclick="takeRequest(${request.request_id})">Take Request</button>
            `);
            marker.addTo(map);
        });

        offers.forEach(offer => {
            const marker = L.marker([offer.location_lat, offer.location_lng], { icon: offerIcon });
            marker.bindPopup(`
                <strong>Offer:</strong><br>
                ${offer.citizen_name} (${offer.citizen_phone})<br>
                ${offer.date_entry}<br>
                ${offer.item_type} (${offer.item_quantity})<br>
                <button onclick="takeOffer(${offer.offer_id})">Take Offer</button>
            `);
            marker.addTo(map);
        });
    }

    // Handle "Load Items" button click
    loadButton.addEventListener("click", () => {
        inventorySection.style.display = "block";
    });

    // Handle form submission for loading items
    document.getElementById("loadForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        fetch("load_items.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Items successfully loaded.");
                inventorySection.style.display = "none";
                fetchRescuerData();
            } else {
                alert("Failed to load items.");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // Handle "Unload Items" button click
    unloadButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to unload all items?")) {
            fetch("unload_items.php", { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Items successfully unloaded.");
                        fetchRescuerData();
                    } else {
                        alert("Failed to unload items.");
                    }
                })
                .catch(error => console.error("Error:", error));
        }
    });

    // Function to complete a task
    window.completeTask = function(taskId) {
        if (confirm("Are you sure you want to complete this task?")) {
            fetch(`complete_task.php?task_id=${taskId}`, { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Task completed successfully.");
                        fetchRescuerData();
                    } else {
                        alert("Failed to complete task.");
                    }
                })
                .catch(error => console.error("Error:", error));
        }
    };

    // Function to cancel a task
    window.cancelTask = function(taskId) {
        if (confirm("Are you sure you want to cancel this task?")) {
            fetch(`cancel_task.php?task_id=${taskId}`, { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Task canceled successfully.");
                        fetchRescuerData();
                    } else {
                        alert("Failed to cancel task.");
                    }
                })
                .catch(error => console.error("Error:", error));
        }
    };

    // Function to take over a request
    window.takeRequest = function(requestId) {
        fetch(`take_request.php?request_id=${requestId}`, { method: "POST" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Request taken over successfully.");
                    fetchRescuerData();
                } else {
                    alert("Failed to take over request.");
                }
            })
            .catch(error => console.error("Error:", error));
    };

    // Function to take over an offer
    window.takeOffer = function(offerId) {
        fetch(`take_offer.php?offer_id=${offerId}`, { method: "POST" })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Offer taken over successfully.");
                    fetchRescuerData();
                } else {
                    alert("Failed to take over offer.");
                }
            })
            .catch(error => console.error("Error:", error));
    };

    checkProximityToBase(); // Check proximity to base on load
    fetchRescuerData(); // Fetch current load, inventory, and tasks on load
});
