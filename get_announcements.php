<?php
header('Content-Type: application/json');
include('config.php');

$sql = "SELECT * FROM Announcements";
$result = $conn->query($sql);

$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

echo json_encode(['announcements' => $announcements]);
?>
