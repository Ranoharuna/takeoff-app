// =========================
// Take-off & BOQ Helper Script
// =========================

// Category → Description mapping
const descriptions = {
  "Preliminaries": [
    "Site mobilization",
    "Site clearance",
    "Temporary facilities",
    "Health & safety provisions",
    "Other (type manually)"
  ],
  "Substructure": [
    "Bulk excavation up to 2m depth",
    "Excavation in trenches",
    "Filling and compaction with selected material",
    "Anti-termite treatment",
    "Blinding concrete 50mm thick",
    "Reinforced concrete strip footing",
    "Reinforced concrete pad footing",
    "Foundation blockwork",
    "Damp proof membrane (500 gauge polythene)",
    "Other (type manually)"
  ],
  "Superstructure": [
    "Block/brick walling",
    "Reinforced concrete column",
    "Reinforced concrete slab",
    "Lintels",
    "Other (type manually)"
  ],
  "Roofing": [
    "Roof truss",
    "Roof covering (zinc/aluminium)",
    "Insulation & ceiling",
    "Rainwater guttering & downpipes",
    "Other (type manually)"
  ],
  "Finishes": [
    "Plastering",
    "Screeding",
    "Painting",
    "Tiling",
    "Other (type manually)"
  ],
  "Doors & Windows": [
    "Wooden doors",
    "Steel security doors",
    "Aluminium windows",
    "Glazing",
    "Other (type manually)"
  ],
  "Services": [
    "Plumbing installation",
    "Electrical installation",
    "Mechanical ventilation",
    "Other (type manually)"
  ],
  "External Works": [
    "Driveways & paving",
    "Landscaping",
    "Perimeter fencing",
    "Drainage works",
    "Other (type manually)"
  ]
};

// Populate description dropdown when category changes
document.getElementById("category").addEventListener("change", function () {
  const cat = this.value;
  const descSelect = document.getElementById("desc");
  const manualField = document.getElementById("descManual");

  // Reset
  descSelect.innerHTML = '<option value="">-- Select Description --</option>';
  manualField.style.display = "none";

  if (descriptions[cat]) {
    descriptions[cat].forEach(d => {
      const opt = document.createElement("option");
      opt.value = d === "Other (type manually)" ? "manual" : d;
      opt.textContent = d;
      descSelect.appendChild(opt);
    });
  }
});

// Show manual input if "Other" is selected
document.getElementById("desc").addEventListener("change", function () {
  const manualField = document.getElementById("descManual");
  manualField.style.display = this.value === "manual" ? "inline-block" : "none";
});

// Helper to get final description
function getDescription() {
  const descSelect = document.getElementById("desc");
  const manualField = document.getElementById("descManual");
  return descSelect.value === "manual" ? manualField.value : descSelect.value;
}

// =========================
// Table Logic
// =========================

const tableBody = document.querySelector("#takeoffTable tbody");
const grandTotalEl = document.getElementById("grandTotal");

document.getElementById("addBtn").addEventListener("click", function () {
  const category = document.getElementById("category").value;
  const desc = getDescription();
  const len = parseFloat(document.getElementById("len").value) || 0;
  const wid = parseFloat(document.getElementById("wid").value) || 0;
  const ht = parseFloat(document.getElementById("ht").value) || 0;
  let qty = parseFloat(document.getElementById("qty").value) || 0;
  const unit = document.getElementById("unitSel").value;
  const rate = parseFloat(document.getElementById("rate").value) || 0;

  // Auto-calc qty if empty
  if (!qty) {
    if (unit === "m") qty = len;
    else if (unit === "m²") qty = len * wid;
    else if (unit === "m³") qty = len * wid * ht;
    else qty = 1;
  }

  const amount = qty * rate;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${category}</td>
    <td>${desc}</td>
    <td>${len}</td>
    <td>${wid}</td>
    <td>${ht}</td>
    <td>${qty.toFixed(2)}</td>
    <td>${unit}</td>
    <td>${rate.toFixed(2)}</td>
    <td>${amount.toFixed(2)}</td>
    <td><button class="deleteBtn">❌</button></td>
  `;
  tableBody.appendChild(row);

  updateGrandTotal();
});

// Delete row
tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("deleteBtn")) {
    e.target.closest("tr").remove();
    updateGrandTotal();
  }
});

// Clear all
document.getElementById("clearBtn").addEventListener("click", function () {
  tableBody.innerHTML = "";
  updateGrandTotal();
});

// Update total
function updateGrandTotal() {
  let total = 0;
  tableBody.querySelectorAll("tr").forEach(row => {
    total += parseFloat(row.cells[8].textContent) || 0;
  });
  grandTotalEl.textContent = total.toFixed(2);
}

// =========================
// Export Functions
// =========================

// Export to Excel
document.getElementById("exportExcel").addEventListener("click", function () {
  const wb = XLSX.utils.table_to_book(document.getElementById("takeoffTable"));
  XLSX.writeFile(wb, "takeoff.xlsx");
});

// Export to PDF
document.getElementById("exportPDF").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Take-off & BOQ Helper", 14, 15);
  doc.autoTable({ html: "#takeoffTable", startY: 20 });
  doc.save("takeoff.pdf");
});

// Print
document.getElementById("printBtn").addEventListener("click", function () {
  window.print();
});
