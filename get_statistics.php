<?php
header('Content-Type: application/json');
include('config.php'); // Database connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];

    // Prepare the query
    $sql = "
        SELECT 
            (SELECT COUNT(*) FROM Requests WHERE request_status = 'Pending' AND created_at BETWEEN ? AND ?) AS new_requests,
            (SELECT COUNT(*) FROM Requests WHERE request_status = 'Completed' AND created_at BETWEEN ? AND ?) AS completed_requests,
            (SELECT COUNT(*) FROM Offers WHERE offer_status = 'Pending' AND created_at BETWEEN ? AND ?) AS new_offers,
            (SELECT COUNT(*) FROM Offers WHERE offer_status = 'Completed' AND created_at BETWEEN ? AND ?) AS completed_offers
        ";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssss', $start_date, $end_date, $start_date, $end_date, $start_date, $end_date, $start_date, $end_date);
    $stmt->execute();
    
    $result = $stmt->get_result()->fetch_assoc();
    
    // Return the result as JSON
    echo json_encode($result);
}
?>
