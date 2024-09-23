document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    loadCategories();

    function loadInventory() {
        fetch('fetch_inventory.php')
            .then(response => response.json())
            .then(data => {
                const inventoryTable = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
                inventoryTable.innerHTML = ''; // Clear existing rows

                data.forEach(item => {
                    const row = inventoryTable.insertRow();

                    const categoryCell = row.insertCell(0);
                    categoryCell.textContent = item.category_name;

                    const itemCell = row.insertCell(1);
                    itemCell.textContent = item.item_name;

                    const quantityCell = row.insertCell(2);
                    quantityCell.textContent = item.quantity;

                    // Add increase quantity form
                    const increaseCell = row.insertCell(3);
                    const increaseForm = document.createElement('form');
                    increaseForm.innerHTML = `
                        <input type="hidden" name="item_id" value="${item.item_id}">
                        <input type="number" name="increase_quantity" min="1" placeholder="Increase by">
                        <button type="submit">Update</button>
                    `;
                    increaseForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const formData = new FormData(this);

                        console.log([...formData.entries()]);  // Debugging output: Check if item_id and increase_quantity are correctly passed
                        
                        fetch('update_quantity.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.text())
                        .then(data => {
                            console.log('Quantity updated:', data);
                            loadInventory(); // Reload the inventory table after update
                        })
                        .catch(error => console.error('Error updating quantity:', error));
                    });
                    increaseCell.appendChild(increaseForm);
                });
            })
            .catch(error => console.error('Error loading inventory:', error));
    }

    // Load categories for the dropdown
    function loadCategories() {
        fetch('fetch_categories.php')
            .then(response => response.json())
            .then(data => {
                const categorySelect = document.getElementById('category_id');
                categorySelect.innerHTML = ''; // Clear existing options

                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.category_id;
                    option.textContent = category.category_name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading categories:', error));
    }

    // Handle form submission for adding new items
    document.getElementById('add-item-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        
        console.log([...formData.entries()]); // Debugging: check if item_id and increase_quantity are correct

        fetch('manage_warehouse.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Form submitted:', data);  // Debugging output
            loadInventory();  // Reload the inventory table
            this.reset();  // Clear the form
        })
        .catch(error => console.error('Error submitting form:', error));
    });
});
