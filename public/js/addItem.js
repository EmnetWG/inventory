// Show modal when "Add Item Type" button is clicked
document.getElementById('showAddItemFormBtn').addEventListener('click', function () {
  const modal = document.getElementById('itemTypeModal');
  modal.style.display = 'block';
  // Clear the form when adding a new item type
  document.getElementById('itemTypeName').value = '';
  document.getElementById('itemTypeId').value = '';
});

// Close the modal if the user clicks on the "x" button
/*
document.querySelector('.close').addEventListener('click', function () {
  const modal = document.getElementById('itemTypeModal');
  modal.style.display = 'none';
});
*/
// Close the modal if the user clicks outside the modal content
window.addEventListener('click', function (e) {
  const modal = document.getElementById('itemTypeModal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Handle form submission for both Add and Update
document.getElementById('addItemTypeForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('itemTypeName').value;
  const id = document.getElementById('itemTypeId').value;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/item-types/${id}` : '/api/item-types';

  try {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || 'Something went wrong');
  }

  alert(result.message || (id ? 'Item type updated!' : 'Item type added!'));

  // Close the modal and reset the form
  //document.getElementById('itemTypeModal').style.display = 'none';

   // Hide modal via Bootstrap API
   const modal = bootstrap.Modal.getInstance(document.getElementById('itemTypeModal'));
   modal.hide();
  this.reset();

  // Reload the table
  fetchAndDisplayItemTypes();

} catch (error) {
  alert(`Error: ${error.message}`);
}


});

// Fetch and display all item types in the table
async function fetchAndDisplayItemTypes() {
  const res = await fetch('/api/item-types');
  const items = await res.json();

  const tbody = document.getElementById('itemTypesTableBody');
  tbody.innerHTML = ''; // Clear existing rows

  items.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-button" data-id="${item.id}" data-name="${item.name}">Edit</button>
        <button class="btn btn-sm btn-danger delete-button" data-id="${item.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  attachEditListeners();
  attachDeleteListeners();
}


// Fill form with selected item data for editing
/*
function editItemType(id, name) {
  document.getElementById('itemTypeName').value = name;
  document.getElementById('itemTypeId').value = id;
  document.getElementById('itemTypeModal').style.display = 'block'; // Show the modal when editing
}
*/
function attachEditListeners() {
  document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', function () {
      const itemId = this.dataset.id;
      const itemName = this.dataset.name;

      document.getElementById('itemTypeName').value = itemName;
      document.getElementById('itemTypeId').value = itemId;

      const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('itemTypeModal'));
      modal.show();
    });
  });
}


/*
// Edit Item Type - Call PUT request to update
async function editItemType(id, name) {
  document.getElementById('itemTypeName').value = name;
  document.getElementById('itemTypeId').value = id;
  document.getElementById('itemTypeModal').style.display = 'block'; // Show the modal when editing

  // Update form submission logic to handle PUT request
  document.getElementById('addItemTypeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const newName = document.getElementById('itemTypeName').value;
    const itemId = document.getElementById('itemTypeId').value;

    const res = await fetch(`/api/item-types/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });

    const result = await res.json();
    alert(result.message || 'Item type updated!');
    document.getElementById('itemTypeModal').style.display = 'none'; // Close the modal
    fetchAndDisplayItemTypes(); // Refresh the table
  });
}
*/
// Delete Item Type - Call DELETE request to remove
function attachDeleteListeners() {
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', async function () {
      const itemId = this.dataset.id;
      if (!confirm('Are you sure you want to delete this item type?')) return;

      const res = await fetch(`/api/item-types/${itemId}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      alert(result.message || 'Item type deleted.');
      fetchAndDisplayItemTypes(); // Refresh list
    });
  });
}


fetchAndDisplayItemTypes();


