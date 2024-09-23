<?php
header('Content-Type: application/json');
include('config.php');

$citizen_id = 1; // You should get the actual citizen_id from session or authentication

$sql = "SELECT * FROM Offers WHERE citizen_id = $citizen_id";
$result = $conn->query($sql);

$offers = [];
while ($row = $result->fetch_assoc()) {
    $offers[] = $row;
}

echo json_encode(['offers' => $offers]);
?>
