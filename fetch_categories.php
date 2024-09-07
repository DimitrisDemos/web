<?php
include('config.php');

// Fetch categories
$sql = "SELECT category_id, category_name FROM Categories";
$result = $conn->query($sql);

$categories = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
}

echo json_encode($categories);

$conn->close();
?>