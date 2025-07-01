document.getElementById("inventoryForm").addEventListener("submit", async function (e) {
  e.preventDefault();

/*
  const cpuSpeed = parseFloat(this.cpuSpeed.value);
const hdSize = parseInt(this.hdSize.value);

console.log(cpuSpeed);  
if (cpuSpeed < 0 || hdSize < 0) {
  alert("CPU Speed and HD Size must be positive numbers.");
  return;
}
*/
  const formData = new FormData(this);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value === '' ? null : value;
  });
  /*
  formData.forEach((value, key) => {
    value === '' ? null : value
    data[key] = value;
  });
  */



  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message || 'Submitted!');
    this.reset();
  } catch (err) {
    console.error(err);
    alert('Submission failed.');
  }

  console.log("Form Submitted:", data);

  // You can also send data via fetch() to a backend if needed
  alert("Form submitted successfully!");
  this.reset(); // Clear form after submission

  // ✅ Refresh the current page after adding the new item
  //await fetchItems(currentPage);
  await applyFiltersAndSearch(currentPage);
});


let currentPage = 1;
const limit = 15;

function getFilterValues() {
  return {
    floor: document.getElementById("filterFloor").value.trim(),
    location: document.getElementById("filterLocation").value.trim(),
    itemType: document.getElementById("filterItemType").value.trim(),
    search: document.getElementById("searchInput").value.trim()
  };
}


async function fetchItems(page = 1) {
  
const offset = (page - 1) * limit;
currentPage = page;

try {
  const res = await fetch(`/api/items?limit=${limit}&offset=${offset}`);
// console.log('✅ Fetched response:', res);
  const data = await res.json();
 // console.log(data)
 if (!Array.isArray(data.items)) {
      console.error('API returned invalid items:', data.items);
      return;
 }
  renderTable(data.items);
  renderPagination(data.total);
  applyFiltersAndSearch(1);
 // applyFilters();
 // saveToLocal(data.items); // optional
} catch (err) {
  console.error('Failed to fetch paginated items:', err);
}
}

async function applyFiltersAndSearch(page = 1) {
  const filters = getFilterValues();
  const offset = (page - 1) * limit;
  currentPage = page;

  const paginatedParams = new URLSearchParams({
    ...filters,
    limit,
    offset
  });

  const fullParams = new URLSearchParams({
    ...filters,
    full: 'true'
  });

  try {
    const pageRes = await fetch(`/api/items?${paginatedParams}`);
    const pageData = await pageRes.json();

    renderTable(pageData.items);
    renderPagination(pageData.total, filters);

    const fullRes = await fetch(`/api/items?${fullParams}`);
    const fullData = await fullRes.json();

    const typeCounts = {};

    fullData.items.forEach(item => {
      const type = item.listItemType?.itemName || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const breakdownDiv = document.getElementById("itemTypeBreakdown");
    breakdownDiv.innerHTML = '';

    if (Object.keys(typeCounts).length === 0) {
      breakdownDiv.innerHTML = `<div class="col-12"><div class="alert alert-warning">No items to display.</div></div>`;
    } else {
      Object.entries(typeCounts).forEach(([type, count]) => {
        const card = document.createElement('div');
        card.className = 'col-md-3 mb-3';

        card.innerHTML = `
          <div class="card card-custom h-100 shadow-sm">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 class="card-title">${type}</h5>
              <p class="card-text display-6">${count}</p>
            </div>
          </div>
        `;

        breakdownDiv.appendChild(card);
      });
    }

  } catch (error) {
    console.error("Error applying filters and search:", error);
  }
}

function renderTable(items) {
  const tableBody = document.querySelector('#itemsTable tbody');
  tableBody.innerHTML = '';

  items.forEach((item, index) => {

    const rowNumber = (currentPage - 1) * limit + index + 1;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rowNumber}</td>
      <td>${item.location}</td>
      <td>${item.floor}</td>
      <td data-item-type-id="${item.listItemType?.itemid || ''}">${item.listItemType?.itemName || ''}</td>
      <td>${item.category || ''}</td>
      <td>${item.manufacturer || ''}</td>
      <td>${item.model || ''}</td>
      <td>${item.ram || ''}</td>
      <td>${item.cpuSpeed ? item.cpuSpeed + ' GHz' : ''}</td>
      <td>${item.hdSize ? item.hdSize + ' GB' : ''}</td>
      <td>${item.operatingSystem || ''}</td>
      <td>${item.serialNumber}</td>
      <td>${item.status || ''}</td>
      <td>${item.toner || ''}</td>
      <td>${item.size || ''}</td>
      <td>${item.copySpeed || ''}</td>
      <td>${item.portCount || ''}</td>
      <td>${item.isManaged || ''}</td>
      <td>${item.resolution || ''}</td>
      <td>${item.storageType || ''}</td>
      <td>${item.firmwareVersion || ''}</td>

       <td>
      <button onclick='openEditModal(${JSON.stringify(item)})'>✏️</button>
      
      <button onclick="deleteItem('${item.id}')">🗑️</button>
    </td>
    `;
    tableBody.appendChild(row);
    applyColumnVisibility()
  });
}


function renderPagination(totalItems, filters = {}) {
  const totalPages = Math.ceil(totalItems / limit);
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  const createButton = (text, pageNum = null, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (disabled) btn.disabled = true;
    if (pageNum !== null) {
      btn.onclick = () => applyFiltersAndSearch(pageNum);
      if (pageNum === currentPage) btn.classList.add('active');
    }
    container.appendChild(btn);
  };

  const maxVisible = 5; // number of surrounding page numbers

  // First page
  if (currentPage > 1) {
    createButton("«", currentPage - 1); // prev
  }

  if (currentPage > maxVisible) {
    createButton("1", 1);
    createButton("...", null, true);
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let page = startPage; page <= endPage; page++) {
    createButton(page, page);
  }

  if (currentPage < totalPages - 2) {
    createButton("...", null, true);
    createButton(totalPages, totalPages);
  }

  if (currentPage < totalPages) {
    createButton("»", currentPage + 1); // next
  }
}

/*
function renderPagination(totalItems, filters = {}) {
  const totalPages = Math.ceil(totalItems / limit);
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  for (let page = 1; page <= totalPages; page++) {
    const btn = document.createElement('button');
    btn.textContent = page;
    btn.className = (page === currentPage) ? 'active' : '';
    btn.onclick = () => applyFiltersAndSearch(page);
    container.appendChild(btn);
  }
}
*/

// Load on page ready

document.addEventListener("DOMContentLoaded", () => {
  applyFiltersAndSearch(1);
  document.getElementById("filterFloor").addEventListener("input", () => applyFiltersAndSearch(1));
  document.getElementById("filterLocation").addEventListener("input", () => applyFiltersAndSearch(1));
  document.getElementById("filterItemType").addEventListener("change", () => applyFiltersAndSearch(1));
  document.getElementById("searchInput").addEventListener("input", () => applyFiltersAndSearch(1));
});

/*
document.addEventListener('DOMContentLoaded', async () => {
 // const openBtn = document.getElementById('openFormModalBtn');
 // const modal = document.getElementById('formModal');
 // const closeBtn = document.getElementById('closeFormModal');
  const filterSelect = document.getElementById('filterItemType');
  await loadItemTypesIntoSelect(filterSelect);
  
  
  });

*/


//delete
async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message || 'Item deleted');
    //fetchItems(); // Refresh table
    applyFiltersAndSearch(currentPage);
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Error deleting item');
  }
}

//export
/*
function exportTableToCSV() {
  const rows = document.querySelectorAll("#itemsTable tr");
  let csv = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    const rowData = Array.from(cols).map(col => `"${col.innerText}"`);
    csv.push(rowData.join(","));
  });

  const csvBlob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(csvBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventory_export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

*/
/*
function exportTableToExcel() {
  const table = document.getElementById("itemsTable");
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Inventory" });
  XLSX.writeFile(workbook, "inventory_export.xlsx");
}

*/

async function exportTableToExcel() {
  const filters = getFilterValues();

  const fullParams = new URLSearchParams({
    ...filters,
    full: 'true'
  });

  try {
    const res = await fetch(`/api/items?${fullParams}`);
    const data = await res.json();

    if (!Array.isArray(data.items)) {
      alert('Error: Invalid data received for export');
      return;
    }

    // Create a virtual table
    const tempTable = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Location</th><th>Floor</th><th>Item Type</th><th>Category</th>
        <th>Manufacturer</th><th>Model</th><th>RAM</th><th>CPU Speed</th>
        <th>HD Size</th><th>OS</th><th>Serial Number</th><th>Status</th>
        <th>Toner</th><th>Size</th><th>Copy Speed</th><th>Port Count</th>
        <th>Is Managed</th><th>Resolution</th><th>Storage Type</th><th>Firmware</th>
        <th>Remark</th>
      </tr>
    `;
    tempTable.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.location}</td>
        <td>${item.floor}</td>
        <td>${item.listItemType?.itemName || ''}</td>
        <td>${item.category || ''}</td>
        <td>${item.manufacturer || ''}</td>
        <td>${item.model || ''}</td>
        <td>${item.ram || ''}</td>
        <td>${item.cpuSpeed ? item.cpuSpeed + ' GHz' : ''}</td>
        <td>${item.hdSize ? item.hdSize + ' GB' : ''}</td>
        <td>${item.operatingSystem || ''}</td>
        <td>${item.serialNumber}</td>
        <td>${item.status || ''}</td>
        <td>${item.toner || ''}</td>
        <td>${item.size || ''}</td>
        <td>${item.copySpeed || ''}</td>
        <td>${item.portCount || ''}</td>
        <td>${item.isManaged || ''}</td>
        <td>${item.resolution || ''}</td>
        <td>${item.storageType || ''}</td>
        <td>${item.firmwareVersion || ''}</td>
        <td>${item.additionalInfo || ''}</td>
      `;
      tbody.appendChild(row);
    });

    tempTable.appendChild(tbody);

    // Export the virtual table
    const workbook = XLSX.utils.table_to_book(tempTable, { sheet: "Inventory" });
    XLSX.writeFile(workbook, "inventory_export.xlsx");

  } catch (error) {
    console.error("Export failed:", error);
    alert("Failed to export data. Please try again.");
  }
}


//edit

async function openEditModal(item) {
  //const modal = document.getElementById("editModal");
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editModal'));
     
  const form = document.getElementById("editForm");

  const editSelect = document.getElementById('editItemTypeSelect');
  await loadItemTypesIntoSelect(editSelect);
  
  // await loadItemTypesIntoSelect();

  form.id.value = item.id;
  form.location.value = item.location || '';
  form.floor.value = item.floor || '';
  editSelect.value =  item.listItemType?.itemid || ""; form.category.value=  item.category || '';
 //form.itemType.value = item.listItemType.itemName || '';
  form.manufacturer.value = item.manufacturer || '';
  form.model.value = item.model || '';
  form.ram.value = item.ram || '';
  form.cpuSpeed.value = item.cpuSpeed || '';
  form.hdSize.value = item.hdSize || '';
  form.operatingSystem.value = item.operatingSystem || '';
 // form.manufacturer.value = item.manufacturer || '';
  form.serialNumber.value = item.serialNumber || '';
  form.status.value = item.status || '';
  form.toner.value = item.toner || '';
  form.size.value = item.size || '' ;
  form.firmwareVersion.value = item.firmwareVersion || '';
  form.portCount.value = item.portCount || '';
  form.isManaged.value = item.isManaged || '';
  form.resolution.value = item.resolution || '';
  form.storageType.value = item.storageType || '';
  form.copySpeed.value = item.copySpeed || '';
  form.additionalInfo.value = item.additionalInfo || '';
 // modal.style.display = "block";
 modal.show();
}
/*
document.getElementById("closeModal").onclick = () => {
  document.getElementById("editModal").style.display = "none";
};
*/
document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  /*
  const data = {
    manufacturer: this.manufacturer.value,
    model: this.model.value,
    ram: this.ram.value,
    location:this.location.value,
    floor:this.floor.value,
    
    itemType:this.itemType.value,
    cpuSpeed:this.cpuSpeed.value,
    hdSize:this.hdSize.value,
    operatingSystem:this.operatingSystem.value,
    serialNumber:this.serialNumber.value

  };
*/

const fields = [
  'manufacturer', 'model', 'ram', 'location', 'floor',
   'cpuSpeed', 'hdSize', 'operatingSystem', 'serialNumber',
  'category', 'status', 'toner', 'size', 'firmwareVersion', 'portCount', 
  'isManaged', 'resolution', 'storageType', 'copySpeed', 'additionalInfo'
];

const data = {};
fields.forEach(field => {
  const value = this[field].value;
  data[field] = value === '' ? null : value;
});

const itemTypeSelect = document.getElementById('editItemTypeSelect');
  data.itemType = itemTypeSelect.value || null;  

  try {
    const id = this.id.value;
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message || 'Updated!');
    //document.getElementById("editModal").style.display = "none";
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
   
    modal.hide();
   // fetchItems();
   applyFiltersAndSearch(currentPage);
  } catch (err) {
    console.error(err);
    alert('Update failed.');
  }
});


//document.addEventListener('DOMContentLoaded', () => applyFiltersAndSearch(1));

document.addEventListener('DOMContentLoaded', async () => {
  const openBtn = document.getElementById('openFormModalBtn');
  const modal = document.getElementById('formModal');
  const closeBtn = document.getElementById('closeFormModal');
  const filterSelect = document.getElementById('filterItemType');
  await loadItemTypesIntoSelect(filterSelect);
  /*
  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    
  });

  openBtn.addEventListener('click', async () => {
    const addSelect = document.getElementById('itemTypeSelect');
    await loadItemTypesIntoSelect(addSelect); // wait for options to load
  
    modal.style.display = 'block'; // show modal *after* loading is done
  });
  

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  */

  openBtn.addEventListener('click', async () => {
    const addSelect = document.getElementById('itemTypeSelect');
    await loadItemTypesIntoSelect(addSelect);

    // Bootstrap 5 Modal without jQuery
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  });

  closeBtn.addEventListener('click', () => {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    }
  });
});



  async function loadItemTypesIntoSelect(selectElement) {
    try {
      const res = await fetch('/api/item-types');
      const itemTypes = await res.json();
  
      selectElement.innerHTML = '<option value="">Select type</option>';
  
      itemTypes.forEach(type => {
        const option = document.createElement('option');
       // option.value = type.name;  or type.id if using IDs
       option.value = type.id
        option.textContent = type.name;
        selectElement.appendChild(option);
      });
    } catch (error) {
      console.error('Failed to load item types:', error);
      alert('Could not load item types. Please try again.');
    }
  }
  
 //////
 