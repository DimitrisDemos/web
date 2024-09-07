<?php
session_start();
include('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

     // Basic query to find the user
     $sql = "SELECT * FROM Users WHERE username = '$username' AND password = '$password'";
     $result = mysqli_query($conn, $sql);

    
    // Check if a user is found
    if (mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_assoc($result);

        // Store user information in the session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_type'] = $user['user_type'];

        // Redirect based on user type
        if ($user['user_type'] == 'Admin') {
            header("Location: admin_dashboard.html");
        } elseif ($user['user_type'] == 'Rescuer') {
            header("Location: home.html");
        } else {
            header("Location: home.html");
        }
        exit();
    } else {
        echo "Invalid username or password.";
    }

}
?>
