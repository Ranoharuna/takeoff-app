// ==========================
// Category → Description Mapping
// ==========================
const categoryDescriptions = {
  "Preliminaries": ["Site Mobilization", "Site Clearance", "Other"],
  "Substructure": ["Excavation", "Foundation Concrete", "Other"],
  "Superstructure": ["Block/Brick Walling", "Reinforced Concrete Column", "Other"],
  "Roofing": ["Roof Truss", "Roof Covering", "Other"],
  "Finishes": ["Plastering", "Tiling", "Other"],
  "Doors & Windows": ["Doors", "Windows", "Other"],
  "Services": ["Plumbing", "Electrical", "Other"],
  "External Works": ["Driveways & Paving", "Landscaping", "Other"]
};

// Elements
const tbody = document.querySelector("#takeoffTable tbody");
const grandTotalEl = document.getElementById("grandTotal");

// ==========================
// Category → Description Handling
// ==========================
document.getElementById("category").addEventListener("change", function () {
  const cat = this.value;
  const descSel = document.getElementById("desc");
  const descManual = document.getElementById("descManual");

  descSel.innerHTML = `<option value="">-- Select Description --</option>`;
  descManual.style.display = "none";
  descManual.value = "";

  if (categoryDescriptions[cat]) {
    categoryDescriptions[cat].forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      descSel.appendChild(opt);
    });
  }
});

document.getElementById("desc").addEventListener("change", function () {
  if (this.value === "Other") {
    document.getElementById("descManual").style.display = "inline-block";
  } else {
    document.getElementById("descManual").style.display = "none";
  }
});

// ==========================
// Add Row
// ==========================
document.getElementById("addBtn").addEventListener("click", () => {
  const cat = document.getElementById("category").value;
  let desc = document.getElementById("desc").value;
  if (desc === "Other") {
    desc = document.getElementById("descManual").value;
  }
  const L = parseFloat(document.getElementById("len").value) || 0;
  const W = parseFloat(document.getElementById("wid").value) || 0;
  const H = parseFloat(document.getElementById("ht").value) || 0;
  let Q = parseFloat(document.getElementById("qty").value) || 0;
  const U = document.getElementById("unitSel").value;
  const R = parseFloat(document.getElementById("rate").value) || 0;

  if (!cat || !desc) {
    alert("Please select category and description!");
    return;
  }

  if (Q === 0 && (L || W || H)) {
    Q = L * (W || 1) * (H || 1);
  }

  const A = Q * R;

  const row = { category: cat, desc, L, W, H, Q, U, R, A };
  addRowToTable(row);
  saveData();
});

// Function to Add Row into Table
function addRowToTable(row) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row.category}</td>
    <td>${row.desc}</td>
    <td>${row.L}</td>
    <td>${row.W}</td>
    <td>${row.H}</td>
    <td>${row.Q}</td>
    <td>${row.U}</td>
    <td>${row.R}</td>
    <td>${row.A.toFixed(2)}</td>
    <td><button class="delBtn">❌</button></td>
  `;
  tbody.appendChild(tr);
  updateGrandTotal();

  tr.querySelector(".delBtn").addEventListener("click", () => {
    tr.remove();
    updateGrandTotal();
    saveData();
  });
}

// ==========================
// Totals
// ==========================
function updateGrandTotal() {
  let total = 0;
  document.querySelectorAll("#takeoffTable tbody tr").forEach(tr => {
    total += parseFloat(tr.children[8].textContent) || 0;
  });
  grandTotalEl.textContent = total.toFixed(2);
}

// ==========================
// Clear All
// ==========================
document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Clear all rows?")) {
    tbody.innerHTML = "";
    updateGrandTotal();
    saveData();
  }
});

// ==========================
// Save/Load Data (LocalStorage)
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
  localStorage.setItem("takeoffData", JSON.stringify(rows));
}

function loadData() {
  let data = JSON.parse(localStorage.getItem("takeoffData") || "[]");
  tbody.innerHTML = "";
  data.forEach(row => addRowToTable(row));
}
window.onload = loadData;

// ==========================
// Export Functions
// ==========================
document.getElementById("exportExcel").addEventListener("click", () => {
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.table_to_sheet(document.getElementById("takeoffTable"));
  XLSX.utils.book_append_sheet(wb, ws, "Takeoff");
  XLSX.writeFile(wb, "takeoff.xlsx");
});

document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Take-off & BOQ Helper", 14, 16);
  doc.autoTable({ html: "#takeoffTable", startY: 20 });
  doc.save("takeoff.pdf");
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});

// ==========================
// Templates Feature
// ==========================
function saveTemplate(name) {
  if (!name) {
    alert("Enter template name!");
    return;
  }
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
  if (!name) {
    alert("Enter template name!");
    return;
  }
  let data = JSON.parse(localStorage.getItem("template_" + name) || "[]");
  if (!data.length) {
    alert("No template found with name: " + name);
    return;
  }
  tbody.innerHTML = "";
  data.forEach(row => addRowToTable(row));
  saveData();
}

// ==========================
// Send to BOQ (Simple Example)
// ==========================
document.getElementById("sendToBOQBtn").addEventListener("click", () => {
  let data = JSON.parse(localStorage.getItem("takeoffData") || "[]");
  if (!data.length) {
    alert("No data to send!");
    return;
  }
  localStorage.setItem("boqImport", JSON.stringify(data));
  alert("Data sent to BOQ App! (Switch to BOQ app to import)");
});
