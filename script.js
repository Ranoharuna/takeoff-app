// Take-off App script (separate project)
// Local storage key
const STORAGE_KEY = "takeoffData_v1";

// DOM
const categoryEl = document.getElementById("category");
const descEl = document.getElementById("desc");
const lenEl = document.getElementById("len");
const widEl = document.getElementById("wid");
const htEl = document.getElementById("ht");
const qtyEl = document.getElementById("qty");
const unitEl = document.getElementById("unitSel");
const rateEl = document.getElementById("rate");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const tbody = document.querySelector("#takeoffTable tbody");
const grandTotalEl = document.getElementById("grandTotal");
const exportExcelBtn = document.getElementById("exportExcel");
const exportPDFBtn = document.getElementById("exportPDF");
const printBtn = document.getElementById("printBtn");

// Helpers ------------------------------------------------
function calcQuantityFromDims() {
  const l = parseFloat(lenEl.value) || 0;
  const w = parseFloat(widEl.value) || 0;
  const h = parseFloat(htEl.value) || 0;
  // If all three provided, return volume (m³). If two provided -> area (m²). If one -> linear (m)
  if (l && w && h) return +(l * w * h).toFixed(3);
  if (l && w) return +(l * w).toFixed(3);
  if (l) return +l.toFixed(3);
  return parseFloat(qtyEl.value) || 0;
}

function formatNumber(n) { return Number(n || 0).toFixed(2); }

// Row creation ------------------------------------------
function addRowToTable(rowData) {
  const r = tbody.insertRow();
  r.dataset.id = rowData.id || Date.now().toString();
  r.innerHTML = `
    <td>${rowData.category || ""}</td>
    <td style="text-align:left">${rowData.desc || ""}</td>
    <td>${rowData.len || ""}</td>
    <td>${rowData.wid || ""}</td>
    <td>${rowData.ht || ""}</td>
    <td>${rowData.qty || ""}</td>
    <td>${rowData.unit || ""}</td>
    <td>${formatNumber(rowData.rate)}</td>
    <td>${formatNumber(rowData.amount)}</td>
    <td><button class="del">Delete</button></td>
  `;

  // delete button
  r.querySelector(".del").addEventListener("click", () => {
    r.remove();
    saveAll();
    updateGrandTotal();
  });
}

// Data storage ------------------------------------------
function getAllRowsData() {
  const rows = [];
  tbody.querySelectorAll("tr").forEach(tr => {
    const cells = tr.cells;
    rows.push({
      category: cells[0].innerText,
      desc: cells[1].innerText,
      len: cells[2].innerText,
      wid: cells[3].innerText,
      ht: cells[4].innerText,
      qty: parseFloat(cells[5].innerText) || 0,
      unit: cells[6].innerText,
      rate: parseFloat(cells[7].innerText) || 0,
      amount: parseFloat(cells[8].innerText) || 0,
    });
  });
  return rows;
}

function saveAll() {
  const data = getAllRowsData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const list = JSON.parse(raw);
    tbody.innerHTML = "";
    list.forEach(addRowToTable);
    updateGrandTotal();
  } catch (e) { console.error("load error", e); }
}

// Calculation / UI --------------------------------------
function updateGrandTotal() {
  const data = getAllRowsData();
  const total = data.reduce((s, r) => s + (r.amount || 0), 0);
  grandTotalEl.textContent = formatNumber(total);
}

// Add button click -------------------------------------
addBtn.addEventListener("click", () => {
  const category = categoryEl.value || "";
  const desc = descEl.value.trim();
  const len = lenEl.value || "";
  const wid = widEl.value || "";
  const ht = htEl.value || "";
  const qty = calcQuantityFromDims();
  const unit = unitEl.value || "";
  const rate = parseFloat(rateEl.value) || 0;
  const amount = +(qty * rate);

  if (!desc) { alert("Please enter an item description."); return; }

  const rowData = {
    id: Date.now().toString(),
    category, desc, len, wid, ht,
    qty: qty || 0, unit, rate: rate || 0, amount: amount || 0
  };

  addRowToTable(rowData);
  saveAll();
  updateGrandTotal();

  // clear inputs (keep category & unit)
  descEl.value = ""; lenEl.value = ""; widEl.value = ""; htEl.value = ""; qtyEl.value = ""; rateEl.value = "";
});

// Clear all --------------------------------------------
clearBtn.addEventListener("click", () => {
  if (!confirm("Clear all take-off items?")) return;
  tbody.innerHTML = "";
  saveAll();
  updateGrandTotal();
});

// Export Excel -----------------------------------------
exportExcelBtn.addEventListener("click", () => {
  const table = document.getElementById("takeoffTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Takeoff" });
  XLSX.writeFile(wb, "takeoff.xlsx");
});

// Export PDF (using jsPDF autotable) --------------------
exportPDFBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  doc.text("Take-off Report", 40, 40);
  doc.autoTable({ html: "#takeoffTable", startY: 60, headStyles:{fillColor:[0,64,128]} });
  doc.save("takeoff.pdf");
});

// Print -----------------------------------------------
printBtn.addEventListener("click", () => window.print());

// Load on start ---------------------------------------
loadAll();
// Sample JavaScript for the "Send to BOQ" button
document.getElementById('sendToBOQBtn').addEventListener('click', () => {
  // 1. Collect all measurement data from your take-off app
  // Assuming you have an array of items like this:
  const takeoffItems = []; // You need to fill this from your app's data

  // For example, if you have table rows with description and quantity, collect them like:
  document.querySelectorAll('#your-table-id tbody tr').forEach(row => {
    const description = row.querySelector('.description-cell').textContent.trim();
    const quantity = row.querySelector('.quantity-cell').textContent.trim();
    if(description && quantity) {
      takeoffItems.push({ description, quantity });
    }
  });

  // 2. Save to localStorage as JSON string
  localStorage.setItem('takeoffData', JSON.stringify(takeoffItems));

  // 3. Redirect to BOQ estimator app
  window.location.href = 'https://ranoharuna.github.io/boq-estimator/';
});document.getElementById("category").addEventListener("change", function() {
    const cat = this.value;
    const descSelect = document.getElementById("desc");
    const customDesc = document.getElementById("customDesc");

    // Reset description list
    descSelect.innerHTML = "<option value=''>-- Select Description --</option>";

    if (categoryDescriptions[cat]) {
        categoryDescriptions[cat].forEach(item => {
            let opt = document.createElement("option");
            opt.value = item;
            opt.textContent = item;
            descSelect.appendChild(opt);
        });

        // Add "Other" option
        let otherOpt = document.createElement("option");
        otherOpt.value = "Other";
        otherOpt.textContent = "Other (type manually)";
        descSelect.appendChild(otherOpt);
    }

    descSelect.addEventListener("change", function() {
        if (this.value === "Other") {
            customDesc.style.display = "inline-block";
        } else {
            customDesc.style.display = "none";
        }
    });
});

