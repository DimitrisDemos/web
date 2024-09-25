<?php
session_start();
include('config.php');

// Fetch base location (this is a placeholder; you will need to implement your logic to get this)
$baseLocationQuery = "SELECT latitude, longitude FROM BaseLocation LIMIT 1"; // Assuming you have a BaseLocation table
$baseLocationResult = $conn->query($baseLocationQuery);
$baseLocation = $baseLocationResult->fetch_assoc();

$base_latitude = $baseLocation['latitude'];
$base_longitude = $baseLocation['longitude'];

// Fetch vehicles
$vehiclesQuery = "SELECT * FROM Vehicles"; // Assuming you have a Vehicles table
$vehiclesResult = $conn->query($vehiclesQuery);
$vehicles = [];

while ($vehicle = $vehiclesResult->fetch_assoc()) {
    // Fetch active tasks for this vehicle
    $tasksQuery = "SELECT * FROM Tasks WHERE vehicle_id = ? AND status = 'active'";
    $tasksStmt = $conn->prepare($tasksQuery);
    $tasksStmt->bind_param('i', $vehicle['id']);
    $tasksStmt->execute();
    $tasksResult = $tasksStmt->get_result();
    $active_tasks = $tasksResult->fetch_all(MYSQLI_ASSOC);

    $vehicles[] = [
        'username' => $vehicle['username'],
        'location_lat' => $vehicle['latitude'],
        'location_lng' => $vehicle['longitude'],
        'load' => $vehicle['load'],
        'status' => $vehicle['status'],
        'active_tasks' => $active_tasks
    ];
}

// Fetch requests
$requestsQuery = "SELECT * FROM Requests WHERE status = 'pending'";
$requestsResult = $conn->query($requestsQuery);
$requests = $requestsResult->fetch_all(MYSQLI_ASSOC);

// Fetch offers
$offersQuery = "SELECT * FROM Offers WHERE status = 'pending'";
$offersResult = $conn->query($offersQuery);
$offers = $offersResult->fetch_all(MYSQLI_ASSOC);

// Prepare the response
$response = [
    'base_latitude' => $base_latitude,
    'base_longitude' => $base_longitude,
    'vehicles' => $vehicles,
    'requests' => $requests,
    'offers' => $offers
];

// Send the response back as JSON
header('Content-Type: application/json');
echo json_encode($response);
