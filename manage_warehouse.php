<?php
session_start();
if ($_SESSION['user_type'] != 'Admin') {
    header('Location: home.html');
    exit;
}
include('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $category_id = isset($_POST['category_id']) ? $_POST['category_id'] : null;  // Get category_id properly
    $item_name = $_POST['item_name'];
    $quantity = $_POST['quantity'];

    if ($category_id && $item_name && $quantity) {
        // Insert the new item into the Items table
        $stmt = $conn->prepare("INSERT INTO Items (item_name, category_id) VALUES (?, ?)");
        $stmt->bind_param("si", $item_name, $category_id);
        
        if ($stmt->execute()) {
            // Get the inserted item's ID
            $item_id = $stmt->insert_id;

            // Insert the item into the Inventory table
            $stmt = $conn->prepare("INSERT INTO Inventory (item_id, quantity) VALUES (?, ?)");
            $stmt->bind_param("ii", $item_id, $quantity);
            
            if ($stmt->execute()) {
                echo "Item added successfully!";
            } else {
                echo "Error adding to inventory: " . $stmt->error;
            }
        } else {
            echo "Error adding item: " . $stmt->error;
        }
    } else {
        echo "Invalid input data.";
    }

    $stmt->close();
    $conn->close();
}
?>



