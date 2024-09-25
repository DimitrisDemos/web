<?php
session_start();
include('config.php');

$rescuer_id = $_SESSION['user_id'];

// Fetch rescuer's current load
$loadQuery = "SELECT Items.item_name, Load.quantity FROM Load 
              JOIN Items ON Load.item_id = Items.item_id 
              WHERE Load.rescuer_id = ?";
$loadStmt = $conn->prepare($loadQuery);
$loadStmt->bind_param('i', $rescuer_id);
$loadStmt->execute();
$loadResult = $loadStmt->get_result();
$load = $loadResult->fetch_all(MYSQLI_ASSOC);

// Fetch base inventory
$inventoryQuery = "SELECT item_id, item_name, quantity FROM Items";
$inventoryResult = $conn->query($inventoryQuery);
$inventory = $inventoryResult->fetch_all(MYSQLI_ASSOC);

// Fetch current tasks
$tasksQuery = "SELECT * FROM Tasks WHERE rescuer_id = ?";
$tasksStmt = $conn->prepare($tasksQuery);
$tasksStmt->bind_param('i', $rescuer_id);
$tasksStmt->execute();
$tasksResult = $tasksStmt->get_result();
$tasks = $tasksResult->fetch_all(MYSQLI_ASSOC);

// Fetch requests and offers
$requestsQuery = "SELECT * FROM Requests WHERE status = 'pending'";
$requestsResult = $conn->query($requestsQuery);
$requests = $requestsResult->fetch_all(MYSQLI_ASSOC);

$offersQuery = "SELECT * FROM Offers WHERE status = 'pending'";
$offersResult = $conn->query($offersQuery);
$offers = $offersResult->fetch_all(MYSQLI_ASSOC);

// Prepare the response
$response = [
    'load' => $load,
    'inventory' => $inventory,
    'tasks' => $tasks,
    'requests' => $requests,
    'offers' => $offers
];

// Send the response back as JSON
header('Content-Type: application/json');
echo json_encode($response);
