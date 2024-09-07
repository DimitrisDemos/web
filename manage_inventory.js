document.addEventListener('DOMContentLoaded', () => {
    loadInventory();

    function loadInventory() {
        fetch('fetch_inventory.php')
            .then(response => response.json())
            .then(data => {
                const inventoryTable = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
                inventoryTable.innerHTML = ''; // Clear any existing rows

                data.forEach(item => {
                    const row = inventoryTable.insertRow();

                    const categoryCell = row.insertCell(0);
                    categoryCell.textContent = item.category_name;

                    const itemCell = row.insertCell(1);
                    itemCell.textContent = item.item_name;

                    const quantityCell = row.insertCell(2);
                    quantityCell.textContent = item.quantity;
                });
            });
    }

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

    document.getElementById('add-item-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        
        fetch('manage_warehouse.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Form submitted:', data); // Debugging output
            loadInventory(); // Reload the inventory table
            this.reset(); // Clear the form
        })
        .catch(error => console.error('Error submitting form:', error));
    });
});