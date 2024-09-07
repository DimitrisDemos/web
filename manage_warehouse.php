<?php
session_start();
if ($_SESSION['user_type'] != 'Admin') {
    header('Location: home.html');
    exit;
}

include('config.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $category_id = $_POST['category_id'];
    $item_name = $_POST['item_name'];
    $quantity = $_POST['quantity'];

    // Insert the new item into the Items table
    $stmt = $conn->prepare("INSERT INTO Items (item_name, category_id) VALUES (?, ?)");
    $stmt->bind_param("si", $item_name, $category_id);
    $stmt->execute();

    // Get the inserted item's ID
    $item_id = $stmt->insert_id;

    // Insert the item into the Inventory table
    $stmt = $conn->prepare("INSERT INTO Inventory (item_id, quantity) VALUES (?, ?)");
    $stmt->bind_param("ii", $item_id, $quantity);
    $stmt->execute();

    } else {
        // Debugging output (optional)
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
/*

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['add_item'])) {
        $item_name = $_POST['item_name'];
        $category_id = $_POST['category_id'];
        $quantity = $_POST['quantity'];

        $query = "INSERT INTO Items (category_id, name) VALUES ('$category_id', '$item_name')";
        mysqli_query($conn, $query);
        $item_id = mysqli_insert_id($conn);

        $query = "INSERT INTO Inventory (item_id, quantity, location, location_id) VALUES ('$item_id', '$quantity', 'Base', 1)";
        mysqli_query($conn, $query);
    } elseif (isset($_POST['update_quantity'])) {
        $inventory_id = $_POST['inventory_id'];
        $new_quantity = $_POST['new_quantity'];

        $query = "UPDATE Inventory SET quantity = '$new_quantity' WHERE id = '$inventory_id'";
        mysqli_query($conn, $query);
    }
}

$query = "SELECT Inventory.id AS inventory_id, Items.name AS item_name, Categories.name AS category_name, Inventory.quantity 
          FROM Inventory 
          JOIN Items ON Inventory.item_id = Items.id 
          JOIN Categories ON Items.category_id = Categories.id 
          WHERE Inventory.location = 'Base'";
$result = mysqli_query($conn, $query);

$categories = mysqli_query($conn, "SELECT * FROM Categories");
*/
?>

