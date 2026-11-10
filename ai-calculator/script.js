// GLOBAL VARIABLES
let display = document.getElementById("display");
let isSecondFunc = false;
let dataList = [];
let historyData = [];
let currentBase = 10;

// --- Navigation ---
function showPanel(p) { 
  document.querySelectorAll(".sci-panel").forEach(el => el.classList.remove("active")); 
  let panel = document.getElementById(`panel-${p}`);
  if (panel) panel.classList.add("active");
}

// --- Core Math ---
function append(val) { 
  if (display.value === "Error" || display.value === "Invalid Input") display.value = "";
  display.value += val; 
}
function clearEntry() { display.value = ""; }
function backspace() { display.value = display.value.slice(0, -1); }
function square() { try { display.value = Math.pow(eval(display.value), 2); } catch { display.value = "Error"; } }
function squareRoot() { try { display.value = Math.sqrt(eval(display.value)); } catch { display.value = "Error"; } }
function reciprocal() { try { display.value = 1 / eval(display.value); } catch { display.value = "Error"; } }
function toggleSign() { if(display.value) display.value = display.value.startsWith("-") ? display.value.substring(1) : "-" + display.value; }
function toggleFE() { alert("F-E toggled"); }

function calculate() { 
    let expr = display.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
    
    // Check if the expression contains 'y =' or 'x =', if so, strip it
    expr = expr.replace(/^[a-zA-Z]\s*=\s*/, '');
    
    try { 
        let res = eval(expr);
        display.value = Number.isFinite(res) ? parseFloat(res.toFixed(10)) : "Invalid Input";
        addToHistory(expr, display.value);
    } catch { display.value = "Invalid Input"; } 
}

// --- Trig ---
function toggleSecond(e) {
  isSecondFunc = !isSecondFunc;
  
  const sinBtn = document.getElementById("btn-sin");
  const cosBtn = document.getElementById("btn-cos");
  const tanBtn = document.getElementById("btn-tan");
  const secBtn = document.getElementById("btn-sec");
  const cscBtn = document.getElementById("btn-csc");
  const cotBtn = document.getElementById("btn-cot");
  const hypBtn = document.getElementById("btn-hyp");

  if (isSecondFunc) {
    if (sinBtn) { sinBtn.innerText = "sin⁻¹"; sinBtn.style.color = "#4af626"; }
    if (cosBtn) { cosBtn.innerText = "cos⁻¹"; cosBtn.style.color = "#4af626"; }
    if (tanBtn) { tanBtn.innerText = "tan⁻¹"; tanBtn.style.color = "#4af626"; }
    if (secBtn) { secBtn.innerText = "sec⁻¹"; secBtn.style.color = "#4af626"; }
    if (cscBtn) { cscBtn.innerText = "csc⁻¹"; cscBtn.style.color = "#4af626"; }
    if (cotBtn) { cotBtn.innerText = "cot⁻¹"; cotBtn.style.color = "#4af626"; }
    if (hypBtn) { hypBtn.innerText = "hyp⁻¹"; hypBtn.style.color = "#4af626"; }
    if (e && e.target) { e.target.style.color = "#4af626"; }
  } else {
    if (sinBtn) { sinBtn.innerText = "sin"; sinBtn.style.color = "white"; }
    if (cosBtn) { cosBtn.innerText = "cos"; cosBtn.style.color = "white"; }
    if (tanBtn) { tanBtn.innerText = "tan"; tanBtn.style.color = "white"; }
    if (secBtn) { secBtn.innerText = "sec"; secBtn.style.color = "white"; }
    if (cscBtn) { cscBtn.innerText = "csc"; cscBtn.style.color = "white"; }
    if (cotBtn) { cotBtn.innerText = "cot"; cotBtn.style.color = "white"; }
    if (hypBtn) { hypBtn.innerText = "hyp"; hypBtn.style.color = "white"; }
    if (e && e.target) { e.target.style.color = "white"; }
  }
}

function appendTrig(func) {
  let val = 0;
  try { val = eval(display.value || 0); } catch { val = 0; }
  
  let mode = document.getElementById("angle-mode").value;
  let res = 0;
  
  if (!isSecondFunc) {
    // Normal Trig
    let rad = mode === "DEG" ? val * Math.PI / 180 : (mode === "GRAD" ? val * Math.PI / 200 : val);
    if (func === 'sin') res = Math.sin(rad);
    if (func === 'cos') res = Math.cos(rad);
    if (func === 'tan') res = Math.tan(rad);
    if (func === 'sec') res = 1 / Math.cos(rad);
    if (func === 'csc') res = 1 / Math.sin(rad);
    if (func === 'cot') res = 1 / Math.tan(rad);
    if (func === 'hyp') { alert("Hyperbolic not supported"); return; }
  } else {
    // Inverse Trig
    if (func === 'sin') res = Math.asin(val);
    if (func === 'cos') res = Math.acos(val);
    if (func === 'tan') res = Math.atan(val);
    if (func === 'sec') res = Math.acos(1 / val);
    if (func === 'csc') res = Math.asin(1 / val);
    if (func === 'cot') res = Math.atan(1 / val);
    if (func === 'hyp') { alert("Inverse Hyperbolic not supported"); return; }
    
    // Convert back to degrees/gradians
    if (mode === "DEG") res = res * 180 / Math.PI;
    if (mode === "GRAD") res = res * 200 / Math.PI;
  }
  
  if (!Number.isFinite(res) || isNaN(res)) { display.value = "Invalid Input"; return; }
  if (Math.abs(res) < 1e-10) res = 0;
  
  display.value = parseFloat(res.toFixed(10));
}

// --- Scientific Funcs ---
function sciFunc(action) {
  let val = eval(display.value || 0);
  let res = val;
  if (action === 'abs') res = Math.abs(val);
  if (action === 'floor') res = Math.floor(val);
  if (action === 'ceil') res = Math.ceil(val);
  if (action === 'sgn') res = Math.sign(val);
  if (action === 'trunc') res = Math.trunc(val);
  if (action === 'round') res = Math.round(val);
  if (action === 'fact') { let r = 1; for(let i=1; i<=val; i++) r*=i; res = r; }
  if (action === 'log') res = Math.log10(val);
  if (action === 'ln') res = Math.log(val);
  if (action === 'pow10') res = Math.pow(10, val);
  if (!Number.isFinite(res) || isNaN(res)) { display.value = "Invalid Input"; return; }
  display.value = parseFloat(res.toFixed(6));
}

// --- Memory ---
let memory = 0;
function memoryClear() { memory = 0; }
function memoryRecall() { display.value = memory; }
function memoryAdd() { try { memory += eval(display.value) || 0; } catch {} }
function memorySubtract() { try { memory -= eval(display.value) || 0; } catch {} }
function memoryStore() { try { memory = eval(display.value) || 0; } catch {} }

// --- Calculus Logic ---
let currentCalcMode = "";

function calcDerivative() {
  let eqStr = display.value.trim();
  if (!eqStr.includes('x')) { alert("Please type an equation with 'x' on the main screen first (e.g., y = x^2 + 3)"); return; }
  
  currentCalcMode = "derivative";
  document.getElementById("calc-input-box").style.display = "block";
  // Auto-fill the equation box with what is on the main screen
  document.getElementById("calc-equation").value = eqStr; 
  document.getElementById("calc-point").focus();
}

function calcIntegral() {
  let eqStr = display.value.trim();
  if (!eqStr.includes('x')) { alert("Please type an equation with 'x' on the main screen first (e.g., y = x^2 + 3)"); return; }
  
  currentCalcMode = "integral";
  document.getElementById("calc-input-box").style.display = "block";
  document.getElementById("calc-equation").value = eqStr;
  document.getElementById("calc-point").focus();
}

function executeCalculus() {
  let eqStr = document.getElementById("calc-equation").value;
  let xVal = parseFloat(document.getElementById("calc-point").value) || 0;
  
  if (!eqStr) { display.value = "Enter Equation"; return; }

  // Clean up the equation string for JavaScript eval()
  // Replace 'x' with the value, handle implicit multiplication (2x -> 2*x)
  let safeEq = eqStr.replace(/([0-9])([a-zA-Z])/g, '$1*$2')
                    .replace(/\^/g, '**');

  let f;
  try {
    f = new Function('x', `return ${safeEq};`);
    if (isNaN(f(xVal))) throw new Error("Invalid");
  } catch {
    display.value = "Invalid Equation";
    return;
  }

  let finalRes = 0;

  if (currentCalcMode === "derivative") {
    // Numerical derivative using central difference
    let h = 0.00001;
    let deriv = (f(xVal + h) - f(xVal - h)) / (2 * h);
    finalRes = deriv;
  } 
  else if (currentCalcMode === "integral") {
    // Numerical integration (Trapezoidal rule) from 0 to x
    let a = 0; 
    let b = xVal; 
    let n = 1000;
    let h = (b - a) / n;
    
    let sum = 0.5 * (f(a) + f(b));
    for (let i = 1; i < n; i++) {
      sum += f(a + i * h);
    }
    finalRes = sum * h;
  }
  
  if (!Number.isFinite(finalRes) || isNaN(finalRes)) { 
    display.value = "Math Error"; 
  } else {
    display.value = parseFloat(finalRes.toFixed(6));
    addToHistory(`${currentCalcMode} of (${eqStr}) at x=${xVal}`, display.value);
  }
  
  document.getElementById("calc-input-box").style.display = "none";
}

// --- Data Entry Keypad ---
function appendData(val) { document.getElementById("raw-data-input").value += val; }
function dataBackspace() { 
  let el = document.getElementById("raw-data-input");
  el.value = el.value.slice(0, -1); 
}
function loadRawData() {
  let input = document.getElementById("raw-data-input").value;
  let newData = input.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v)); 
  if (newData.length > 0) { 
    dataList = newData; 
    updateDataPreview(); 
    display.value = dataList.length + " items loaded"; 
    document.getElementById("raw-data-input").value = "";
  } else { display.value = "Invalid Data"; }
}
function updateDataPreview() { 
  let el = document.getElementById("data-preview");
  if(el) el.innerText = "Data: [" + dataList.join(", ") + "]"; 
}
function clearDataList() { 
  dataList = []; 
  updateDataPreview(); 
  display.value = ""; 
  document.getElementById("raw-data-input").value = "";
}

function calcStat(type) {
  if (dataList.length === 0) { display.value = "No Data"; return; }
  let n = dataList.length, sum = dataList.reduce((a, b) => a + b, 0), mean = sum / n, res = 0;
  if (type === 'sum') res = sum;
  if (type === 'mean') res = mean;
  if (type === 'sd') res = Math.sqrt(dataList.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
  if (type === 'mode') {
    let counts = {}; let maxCount = 0;
    dataList.forEach(val => { let key = val.toString(); if (!counts[key]) counts[key] = { count: 0, value: val }; counts[key].count++; if (counts[key].count > maxCount) maxCount = counts[key].count; });
    if (maxCount === 1) res = "No Mode";
    else {
      let modes = Object.values(counts).filter(item => item.count === maxCount).map(item => item.value);
      res = "Mode: " + modes.join(", ");
    }
  }
  if (typeof res === 'number') res = parseFloat(res.toFixed(4));
  display.value = res;
}
function calcAllStats() {
  if (dataList.length === 0) { display.value = "No Data"; return; }
  let n = dataList.length, sum = dataList.reduce((a, b) => a + b, 0), mean = sum / n;
  let variance = dataList.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  display.value = `n=${n}; sum=${sum}; mean=${mean.toFixed(2)}; sd=${Math.sqrt(variance).toFixed(2)}`;
  display.style.fontSize = "14px";
}

// --- Logic Keypad ---
function changeLogicBase() {
  let newBase = parseInt(document.getElementById("logic-base").value);
  let input = document.getElementById("logic-input");
  
  // Convert current input if it exists
  if (input.value !== "") {
    try {
      if (!input.value.includes(" ")) {
        let decimalVal = parseInt(input.value, currentBase);
        if (!isNaN(decimalVal)) input.value = decimalVal.toString(newBase).toUpperCase();
      }
    } catch { input.value = ""; }
  }
  currentBase = newBase;

  // --- NEW: Enable/Disable Buttons based on Base ---
  for (let i = 0; i <= 15; i++) {
    let hexChar = i.toString(16).toUpperCase();
    let btn = document.getElementById("btn-logic-" + hexChar);
    if (btn) {
      if (i >= currentBase) {
        btn.disabled = true;
        btn.style.opacity = "0.3"; // Make it look grayed out
      } else {
        btn.disabled = false;
        btn.style.opacity = "1";
      }
    }
  }
}
function logicAppend(char) {
  let input = document.getElementById("logic-input");
  let num = parseInt(char, 16); 
  if (num >= currentBase) return; 
  input.value += char;
}
function logicClear() { document.getElementById("logic-input").value = ""; }
function logicBackspace() { document.getElementById("logic-input").value = document.getElementById("logic-input").value.slice(0, -1); }
function logicOp(op) {
  let input = document.getElementById("logic-input");
  if (input.value === "") return;
  if (input.value.includes(" AND ") || input.value.includes(" OR ") || input.value.includes(" XOR ")) return;
  input.value += ` ${op} `;
}
function logicCalculate() {
  let input = document.getElementById("logic-input").value;
  if (!input) return;
  
  if (input.startsWith("NOT ")) {
    let val = parseInt(input.replace("NOT ", ""), currentBase);
    document.getElementById("logic-input").value = (~val).toString(currentBase).toUpperCase();
    return;
  }

  let parts, res;
  let val1, val2;
  
  if (input.includes(" AND ")) { parts = input.split(" AND "); val1 = parseInt(parts[0].trim(), currentBase); val2 = parseInt(parts[1].trim(), currentBase); res = val1 & val2; }
  else if (input.includes(" OR ")) { parts = input.split(" OR "); val1 = parseInt(parts[0].trim(), currentBase); val2 = parseInt(parts[1].trim(), currentBase); res = val1 | val2; }
  else if (input.includes(" XOR ")) { parts = input.split(" XOR "); val1 = parseInt(parts[0].trim(), currentBase); val2 = parseInt(parts[1].trim(), currentBase); res = val1 ^ val2; }
  else if (input.includes(" NAND ")) { parts = input.split(" NAND "); val1 = parseInt(parts[0].trim(), currentBase); val2 = parseInt(parts[1].trim(), currentBase); res = ~(val1 & val2); }
  else if (input.includes(" NOR ")) { parts = input.split(" NOR "); val1 = parseInt(parts[0].trim(), currentBase); val2 = parseInt(parts[1].trim(), currentBase); res = ~(val1 | val2); }
  else if (input.includes(" XNOR ")) { parts = input.split(" XNOR "); val1 = parseInt(parts[0].trim(), currentBase); val2 = parseInt(parts[1].trim(), currentBase); res = ~(val1 ^ val2); }
  else return;

  if (parts.length === 2) {
    // Note: JS bitwise NOT (~) returns a signed 32-bit integer, 
    // so we use >>> 0 to convert it to an unsigned integer before displaying.
    let displayRes = res >>> 0;
    document.getElementById("logic-input").value = displayRes.toString(currentBase).toUpperCase();
  }
}

// --- History & AI ---
function toggleHistory() { document.getElementById("historyPanel").classList.toggle("open"); }
function addToHistory(eq, res) {
  historyData.unshift({eq, res});
  document.getElementById("historyList").innerHTML = historyData.map(i => `<li>${i.eq} <br><span style="color:#4af626">${i.res}</span></li>`).join('');
}
function clearHistory() { historyData = []; document.getElementById("historyList").innerHTML = ""; }

async function askAI() {
  let q = document.getElementById("aiQuestion").value;
  if(!q) return;
  document.getElementById("aiAnswer").innerText = "Thinking...";
  try {
    let res = await fetch("https://project1-bice-alpha.vercel.app/ask", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({question: q}) });
    let data = await res.json();
    document.getElementById("aiAnswer").innerText = data.answer;
    document.getElementById("clearBtn").style.display = "block";
  } catch { document.getElementById("aiAnswer").innerText = "Error"; }
}
function clearAI() { document.getElementById("aiQuestion").value = ""; document.getElementById("aiAnswer").innerText = ""; document.getElementById("clearBtn").style.display = "none"; }






