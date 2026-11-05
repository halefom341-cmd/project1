const display = document.getElementById("display");
let memory = 0;

// --- Navigation ---
function toggleMenu() { document.getElementById("sidebar").classList.toggle("open"); }
function switchMode(modeName, btnElement) {
  const titles = { standard: "Standard", scientific: "Scientific", graphing: "Graphing", programmer: "Programmer", date: "Date calculation", currency: "Currency", volume: "Volume", length: "Length", settings: "Settings" };
  document.getElementById("mode-title").innerText = titles[modeName];
  document.querySelectorAll(".mode-content").forEach(el => el.classList.remove("active"));
  document.getElementById(`mode-${modeName}`).classList.add("active");
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
  if(btnElement) btnElement.classList.add("active");
  toggleMenu();
}

// --- Calculator Logic ---
function append(value) {
  if (display.value === "Invalid input" || display.value === "Undefined") display.value = "";
  display.value += value; 
}
function clearDisplay() { display.value = ""; }
function backspace() { display.value = display.value.slice(0, -1); }

function clearEntry() {
  // Clears the current number being typed, but not the whole equation
  let val = display.value;
  let lastOp = Math.max(val.lastIndexOf('+'), val.lastIndexOf('-'), val.lastIndexOf('*'), val.lastIndexOf('/'));
  if (lastOp === -1) { display.value = ""; } 
  else { display.value = val.substring(0, lastOp + 1); }
}

function toggleSign() {
  if (!display.value || display.value === "0") return;
  if (display.value.startsWith("-")) { display.value = display.value.substring(1); } 
  else { display.value = "-" + display.value; }
}

function square() {
  try { display.value = Math.pow(eval(display.value), 2); } catch { display.value = "Invalid input"; }
}

function squareRoot() {
  try {
    let val = eval(display.value);
    if (val < 0) { display.value = "Invalid input"; } 
    else { display.value = Math.sqrt(val); }
  } catch { display.value = "Invalid input"; }
}

function reciprocal() {
  try {
    let val = eval(display.value);
    if (val === 0) { display.value = "Cannot divide by zero"; } 
    else { display.value = 1 / val; }
  } catch { display.value = "Invalid input"; }
}

function calculate() {
  const expr = display.value.trim();
  if (!expr) return;
  // Replace visual symbols with JS operators
  let safeExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  if (!/^[0-9+\-*/%.() ]+$/.test(safeExpr)) { display.value = "Invalid input"; return; }
  
  let result;
  try { result = eval(safeExpr); } catch { display.value = "Invalid input"; return; }
  
  if (!Number.isFinite(result)) { display.value = "Cannot divide by zero"; return; }
  display.value = parseFloat(result.toFixed(10)).toString();
}

// --- Memory Logic ---
function memoryClear() { memory = 0; }
function memoryRecall() { display.value = memory; }
function memoryStore() { try { memory = eval(display.value) || 0; } catch { memory = 0; } }
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
