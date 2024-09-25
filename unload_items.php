<?php
session_start();
include('config.php');

$rescuer_id = $_SESSION['user_id'];

// Fetch current load of the rescuer
$loadQuery = "SELECT item_id, quantity FROM Load WHERE rescuer_id = ?";
$loadStmt = $conn->prepare($loadQuery);
$loadStmt->bind_param('i', $rescuer_id);
$loadStmt->execute();
$loadResult = $loadStmt->get_result();

while ($item = $loadResult->fetch_assoc()) {
    $item_id = $item['item_id'];
    $quantity = $item['quantity'];

    // Add back to Items table
    $updateQuery = "UPDATE Items SET quantity = quantity + ? WHERE item_id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param('ii', $quantity, $item_id);
    $updateStmt->execute();
}

// Clear the Load table for the rescuer
$deleteQuery = "DELETE FROM Load WHERE rescuer_id = ?";
$deleteStmt = $conn->prepare($deleteQuery);
$deleteStmt->bind_param('i', $rescuer_id);
$deleteStmt->execute();

$response = ['success' => true];
header('Content-Type: application/json');
echo json_encode($response);
