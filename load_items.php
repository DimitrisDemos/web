<?php
session_start();
include('config.php');

$rescuer_id = $_SESSION['user_id'];
$items = $_POST['items'];

// Loop through the items to load them
foreach ($items as $item_id => $quantity) {
    if ($quantity > 0) {
        // Check if the item exists in the inventory
        $checkQuery = "SELECT quantity FROM Items WHERE item_id = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param('i', $item_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result()->fetch_assoc();

        if ($checkResult['quantity'] >= $quantity) {
            // Add to Load table
            $insertQuery = "INSERT INTO Load (rescuer_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?";
            $insertStmt = $conn->prepare($insertQuery);
            $insertStmt->bind_param('iiii', $rescuer_id, $item_id, $quantity, $quantity);
            $insertStmt->execute();

            // Update the Items table
            $updateQuery = "UPDATE Items SET quantity = quantity - ? WHERE item_id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param('ii', $quantity, $item_id);
            $updateStmt->execute();
        }
    }
}

$response = ['success' => true];
header('Content-Type: application/json');
echo json_encode($response);
