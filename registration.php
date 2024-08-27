<?php
session_start();
include('config.php');

// Initialize variables for error messages and success messages
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $fullname = trim($_POST['fullname']);
    $phone = trim($_POST['phone']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $user_type = $_POST['user_type'];

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
            // Insert the new user into the database
            $stmt = $conn->prepare("INSERT INTO Users (username, password, fullname, phone, user_type) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param('sssss', $username, $password, $fullname, $phone, $user_type);

            if ($stmt->execute()) {
                $success = "Registration successful. You can now <a href='login.php'>login</a>.";
            } else {
                $error = "Something went wrong. Please try again.";
            }
        }

        $stmt->close();
    }
    $conn->close();
}
?>
