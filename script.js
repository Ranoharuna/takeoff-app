// ✅ Category → Description mapping
const categoryDescriptions = {
  "Preliminaries": [
    "Mobilization and Demobilization",
    "Site Clearance",
    "Temporary Works (Hoarding, Signage, Access Roads)",
    "Project Supervision and Insurance",
    "Health and Safety Provisions"
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
    "Damp proof membrane (500 gauge polythene)"
  ],
  "Superstructure": [
    "Reinforced concrete columns",
    "Reinforced concrete beams",
    "Suspended slab (150mm thick)",
    "Blockwork walls (150mm thick)",
    "Blockwork walls (225mm thick)",
    "Lintels",
    "Staircase construction"
  ],
  "Roofing": [
    "Roof trusses (timber/steel)",
    "Purlins",
    "Roof covering (zinc/aluminium sheets)",
    "Fascia board",
    "Ridges and Eaves",
    "Roof insulation",
    "Rainwater gutters and downpipes"
  ],
  "Finishes": [
    "Internal plastering",
    "External rendering",
    "Wall screeding",
    "Painting (internal)",
    "Painting (external)",
    "Floor tiling",
    "Wall tiling",
    "Ceiling works (POP, PVC, Gypsum)"
  ],
  "Doors & Windows": [
    "Wooden doors",
    "Steel security doors",
    "Aluminium windows",
    "Wardrobes and cabinets",
    "Sanitary fittings (WC, WHB, Shower, etc.)"
  ],
  "Services": [
    "Cold water supply pipework",
    "Hot water supply pipework",
    "Drainage and waste system",
    "Electrical conduiting and wiring",
    "Switches and sockets",
    "Distribution boards",
    "Lighting fixtures"
  ],
  "External Works": [
    "Paving and walkways",
    "Driveways and parking bays",
    "Boundary wall construction",
    "Steel entrance gate",
    "Landscaping and turfing",
    "Storm water drainage"
  ]
};

// ✅ Auto-fill Description dropdown
document.getElementById("category").addEventListener("change", function() {
  const cat = this.options[this.selectedIndex].parentNode.label; // Use optgroup label as category
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

// ✅ Add Row function
document.getElementById("addBtn").addEventListener("click", () => {
  const cat = document.getElementById("category").value;
  const descSelect = document.getElementById("desc");
  const customDesc = document.getElementById("customDesc");
  let desc = descSelect.value === "Other" ? customDesc.value : descSelect.value;

  const len = parseFloat(document.getElementById("len").value) || 0;
  const wid = parseFloat(document.getElementById("wid").value) || 0;
  const ht  = parseFloat(document.getElementById("ht").value) || 0;
  let qty   = parseFloat(document.getElementById("qty").value) || 0;
  const unit = document.getElementById("unitSel").value;
  const rate = parseFloat(document.getElementById("rate").value) || 0;

  // Auto calc qty
  if (!qty) {
    if (unit === "m³") qty = len * wid * ht;
    else if (unit === "m²") qty = len * wid;
    else if (unit === "m") qty = len;
    else qty = 1;
  }

  const amt = qty * rate;

  const tbody = document.querySelector("#takeoffTable tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${cat}</td>
    <td>${desc}</td>
    <td>${len}</td>
    <td>${wid}</td>
    <td>${ht}</td>
    <td>${qty.toFixed(2)}</td>
    <td>${unit}</td>
    <td>${rate.toFixed(2)}</td>
    <td>${amt.toFixed(2)}</td>
    <td><button class="delBtn">🗑</button></td>
  `;

  tbody.appendChild(tr);

  updateTotal();

  // Clear inputs
  document.getElementById("desc").value = "";
  document.getElementById("customDesc").value = "";
  document.getElementById("customDesc").style.display = "none";
  document.getElementById("len").value = "";
  document.getElementById("wid").value = "";
  document.getElementById("ht").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("rate").value = "";
});

// ✅ Delete row
document.querySelector("#takeoffTable").addEventListener("click", e => {
  if (e.target.classList.contains("delBtn")) {
    e.target.closest("tr").remove();
    updateTotal();
  }
});

// ✅ Clear all
document.getElementById("clearBtn").addEventListener("click", () => {
  document.querySelector("#takeoffTable tbody").innerHTML = "";
  updateTotal();
});

// ✅ Update total
function updateTotal() {
  let total = 0;
  document.querySelectorAll("#takeoffTable tbody tr").forEach(tr => {
    total += parseFloat(tr.cells[8].textContent) || 0;
  });
  document.getElementById("grandTotal").textContent = total.toFixed(2);
}

// ✅ Export Excel
document.getElementById("exportExcel").addEventListener("click", () => {
  const wb = XLSX.utils.table_to_book(document.getElementById("takeoffTable"), { sheet: "Takeoff" });
  XLSX.writeFile(wb, "takeoff.xlsx");
});

// ✅ Export PDF
document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.autoTable({ html: "#takeoffTable" });
  doc.save("takeoff.pdf");
});

// ✅ Print
document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
