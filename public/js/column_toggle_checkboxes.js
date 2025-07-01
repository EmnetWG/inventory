
// Column visibility state
let columnVisibility = Array(21).fill(true);

document.addEventListener("DOMContentLoaded", () => {
  const columnNames = [
    "#", "Location", "Floor", "Item Type", "Category", "Manufacturer", "Model", "RAM",
    "CPU", "HD Size", "OS", "Serial Number", "Status", "Toner", "Size",
    "Copy Speed", "Port Count", "Is Managed", "Resolution", "Storage Type", "Firmware"
  ];

  const container = document.getElementById("columnToggleContainer");
  if (!container) return;

  columnNames.forEach((name, index) => {
    const label = document.createElement("label");
    label.style.marginRight = "12px";
    label.innerHTML = `
      <input type="checkbox" class="column-toggle form-check-input" data-col="${index}" checked> ${name}
    `;
    container.appendChild(label);
  });

  container.addEventListener("change", (e) => {
    if (!e.target.classList.contains("column-toggle")) return;
    const colIndex = parseInt(e.target.dataset.col, 10);
    columnVisibility[colIndex] = e.target.checked;
    applyColumnVisibility();
  });
});

function applyColumnVisibility() {
  const allRows = document.querySelectorAll("#itemsTable tr");
  allRows.forEach(row => {
    const cells = row.children;
    columnVisibility.forEach((visible, index) => {
      if (cells[index]) {
        cells[index].style.display = visible ? "" : "none";
      }
    });
  });

  // Sync checkbox states
  document.querySelectorAll(".column-toggle").forEach(input => {
    const index = parseInt(input.dataset.col, 10);
    input.checked = columnVisibility[index];
  });
}
