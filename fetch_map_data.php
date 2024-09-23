<?php
include('config.php');

// Fetch all vehicles and their active tasks
$vehicles = [];
$vehicleQuery = "
    SELECT v.vehicle_id, u.username AS rescuer_name, v.load_capacity, v.status, ST_X(v.current_location) AS lat, ST_Y(v.current_location) AS lng
    FROM Vehicles v
    JOIN Users u ON v.rescuer_id = u.user_id";
$result = $conn->query($vehicleQuery);

if (!$result) {
    echo json_encode(['error' => 'Database query failed: ' . $conn->error]);
    exit;
}

while ($row = $result->fetch_assoc()) {
    $vehicleId = $row['vehicle_id'];

    // Fetch tasks for the vehicle (both requests and offers)
    $tasks = [];
    $taskQuery = "
        SELECT t.task_type, i.item_name, ST_X(v.current_location) AS lat, ST_Y(v.current_location) AS lng
        FROM Tasks t
        LEFT JOIN Requests r ON (t.task_type = 'Request' AND t.task_id_ref = r.request_id)
        LEFT JOIN Offers o ON (t.task_type = 'Offer' AND t.task_id_ref = o.offer_id)
        LEFT JOIN Items i ON (t.task_type = 'Request' AND r.item_id = i.item_id)
        LEFT JOIN Items i2 ON (t.task_type = 'Offer' AND o.item_id = i2.item_id)
        LEFT JOIN Vehicles v ON t.vehicle_id = v.vehicle_id
        WHERE t.vehicle_id = $vehicleId";
    $taskResult = $conn->query($taskQuery);

    if (!$taskResult) {
        echo json_encode(['error' => 'Database query failed: ' . $conn->error]);
        exit;
    }

    while ($taskRow = $taskResult->fetch_assoc()) {
        $tasks[] = $taskRow;
    }

    $row['tasks'] = $tasks;
    $vehicles[] = $row;
}

// Fetch pending and processed requests
$requests = [];
$requestQuery = "
    SELECT r.request_id, r.citizen_id, u.username AS citizen_name, r.quantity, r.request_status, i.item_name,
           v.username AS vehicle_username, ST_X(v.current_location) AS vehicle_lat, ST_Y(v.current_location) AS vehicle_lng
    FROM Requests r
    JOIN Users u ON r.citizen_id = u.user_id
    LEFT JOIN Items i ON r.item_id = i.item_id
    LEFT JOIN Tasks t ON t.task_id_ref = r.request_id AND t.task_type = 'Request'
    LEFT JOIN Vehicles v ON t.vehicle_id = v.vehicle_id";
$requestResult = $conn->query($requestQuery);

if (!$requestResult) {
    echo json_encode(['error' => 'Database query failed: ' . $conn->error]);
    exit;
}

while ($requestRow = $requestResult->fetch_assoc()) {
    $requestRow['processed'] = $requestRow['request_status'] !== 'Pending';
    $requests[] = $requestRow;
}

// Fetch pending and processed offers
$offers = [];
$offerQuery = "
    SELECT o.offer_id, o.citizen_id, u.username AS citizen_name, o.quantity, o.offer_status, i.item_name,
           v.username AS vehicle_username, ST_X(v.current_location) AS vehicle_lat, ST_Y(v.current_location) AS vehicle_lng
    FROM Offers o
    JOIN Users u ON o.citizen_id = u.user_id
    LEFT JOIN Items i ON o.item_id = i.item_id
    LEFT JOIN Tasks t ON t.task_id_ref = o.offer_id AND t.task_type = 'Offer'
    LEFT JOIN Vehicles v ON t.vehicle_id = v.vehicle_id";
$offerResult = $conn->query($offerQuery);

if (!$offerResult) {
    echo json_encode(['error' => 'Database query failed: ' . $conn->error]);
    exit;
}

while ($offerRow = $offerResult->fetch_assoc()) {
    $offerRow['processed'] = $offerRow['offer_status'] !== 'Pending';
    $offers[] = $offerRow;
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode([
    'vehicles' => $vehicles,
    'requests' => $requests,
    'offers' => $offers
]);

$conn->close();
?>
