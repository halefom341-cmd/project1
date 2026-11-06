let display = document.getElementById("display");
let isFE = false;
let isSecondFunc = false;

// --- History Logic ---
let historyData = [];

function toggleHistory() {
  document.getElementById("historyPanel").classList.toggle("open");
}

function addToHistory(equation, result) {
  historyData.unshift({ eq: equation, res: result }); // Add to top
  if (historyData.length > 50) historyData.pop(); // Limit to 50 items
  renderHistory();
}

function clearHistory() {
  historyData = [];
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  if (historyData.length === 0) {
    list.innerHTML = "<li style='color:#666; text-align:center; border:none;'>No history yet</li>";
    return;
  }
  historyData.forEach(item => {
    let li = document.createElement("li");
    li.innerHTML = `${item.eq} <span class="hist-result">${item.res}</span>`;
    // Optional: Click history item to load it
    li.onclick = () => { display.value = item.res; };
    li.style.cursor = "pointer";
    list.appendChild(li);
  });
}

// --- Scientific Math Logic ---
function append(val) { 
  if (display.value === "Error") display.value = "";
  display.value += val; 
}
function backspace() { display.value = display.value.slice(0, -1); }
function clearEntry() { display.value = ""; }
function toggleSign() { if(display.value) display.value = display.value.startsWith("-") ? display.value.substring(1) : "-" + display.value; }

function square() { 
  try { 
    let val = eval(display.value);
    display.value = isSecondFunc ? Math.pow(val, 3) : Math.pow(val, 2); 
  } catch { display.value = "Error"; } 
}

function squareRoot() { 
  try { 
    let val = eval(display.value); 
    if (val < 0) { display.value = "Invalid Input"; return; }
    display.value = Math.sqrt(val); 
  } catch { display.value = "Invalid Input"; } 
}
function reciprocal() { 
  try { 
    let val = eval(display.value); 
    if (val === 0) { display.value = "Invalid Input"; return; }
    display.value = 1 / val; 
  } catch { display.value = "Invalid Input"; } 
}

// F-E Toggle Logic
function toggleFE() {
  isFE = !isFE;
  if (isFE) {
    let val = 0;
    try { val = eval(display.value); } catch { val = 0; }
    if (isNaN(val) || val === 0) { display.value = "0.e+0"; return; }
    display.value = val.toExponential();
  } else {
    let val = 0;
    try { val = eval(display.value); } catch { val = 0; }
    display.value = val.toString();
  }
}

function calculate() { 
    try { 
        let originalExpr = display.value;
        let expr = originalExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
        let result = eval(expr); 
        
        if (!Number.isFinite(result) || isNaN(result)) {
            display.value = "Invalid Input";
        } else {
            let finalResult = parseFloat(result.toFixed(10));
            display.value = finalResult;
            // Save to history
            if (originalExpr.trim() !== "") {
                addToHistory(originalExpr + " =", finalResult);
            }
        }
        isFE = false; 
    } catch { display.value = "Invalid Input"; } 
}

// Panels (Trig, Func)
function showPanel(p) { 
  document.querySelectorAll(".sci-panel").forEach(el => el.classList.remove("active")); 
  document.getElementById(`panel-${p}`).classList.add("active"); 
}

// --- 2nd Function Toggle ---
function toggleSecond() {
  isSecondFunc = !isSecondFunc;
  
  const sinBtn = document.getElementById("btn-sin");
  const cosBtn = document.getElementById("btn-cos");
  const tanBtn = document.getElementById("btn-tan");
  const secBtn = document.getElementById("btn-sec");
  const cscBtn = document.getElementById("btn-csc");
  const cotBtn = document.getElementById("btn-cot");
  const sqBtn = document.getElementById("btn-sq");

  if (isSecondFunc) {
    if(sinBtn) sinBtn.innerText = "sin⁻¹";
    if(cosBtn) cosBtn.innerText = "cos⁻¹";
    if(tanBtn) tanBtn.innerText = "tan⁻¹";
    if(secBtn) secBtn.innerText = "sec⁻¹";
    if(cscBtn) cscBtn.innerText = "csc⁻¹";
    if(cotBtn) cotBtn.innerText = "cot⁻¹";
    if(sqBtn) sqBtn.innerText = "x³";
  } else {
    if(sinBtn) sinBtn.innerText = "sin";
    if(cosBtn) cosBtn.innerText = "cos";
    if(tanBtn) tanBtn.innerText = "tan";
    if(secBtn) secBtn.innerText = "sec";
    if(cscBtn) cscBtn.innerText = "csc";
    if(cotBtn) cotBtn.innerText = "cot";
    if(sqBtn) sqBtn.innerText = "x²";
  }
}

// --- Trigonometry Logic ---
function updateTrigIndicator() {
  // The dropdown itself shows the indicator, so we don't need extra text.
}

function appendTrig(func) {
  let val = eval(display.value || 0);
  let mode = document.getElementById("angle-mode").value;
  let res = 0;
  let mathRad = 0;
  
  // Convert input to Radians for JS Math
  if (mode === "DEG") mathRad = val * Math.PI / 180;
  else if (mode === "GRAD") mathRad = val * Math.PI / 200;
  else mathRad = val; // RAD
  
  if (!isSecondFunc) {
    if (func === 'sin') res = Math.sin(mathRad);
    if (func === 'cos') res = Math.cos(mathRad);
    if (func === 'tan') {
      // Handle undefined tan at 90 deg, 100 grad
      if ((mode === "DEG" && Math.abs(val % 180) === 90) || (mode === "GRAD" && Math.abs(val % 200) === 100) || (mode === "RAD" && Math.abs(val % Math.PI) === Math.PI/2)) {
        display.value = "Invalid Input"; return;
      }
      res = Math.tan(mathRad);
    }
    if (func === 'sec') res = 1 / Math.cos(mathRad);
    if (func === 'csc') res = 1 / Math.sin(mathRad);
    if (func === 'cot') res = 1 / Math.tan(mathRad);
  } else {
    // Inverse trig always returns in the current unit
    if (func === 'sin') res = Math.asin(val);
    if (func === 'cos') res = Math.acos(val);
    if (func === 'tan') res = Math.atan(val);
    
    // Convert Radians to desired unit
    if (mode === "DEG") res = res * 180 / Math.PI;
    else if (mode === "GRAD") res = res * 200 / Math.PI;
  }
  
  if (isNaN(res) || !Number.isFinite(res)) { display.value = "Invalid Input"; return; }
  if (Math.abs(res) < 1e-10) res = 0;
  
  // Format the equation history exactly like your screenshots
  let unitSymbol = "";
  if (mode === "DEG") unitSymbol = "°";
  else if (mode === "GRAD") unitSymbol = "g";
  else if (mode === "RAD") unitSymbol = "r";

  let funcDisplay = isSecondFunc ? func + "⁻¹" : func;
  let eqDisplay = `${funcDisplay}(${val}${unitSymbol})`;
  document.getElementById("equation-history").innerText = eqDisplay;
  
  let finalRes = parseFloat(res.toFixed(10));
  display.value = finalRes;
  addToHistory(eqDisplay + " =", finalRes);
}

function sciFunc(action) {
  let val = eval(display.value || 0);
  let res = val;
  
  if (action === 'abs') res = Math.abs(val);
  if (action === 'sgn') res = Math.sign(val);
  if (action === 'floor') res = Math.floor(val);
  if (action === 'ceil') res = Math.ceil(val);
  if (action === 'rand') res = Math.random();
  if (action === 'deg') res = val * 180 / Math.PI;
  if (action === 'dms') res = val;
  if (action === 'fact') { 
    let r = 1; 
    for(let i=1; i<=val; i++) r*=i; 
    res = r; 
  }
  if (action === 'log') res = Math.log10(val);
  if (action === 'ln') res = Math.log(val);
  if (action === 'pow10') res = Math.pow(10, val);
  
  if (!Number.isFinite(res) || isNaN(res)) { display.value = "Invalid Input"; return; }
  display.value = parseFloat(res.toFixed(10));
}

// --- Memory Logic ---
let memory = 0;
function memoryClear() { memory = 0; }
function memoryRecall() { display.value = memory; }
function memoryAdd() { try { memory += eval(display.value) || 0; } catch {} }
function memorySubtract() { try { memory -= eval(display.value) || 0; } catch {} }
function memoryStore() { try { memory = eval(display.value) || 0; } catch {} }

// --- DMS (Degrees, Minutes, Seconds) Logic ---
function convertDMS() {
  try {
    // Strip everything except numbers, minus, and dot
    let cleanStr = display.value.replace(/[^0-9.-]/g, '');
    if (!cleanStr) return;
    
    let val = parseFloat(cleanStr);
    let sign = val < 0 ? -1 : 1;
    val = Math.abs(val);
    
    let deg = Math.floor(val);
    let rem = (val - deg) * 60;
    let min = Math.floor(rem);
    let sec = parseFloat(((rem - min) * 60).toFixed(4));
    
    display.value = `${sign < 0 ? '-' : ''}${deg}° ${min}′ ${sec}″`;
  } catch { display.value = "Invalid Input"; }
}

function convertDeg() {
  try {
    let str = display.value;
    
    // If there are no symbols, just return the number
    if (!str.includes('°') && !str.includes('′') && !str.includes('″')) return;

    let parts = str.split(/[°′″]/);
    
    let deg = parseFloat(parts[0]) || 0;
    let min = parseFloat(parts[1]) || 0;
    let sec = parseFloat(parts[2]) || 0;
    
    let isNeg = deg < 0 || str.includes("-");
    deg = Math.abs(deg);
    
    let decimal = deg + (min / 60) + (sec / 3600);
    if (isNeg) decimal = -decimal;
    
    display.value = parseFloat(decimal.toFixed(8));
  } catch { display.value = "Invalid Input"; }
}

// --- AI Chat Logic ---
async function askAI() {
  const q = document.getElementById("aiQuestion").value.trim();
  const a = document.getElementById("aiAnswer");
  const clearBtn = document.getElementById("clearBtn");
  if (!q) return;
  a.textContent = "Thinking...";
  clearBtn.style.display = "none";

  try {
    const res = await fetch("https://project1-bice-alpha.vercel.app/ask", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q })
    });
    const data = await res.json();
    a.textContent = data.answer || data.error || "No answer";
    clearBtn.style.display = "block";
  } catch { a.textContent = "Could not reach server."; clearBtn.style.display = "block"; }
}

function clearAI() { 
  document.getElementById("aiQuestion").value = ""; 
  document.getElementById("aiAnswer").textContent = ""; 
  document.getElementById("clearBtn").style.display = "none";
}

// Keyboard support
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
  else if (key === "Escape" || key === "Delete") { e.preventDefault(); clearEntry(); }
});









