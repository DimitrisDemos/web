<?php
session_start();
include('../config.php'); // Adjust path to your config file

header('Content-Type: application/json');

// Ensure that the user is an admin
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'Admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit();
}

// Get admin ID from session (assuming admin ID is stored in session during login)
$admin_id = $_SESSION['user_id'];

// Process the form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $announcement_text = trim($_POST['announcement_text']);

    if (empty($announcement_text)) {
        echo json_encode(['success' => false, 'message' => 'Announcement text cannot be empty.']);
        exit();
    }

    // Insert the announcement into the database
    $stmt = $conn->prepare("INSERT INTO Announcements (admin_id, announcement_text) VALUES (?, ?)");
    $stmt->bind_param('is', $admin_id, $announcement_text);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Announcement created successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create announcement. Please try again.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
