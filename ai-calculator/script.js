let progValue = 0n;
let currentProgBase = 10; 
let progExpression = "";

function switchMode(modeName, btnElement) {
  const titles = { standard: "Standard", scientific: "Scientific", graphing: "Graphing", programmer: "Programmer", date: "Date calculation", currency: "Currency", volume: "Volume", length: "Length", settings: "Settings" };
  document.getElementById("mode-title").innerText = titles[modeName];
  document.querySelectorAll(".mode-content").forEach(el => el.classList.remove("active"));
  document.getElementById(`mode-${modeName}`).classList.add("active");
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
  if(btnElement) btnElement.classList.add("active");
  document.getElementById("sidebar").classList.remove("open");
  
  if (modeName === 'programmer') {
    updateProgrammer();
  }
}

function toggleMenu() { document.getElementById("sidebar").classList.toggle("open"); }
function toggleHistory() { document.getElementById("historyPanel").classList.toggle("open"); }
function keepOnTop() { document.getElementById("mainApp").classList.toggle("kept-on-top"); }

function setProgBase(base) {
  currentProgBase = base;
  document.querySelectorAll('.base-row').forEach(el => el.classList.remove('active-base'));
  
  if (base === 16) document.getElementById('row-hex').classList.add('active-base');
  if (base === 10) document.getElementById('row-dec').classList.add('active-base');
  if (base === 8) document.getElementById('row-oct').classList.add('active-base');
  if (base === 2) document.getElementById('row-bin').classList.add('active-base');
  
  updateProgrammer();
}

function updateProgrammer() {
  const wordSize = parseInt(document.getElementById("wordSize").value);
  let mask = (1n << BigInt(wordSize)) - 1n;
  let maskedVal = progValue & mask;

  document.getElementById("base-hex").innerText = maskedVal.toString(16).toUpperCase();
  document.getElementById("base-dec").innerText = maskedVal.toString(10);
  document.getElementById("base-oct").innerText = maskedVal.toString(8);
  document.getElementById("base-bin").innerText = maskedVal.toString(2);

  // Enable/Disable keys
  for (let i = 0; i <= 15; i++) {
    let hexChar = i.toString(16).toUpperCase();
    let btn = document.getElementById("btn-" + hexChar);
    if (btn) {
      if (i >= currentProgBase) { btn.disabled = true; } 
      else { btn.disabled = false; }
    }
  }
}

function progAppend(val) {
  let numVal = parseInt(val, 16);
  if (isNaN(numVal) || numVal >= currentProgBase) return; 

  let currentStr = progValue.toString(currentProgBase).toUpperCase();
  if (currentStr === "0") currentStr = "";
  let newStr = currentStr + val;
  progValue = BigInt(parseInt(newStr, currentProgBase));
  updateProgrammer();
}

function clearDisplay() {
  if (document.getElementById("mode-programmer").classList.contains("active")) {
    progValue = 0n;
    progExpression = "";
    updateProgrammer();
    return;
  }
  document.getElementById("display").value = "";
}

function toggleBitGrid() {
  const grid = document.getElementById("bitGrid");
  const bases = document.querySelector(".prog-bases");
  if (grid.style.display === "none") {
    grid.style.display = "grid";
    bases.style.display = "none";
  } else {
    grid.style.display = "none";
    bases.style.display = "flex";
  }
}

function toggleProgPanel(panel) {
  const p1 = document.getElementById("panel-bitwise");
  const p2 = document.getElementById("panel-shift");
  if (panel === 'bitwise') {
    p1.classList.toggle("active");
    p2.classList.remove("active");
  } else {
    p2.classList.toggle("active");
    p1.classList.remove("active");
  }
}

// Keyboard support for Programmer
window.addEventListener('keydown', (e) => {
  if (document.getElementById("mode-programmer").classList.contains("active")) {
    if (document.activeElement.tagName === "INPUT") return;
    let key = e.key.toUpperCase();
    if (/^[0-9A-F]$/.test(key)) {
      progAppend(key);
      e.preventDefault();
    }
  }
});

// Initialize on load
setTimeout(() => { 
  if(document.getElementById("mode-programmer").classList.contains("active")) {
    updateProgrammer(); 
  }
}, 100);
