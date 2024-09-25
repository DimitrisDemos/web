// take_offer.php
<?php
session_start();
include('config.php');

$offer_id = $_GET['offer_id'];
$rescuer_id = $_SESSION['user_id'];

// Update the offer to assign it to the rescuer
$updateQuery = "UPDATE Offers SET status = 'taken', rescuer_id = ? WHERE offer_id = ? AND status = 'pending'";
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param('ii', $rescuer_id, $offer_id);
$updateStmt->execute();

$response = ['success' => true];
header('Content-Type: application/json');
echo json_encode($response);
