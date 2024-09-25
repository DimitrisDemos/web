// take_request.php
<?php
session_start();
include('config.php');

$request_id = $_GET['request_id'];
$rescuer_id = $_SESSION['user_id'];

// Update the request to assign it to the rescuer
$updateQuery = "UPDATE Requests SET status = 'taken', rescuer_id = ? WHERE request_id = ? AND status = 'pending'";
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param('ii', $rescuer_id, $request_id);
$updateStmt->execute();

$response = ['success' => true];
header('Content-Type: application/json');
echo json_encode($response);
