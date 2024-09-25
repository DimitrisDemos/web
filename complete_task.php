<?php
session_start();
include('config.php');

$task_id = $_GET['task_id'];
$rescuer_id = $_SESSION['user_id'];

// Complete the task
$updateQuery = "UPDATE Tasks SET status = 'completed' WHERE task_id = ? AND rescuer_id = ?";
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param('ii', $task_id, $rescuer_id);
$updateStmt->execute();

// Fetch the task details to update the load
$taskQuery = "SELECT item_id, quantity FROM Tasks WHERE task_id = ?";
$taskStmt = $conn->prepare($taskQuery);
$taskStmt->bind_param('i', $task_id);
$taskStmt->execute();
$taskResult = $taskStmt->get_result()->fetch_assoc();

$item_id = $taskResult['item_id'];
$quantity = $taskResult['quantity'];

// Update the Load table (remove the item)
$deleteQuery = "DELETE FROM Load WHERE rescuer_id = ? AND item_id = ?";
$deleteStmt = $conn->prepare($deleteQuery);
$deleteStmt->bind_param('ii', $rescuer_id, $item_id);
$deleteStmt->execute();

// Respond with success
$response = ['success' => true];
header('Content-Type: application/json');
echo json_encode($response);
