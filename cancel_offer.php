<?php
header('Content-Type: application/json');
include('config.php');

$data = json_decode(file_get_contents('php://input'), true);

$offer_id = $data['offer_id'];

$sql = "UPDATE Offers SET offer_status = 'Cancelled' WHERE offer_id = $offer_id";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>
