<?php
session_start();
include('config.php');

// Check if the user is logged in and is an admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'Admin') {
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Map</title>
    <link rel="stylesheet" href="admin_map.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
</head>
<body>
    <div class="dashboard-container">
        <h2>Administrator Map</h2>
        <div id="map"></div>
    </div>

    <script src="admin_map.js"></script>
</body>
</html>
