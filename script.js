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

  let row = { category, desc, L, W, H, Q, U, R, A };

  addRowToTable(row);
  saveData();
});

// ==========================
// Add Row to Table
// ==========================
function addRowToTable(row) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row.category}</td>
    <td contenteditable="true">${row.desc}</td>
    <td contenteditable="true">${row.L}</td>
    <td contenteditable="true">${row.W}</td>
    <td contenteditable="true">${row.H}</td>
    <td contenteditable="true">${row.Q.toFixed(2)}</td>
    <td contenteditable="true">${row.U}</td>
    <td contenteditable="true">${row.R.toFixed(2)}</td>
    <td>${row.A.toFixed(2)}</td>
    <td>
      <button class="delBtn">❌</button>
    </td>
  `;
  tbody.appendChild(tr);

  // Delete row
  tr.querySelector(".delBtn").addEventListener("click", () => {
    tr.remove();
    updateTotal();
    saveData();
  });

  // Edit row (auto-update)
  tr.querySelectorAll("td[contenteditable=true]").forEach(cell => {
    cell.addEventListener("input", () => {
      recalcRow(tr);
      saveData();
    });
  });

  updateTotal();
}

// ==========================
// Recalculate Row
// ==========================
function recalcRow(tr) {
  let Q = parseFloat(tr.children[5].textContent) || 0;
  let R = parseFloat(tr.children[7].textContent) || 0;
  let A = Q * R;
  tr.children[8].textContent = A.toFixed(2);
  updateTotal();
}

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
    localStorage.removeItem("boqData");
  }
});

// ==========================
// Export Functions
// ==========================
document.getElementById("exportExcel").addEventListener("click", () => {
  let wb = XLSX.utils.table_to_book(document.getElementById("takeoffTable"), { sheet: "BOQ" });
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

// ==========================
// Save & Load with localStorage
// ==========================
function saveData() {
  let rows = [];
  document.querySelectorAll("#takeoffTable tbody tr").forEach(tr => {
    rows.push({
      category: tr.children[0].textContent,
      desc: tr.children[1].textContent,
      L: parseFloat(tr.children[2].textContent) || 0,
      W: parseFloat(tr.children[3].textContent) || 0,
      H: parseFloat(tr.children[4].textContent) || 0,
      Q: parseFloat(tr.children[5].textContent) || 0,
      U: tr.children[6].textContent,
      R: parseFloat(tr.children[7].textContent) || 0,
      A: parseFloat(tr.children[8].textContent) || 0
    });
  });
  localStorage.setItem("boqData", JSON.stringify(rows));
}

function loadData() {
  let data = JSON.parse(localStorage.getItem("boqData") || "[]");
  data.forEach(row => addRowToTable(row));
}

// Load on startup
window.onload = loadData;
// ==========================
// Templates Feature
// ==========================
function saveTemplate(name) {
  let rows = [];
  document.querySelectorAll("#takeoffTable tbody tr").forEach(tr => {
    rows.push({
      category: tr.children[0].textContent,
      desc: tr.children[1].textContent,
      L: parseFloat(tr.children[2].textContent) || 0,
      W: parseFloat(tr.children[3].textContent) || 0,
      H: parseFloat(tr.children[4].textContent) || 0,
      Q: parseFloat(tr.children[5].textContent) || 0,
      U: tr.children[6].textContent,
      R: parseFloat(tr.children[7].textContent) || 0,
      A: parseFloat(tr.children[8].textContent) || 0
    });
  });
  localStorage.setItem("template_" + name, JSON.stringify(rows));
  alert("Template saved: " + name);
}

function loadTemplate(name) {
  let data = JSON.parse(localStorage.getItem("template_" + name) || "[]");
  if (!data.length) {
    alert("No template found with name: " + name);
    return;
  }
  tbody.innerHTML = "";
  data.forEach(row => addRowToTable(row));
  saveData(); // update localStorage as current data
}
