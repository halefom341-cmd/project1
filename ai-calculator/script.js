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
  // Hide main calculator display when in Graphing mode
  const displayEl = document.getElementById("display");
  if (modeName === 'graphing') {
    displayEl.style.display = "none";
    setTimeout(resizeCanvas, 50);
  } else {
    displayEl.style.display = "block";
  }
  const titles = { standard: "Standard", scientific: "Scientific", graphing: "Graphing", programmer: "Programmer", date: "Date calculation", currency: "Currency", volume: "Volume", length: "Length", settings: "Settings" };
  document.getElementById("mode-title").innerText = titles[modeName];
  document.querySelectorAll(".mode-content").forEach(el => el.classList.remove("active"));
  document.getElementById(`mode-${modeName}`).classList.add("active");
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
  if(btnElement) btnElement.classList.add("active");
  
  // Trigger canvas resize if switching to graph
  if (modeName === 'graphing') {
    setTimeout(resizeCanvas, 50);
  }
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
  let safeExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/-/g, '-');
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
