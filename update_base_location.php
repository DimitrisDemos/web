<?php
session_start();
include('config.php');

$data = json_decode(file_get_contents("php://input"), true);
$latitude = $data['latitude'];
$longitude = $data['longitude'];

// Update base location in the database (make sure to adjust the query according to your database structure)
$updateQuery = "UPDATE BaseLocation SET latitude = ?, longitude = ?"; // Assuming you have a BaseLocation table
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param('dd', $latitude, $longitude);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

$updateStmt->close();
$conn->close();
