<?php
header('Content-Type: application/json');
include('config.php');

$citizen_id = 1; // You should get the actual citizen_id from session or authentication

$sql = "SELECT r.request_id, i.item_name, r.quantity AS number_of_people, r.request_status 
        FROM Requests r 
        JOIN Items i ON r.item_id = i.item_id 
        WHERE r.citizen_id = $citizen_id";
$result = $conn->query($sql);

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode(['requests' => $requests]);
?>
