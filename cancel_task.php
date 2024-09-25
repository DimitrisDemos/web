<?php
session_start();
include('config.php');

$task_id = $_GET['task_id'];
$rescuer_id = $_SESSION['user_id'];

// Cancel the task
$updateQuery = "UPDATE Tasks SET status = 'pending', rescuer_id = NULL WHERE task_id = ? AND rescuer_id = ?";
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param('ii', $task_id, $rescuer_id);
$updateStmt->execute();

$response = ['success' => true];
header('Content-Type: application/json');
echo json_encode($response);
