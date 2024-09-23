<?php
header('Content-Type: application/json');
include('config.php');

$data = json_decode(file_get_contents('php://input'), true);

$announcement_id = $data['announcementId'];
$item = $data['item'];
$quantity = $data['quantity'];
$citizen_id = 1; // You should get the actual citizen_id from session or authentication

$sql = "INSERT INTO Offers (citizen_id, announcement_id, item_name, quantity, offer_status) 
        VALUES ($citizen_id, $announcement_id, '$item', $quantity, 'Pending')";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>
