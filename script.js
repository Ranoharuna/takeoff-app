// ==========================
// Category → Description Map
// ==========================
const descriptions = {
  "Preliminaries": [
    "Site mobilization",
    "Site clearance",
    "Temporary fencing",
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
    "Block/Brick walling",
    "Reinforced concrete column",
    "Reinforced concrete beam",
    "Suspended slab",
    "Other (type manually)"
  ],
  "Roofing": [
    "Roof truss",
    "Roof covering (zinc/tiles)",
    "Ceiling finish",
    "Other (type manually)"
  ],
  "Finishes": [
    "Internal plastering",
    "External rendering",
    "Floor tiling",
    "Wall tiling",
    "Painting",
    "Other (type manually)"
  ],
  "Doors & Windows": [
    "Panel doors",
    "Flush doors",
    "Aluminium windows",
    "Burglar proofing",
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
    "Drainage",
    "Landscaping",
    "Perimeter fencing",
    "Gate & gatehouse",
    "Other (type manually)"
  ]
};

// Elements
const categorySel = document.getElementById("category");
const descSel = document.getElementById("desc");
const descManual = document.getElementById("descManual");
const len = document.getElementById("len");
const wid = document.getElementById("wid");
const ht = document.getElementById("ht");
const qty = document.getElementById("qty");
const unitSel = document.getElementById("unitSel");
const rate = document.getElementById("rate");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const tbody = document.querySelector("#takeoffTable tbody");
const grandTotalEl = document.getElementById("grandTotal");

// ==========================
// Populate Descriptions
// ==========================
categorySel.addEventListener("change", () => {
  descSel.innerHTML = `<option value="">-- Select Description --</option>`;
  if (descriptions[categorySel.value]) {
    descriptions[categorySel.value].forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      descSel.appendChild(opt);
    });
  }
});

descSel.addEventListener("change", () => {
  if (descSel.value.includes("Other")) {
    descManual.style.display = "inline-block";
  } else {
    descManual.style.display = "none";
  }
});

// ==========================
// Quantity Auto Calculation
// ==========================
function calcQty() {
  let l = parseFloat(len.value) || 0;
  let w = parseFloat(wid.value) || 0;
  let h = parseFloat(ht.value) || 0;
  let u = unitSel.value;

  if (u === "m") qty.value = l;
  if (u === "m²") qty.value = l * w;
  if (u === "m³") qty.value = l * w * h;
  if (u === "pcs") qty.value = l; // simple pieces
}

[len, wid, ht, unitSel].forEach(el => el.addEventListener("input", calcQty));

// ==========================
// Add Row
// ==========================
addBtn.addEventListener("click", () => {
  let category = categorySel.value;
  let desc = descSel.value.includes("Other") ? descManual.value : descSel.value;
  let L = parseFloat(len.value) || 0;
  let W = parseFloat(wid.value) || 0;
  let H = parseFloat(ht.value) || 0;
  let Q = parseFloat(qty.value) || 0;
  let U = unitSel.value;
  let R = parseFloat(rate.value) || 0;
  let A = Q * R;

  if (!category || !desc) {
    alert("Please select category and description");
    return;
  }

  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${category}</td>
    <td>${desc}</td>
    <td>${L}</td>
    <td>${W}</td>
    <td>${H}</td>
    <td>${Q.toFixed(2)}</td>
    <td>${U}</td>
    <td>${R.toFixed(2)}</td>
    <td>${A.toFixed(2)}</td>
    <td><button class="delBtn">❌</button></td>
  `;
  tbody.appendChild(tr);

  updateTotal();

  // Delete row
  tr.querySelector(".delBtn").addEventListener("click", () => {
    tr.remove();
    updateTotal();
  });
});

// ==========================
// Update Total
// ==========================
function updateTotal() {
  let sum = 0;
  document.querySelectorAll("#takeoffTable tbody tr").forEach(tr => {
    sum += parseFloat(tr.children[8].textContent) || 0;
  });
  grandTotalEl.textContent = sum.toFixed(2);
}

// ==========================
// Clear All
// ==========================
clearBtn.addEventListener("click", () => {
  if (confirm("Clear all items?")) {
    tbody.innerHTML = "";
    updateTotal();
  }
});

// ==========================
// Export Functions
// ==========================
document.getElementById("exportExcel").addEventListener("click", () => {
  let wb = XLSX.utils.table_to_book(document.getElementById("takeoffTable"), {sheet: "BOQ"});
  XLSX.writeFile(wb, "takeoff-boq.xlsx");
});

document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Take-off & BOQ Helper", 14, 16);
  doc.autoTable({ html: "#takeoffTable", startY: 20 });
  doc.save("takeoff-boq.pdf");
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
