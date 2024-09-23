<?php
header('Content-Type: application/json');
include('config.php');

$data = json_decode(file_get_contents('php://input'), true);

$item = $data['item'];
$category = $data['category'];
$people = $data['people'];
$citizen_id = 1; // You should get the actual citizen_id from session or authentication

$sql = "INSERT INTO Requests (citizen_id, item_id, quantity, request_status) 
        SELECT $citizen_id, item_id, $people, 'Pending'
        FROM Items WHERE item_name = '$item' AND category_id = $category";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>
