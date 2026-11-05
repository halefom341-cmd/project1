const display = document.getElementById("display");
let memory = 0;
let history = [];
let isSecondFunc = false;
let isFE = false;

// --- Navigation ---
function toggleMenu() { document.getElementById("sidebar").classList.toggle("open"); }
function toggleHistory() { document.getElementById("historyPanel").classList.toggle("open"); }
function keepOnTop() { document.getElementById("mainApp").classList.toggle("kept-on-top"); }

function switchMode(modeName, btnElement) {
  const displayEl = document.getElementById("display");
  if (modeName === 'graphing') {
    displayEl.style.display = "none";
    setTimeout(() => {
      const container = document.getElementById("mode-graphing");
      const canvas = document.getElementById("graphCanvas");
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawGraph();
    }, 50);
  } else {
    displayEl.style.display = "block";
  }
  const titles = { standard: "Standard", scientific: "Scientific", graphing: "Graphing", programmer: "Programmer", date: "Date calculation", currency: "Currency", volume: "Volume", length: "Length", settings: "Settings" };
  document.getElementById("mode-title").innerText = titles[modeName];
  document.querySelectorAll(".mode-content").forEach(el => el.classList.remove("active"));
  document.getElementById(`mode-${modeName}`).classList.add("active");
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
  if(btnElement) btnElement.classList.add("active");
  toggleMenu();
}

// --- Panel Switching ---
function showPanel(panelName) {
  document.querySelectorAll(".sci-panel").forEach(el => el.classList.remove("active"));
  document.getElementById(`panel-${panelName}`).classList.add("active");
}
function toggleSecond() { isSecondFunc = !isSecondFunc; }
function toggleMemMenu() { 
  document.querySelectorAll(".mem-menu-content").forEach(el => el.classList.toggle("show")); 
}

// --- Basic Calculator ---
function append(value) {
  if (display.value === "Invalid input" || display.value === "Undefined") display.value = "";
  display.value += value; 
}
function clearDisplay() { display.value = ""; }
function backspace() { display.value = display.value.slice(0, -1); }
function clearEntry() {
  let val = display.value;
  let lastOp = Math.max(val.lastIndexOf('+'), val.lastIndexOf('-'), val.lastIndexOf('*'), val.lastIndexOf('/'));
  if (lastOp === -1) { display.value = ""; } else { display.value = val.substring(0, lastOp + 1); }
}
function toggleSign() {
  if (!display.value || display.value === "0") return;
  if (display.value.startsWith("-")) { display.value = display.value.substring(1); } else { display.value = "-" + display.value; }
}

function calculate() {
  const expr = display.value.trim();
  if (!expr) return;
  let safeExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  if (!/^[0-9+\-*/%.() ]+$/.test(safeExpr)) { display.value = "Invalid input"; return; }
  let result;
  try { result = eval(safeExpr); } catch { display.value = "Invalid input"; return; }
  if (!Number.isFinite(result)) { display.value = "Cannot divide by zero"; return; }
  history.push(`${expr} = ${parseFloat(result.toFixed(10))}`);
  renderHistory();
  display.value = parseFloat(result.toFixed(10)).toString();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// --- Scientific Logic ---
function toggleFE() {
  isFE = !isFE;
  if (isFE && display.value !== "") {
    display.value = Number(display.value).toExponential() + "e+0";
  } else if (!isFE && display.value.includes("e")) {
    display.value = Number(display.value).toString();
  }
}

function sciFunc(action) {
  let val;
  try { val = eval(display.value); } catch { val = 0; }
  switch(action) {
    case 'abs': display.value = Math.abs(val); break;
    case 'floor': display.value = Math.floor(val); break;
    case 'ceil': display.value = Math.ceil(val); break;
    case 'rand': display.value = Math.random(); break;
    case 'fact': 
      let res = 1;
      for(let i=1; i<=val; i++) res *= i;
      display.value = res;
      break;
    case 'pow10': display.value = Math.pow(10, val); break;
    case 'log': display.value = Math.log10(val); break;
    case 'ln': display.value = Math.log(val); break;
    case 'deg': display.value = val * 180 / Math.PI; break;
    case 'dms': display.value = val; break; 
  }
}

function appendTrig(func) {
  let val;
  try { val = eval(display.value); } catch { val = 0; }
  let rad = val * Math.PI / 180; 
  let result = 0;
  if (func === 'sin') result = Math.sin(rad);
  if (func === 'cos') result = Math.cos(rad);
  if (func === 'tan') result = Math.tan(rad);
  if (func === 'sec') result = 1 / Math.cos(rad);
  if (func === 'csc') result = 1 / Math.sin(rad);
  if (func === 'cot') result = 1 / Math.tan(rad);
  if (func === 'hyp') { alert("Hyperbolic functions coming soon!"); return; }
  if (Math.abs(result) < 1e-10) result = 0;
  display.value = result;
}

function square() { try { display.value = Math.pow(eval(display.value), 2); } catch { display.value = "Invalid"; } }
function squareRoot() { try { let v = eval(display.value); if (v < 0) display.value = "Invalid"; else display.value = Math.sqrt(v); } catch { display.value = "Invalid"; } }
function reciprocal() { try { let v = eval(display.value); if (v === 0) display.value = "Cannot divide by zero"; else display.value = 1 / v; } catch { display.value = "Invalid"; } }

// --- Memory Logic ---
function memoryClear() { memory = 0; display.placeholder = "0"; }
function memoryRecall() { display.value = memory; }
function memoryStore() { try { memory = eval(display.value) || 0; } catch { memory = 0; } display.placeholder = "M"; }
function memoryAdd() { try { memory += eval(display.value) || 0; } catch {} }
function memorySubtract() { try { memory -= eval(display.value) || 0; } catch {} }

// --- AI Logic ---
async function askAI() {
  const question = document.getElementById("aiQuestion").value.trim();
  const answerEl = document.getElementById("aiAnswer");
  const clearBtn = document.getElementById("clearBtn");
  if (!question) return;
  answerEl.textContent = "Thinking...";
  clearBtn.style.display = "none"; 
  try {
    const res = await fetch("https://project1-bice-alpha.vercel.app/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    answerEl.textContent = data.answer || data.error || "No answer";
    clearBtn.style.display = "block"; 
  } catch (err) {
    answerEl.textContent = "Could not reach server.";
    clearBtn.style.display = "block";
  }
}
function clearAI() {
  document.getElementById("aiQuestion").value = "";
  document.getElementById("aiAnswer").textContent = "";
  document.getElementById("clearBtn").style.display = "none";
}

// --- Keyboard Support ---
document.addEventListener("keydown", (e) => {
  if (e.target.id === "aiQuestion") {
    if (e.key === "Enter") { e.preventDefault(); askAI(); }
    return; 
  }
  const key = e.key;
  const allowed = "0123456789.+-*/%()";
  if (key.length === 1 && allowed.includes(key)) { e.preventDefault(); append(key); return; }
  if (key === "Enter" || key === "=") { e.preventDefault(); calculate(); } 
  else if (key === "Backspace") { e.preventDefault(); backspace(); } 
  else if (key === "Escape" || key === "Delete") { e.preventDefault(); clearDisplay(); }
});

// --- Enhanced Graphing Logic ---
let isTracing = false;
let angleMode = "deg"; // Default to degrees

function toggleGraphMode(mode) {
  document.getElementById("btnGraphMode").classList.toggle("active", mode === "graph");
  document.getElementById("btnEquationMode").classList.toggle("active", mode === "equation");
  
  const panel = document.getElementById("equationPanel");
  if (mode === "equation") {
    panel.classList.add("active");
  } else {
    panel.classList.remove("active");
  }
}

function toggleGraphOptions() {
  const panel = document.getElementById("graphOptionsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function toggleTrace() {
  isTracing = !isTracing;
  alert("Trace mode: " + (isTracing ? "ON (Move mouse over graph)" : "OFF"));
}

// Override the drawGraph function to support Radians/Degrees
const oldDrawGraph = drawGraph;
drawGraph = function() {
  if (document.getElementById("angleMode")) {
    angleMode = document.getElementById("angleMode").value;
  }
  
  if (document.getElementById("graphCanvas").width === 0) return;
  
  // Temporarily replace math functions with wrappers based on angle mode
  if (angleMode === "deg") {
    window.Math.sin = function(x) { return Math.sin(x * Math.PI / 180); };
    window.Math.cos = function(x) { return Math.cos(x * Math.PI / 180); };
    window.Math.tan = function(x) { return Math.tan(x * Math.PI / 180); };
  } else {
    // Restore native Math functions for radians
    delete window.Math.sin;
    delete window.Math.cos;
    delete window.Math.tan;
  }
  
  oldDrawGraph();
};

// Ensure display hides/shows correctly on mode switch
const oldSwitchMode = switchMode;
switchMode = function(modeName, btnElement) {
  oldSwitchMode(modeName, btnElement);
  const displayEl = document.getElementById("display");
  if (modeName === 'graphing') {
    displayEl.style.display = "none";
    setTimeout(() => {
      const container = document.getElementById("mode-graphing");
      const canvas = document.getElementById("graphCanvas");
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawGraph();
    }, 50);
  } else {
    displayEl.style.display = "block";
  }
};



// Initial call
setTimeout(() => { if(typeof updateProgrammer === "function") updateProgrammer(); }, 500);

// Ensure initialization
setTimeout(() => { if(typeof updateProgrammer === "function") updateProgrammer(); }, 500);

// Ensure setProgBase is defined globally and updates correctly
window.setProgBase = function(base) {
  currentProgBase = base;
  
  // Remove active class from all rows
  document.querySelectorAll('.base-row').forEach(el => el.classList.remove('active-base'));
  
  // Add active class to selected row
  if (base === 16) document.getElementById('row-hex').classList.add('active-base');
  if (base === 10) document.getElementById('row-dec').classList.add('active-base');
  if (base === 8) document.getElementById('row-oct').classList.add('active-base');
  if (base === 2) document.getElementById('row-bin').classList.add('active-base');
  
  updateProgrammer();
};

// --- Programmer Mode Logic (V3) ---
let progValue = 0n;
let currentProgBase = 10; 
let progExpression = ""; 

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

  // Update Display
  document.getElementById("base-hex").innerText = maskedVal.toString(16).toUpperCase();
  document.getElementById("base-dec").innerText = maskedVal.toString(10);
  document.getElementById("base-oct").innerText = maskedVal.toString(8);
  document.getElementById("base-bin").innerText = maskedVal.toString(2);

  // Also update the main top display since it's used in Programmer mode
  document.getElementById("display").value = maskedVal.toString(currentProgBase).toUpperCase();

  // Enable/Disable keys based on Base
  for (let i = 0; i <= 15; i++) {
    let hexChar = i.toString(16).toUpperCase();
    let btn = document.getElementById("btn-" + hexChar);
    if (btn) {
      if (i >= currentProgBase) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    }
  }

  renderBitGrid(wordSize);
}

function renderBitGrid(wordSize) {
  const grid = document.getElementById("bitGrid");
  if (grid.style.display === "none") return;
  grid.innerHTML = "";
  
  let maskedVal = progValue & ((1n << BigInt(wordSize)) - 1n);
  const binStr = maskedVal.toString(2).padStart(wordSize, '0');
  
  for (let i = 0; i < wordSize; i += 4) {
    let col = document.createElement("div");
    col.className = "bit-col";
    for (let j = 0; j < 4; j++) {
      let bitIndex = i + j;
      let bitVal = binStr[bitIndex];
      let btn = document.createElement("button");
      btn.className = "bit-btn " + (bitVal === '1' ? 'active' : '');
      btn.innerText = bitVal;
      btn.onclick = () => toggleBit(wordSize - 1 - bitIndex);
      col.appendChild(btn);
    }
    let label = document.createElement("div");
    label.className = "bit-label";
    label.innerText = (wordSize - 1 - i);
    col.appendChild(label);
    grid.appendChild(col);
  }
}

function toggleBit(bitIndex) {
  progValue ^= (1n << BigInt(bitIndex));
  updateProgrammer();
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
  updateProgrammer();
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

// Override standard append
const oldAppendProg = append;
append = function(val) {
  if (document.getElementById("mode-programmer").classList.contains("active")) {
    if (/^[0-9A-F]$/i.test(val)) {
      progAppend(val);
    } else {
        progExpression += ` ${progValue.toString(10)} ${val} `;
        progValue = 0n;
        updateProgrammer();
    }
    return;
  }
  oldAppendProg(val);
};

// Handle keyboard input for Programmer mode
const oldKeyDown = document.onkeydown; // Just to be safe if previous exists
window.addEventListener('keydown', (e) => {
  if (document.getElementById("mode-programmer").classList.contains("active")) {
    if (document.activeElement.tagName === "INPUT") return; // Ignore if typing in AI box
    
    let key = e.key.toUpperCase();
    if (/^[0-9A-F]$/.test(key)) {
      progAppend(key);
      e.preventDefault();
    } else if (key === "=" || key === "ENTER") {
      calculate();
      e.preventDefault();
    } else if (key === "BACKSPACE") {
      let str = progValue.toString(currentProgBase);
      if (str.length > 1) {
        str = str.slice(0, -1);
        progValue = BigInt(parseInt(str, currentProgBase));
      } else {
        progValue = 0n;
      }
      updateProgrammer();
      e.preventDefault();
    }
  }
});

// Initial call
setTimeout(() => { if(typeof updateProgrammer === "function") updateProgrammer(); }, 500);
