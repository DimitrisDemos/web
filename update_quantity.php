<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $item_id = isset($_POST['item_id']) ? $_POST['item_id'] : null;
    $increase_quantity = isset($_POST['increase_quantity']) ? (int) $_POST['increase_quantity'] : null;

    if ($item_id && $increase_quantity > 0) {
        // Add debug output to see if the values are correct
        echo "Updating item_id: $item_id with quantity: $increase_quantity ";

        // Update the quantity of the item in the Inventory table
        $stmt = $conn->prepare("UPDATE Inventory SET quantity = quantity + ? WHERE item_id = ?");
        $stmt->bind_param("ii", $increase_quantity, $item_id);

        if ($stmt->execute()) {
            echo "Quantity updated successfully!";
        } else {
            echo "Error updating quantity: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Invalid item_id or quantity.";
    }
}

$conn->close();
?>
