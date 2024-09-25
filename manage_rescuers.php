<?php
session_start();
include('../config.php'); // Adjust the path to the config file

header('Content-Type: application/json');

// Ensure the user is logged in and is an admin
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'Admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit();
}

// Initialize variables for error messages
$error = '';

// Process the form data
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $fullname = trim($_POST['fullname']);
    $phone = trim($_POST['phone']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Basic validation
    if (empty($username) || empty($fullname) || empty($phone) || empty($password) || empty($confirm_password)) {
        $error = "All fields are required.";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match.";
    } else {
        // Check if username already exists
        $stmt = $conn->prepare("SELECT user_id FROM Users WHERE username = ?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $error = "Username already taken.";
        } else {
            // Hash the password for security
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            // Insert the new rescuer into the database
            $stmt = $conn->prepare("INSERT INTO Users (username, password, fullname, phone, user_type) VALUES (?, ?, ?, ?, 'Rescuer')");
            $stmt->bind_param('ssss', $username, $hashed_password, $fullname, $phone);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Rescuer account created successfully.']);
                exit();
            } else {
                $error = "Something went wrong. Please try again.";
            }
        }

        $stmt->close();
    }

    // If there is an error, return it as a JSON response
    echo json_encode(['success' => false, 'message' => $error]);
    exit();
}

// Close the connection
$conn->close();
?>
