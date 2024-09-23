<?php
include('config.php');

// SQL query to fetch category name, item name, and quantity
$sql = "
    SELECT Items.item_id, Categories.category_name, Items.item_name, Inventory.quantity
    FROM Inventory
    JOIN Items ON Inventory.item_id = Items.item_id
    JOIN Categories ON Items.category_id = Categories.category_id
";
$result = $conn->query($sql);

$inventory = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $inventory[] = $row;
    }
}

// Return the data as JSON
echo json_encode($inventory);

$conn->close();
?>