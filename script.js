// Description options by category
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

// Populate descriptions when category changes
categorySel.addEventListener("change", () => {
  descSel.innerHTML = `<option value="">-- Select Description --</option>`; // reset

  if (descriptions[categorySel.value]) {
    descriptions[categorySel.value].forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      descSel.appendChild(opt);
    });
  }
});

// Show manual input if "Other" is selected
descSel.addEventListener("change", () => {
  if (descSel.value.includes("Other")) {
    descManual.style.display = "inline-block";
  } else {
    descManual.style.display = "none";
  }
});
