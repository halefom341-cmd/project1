const display = document.getElementById("display");

// --- Navigation Logic ---
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("open");
}

function switchMode(modeName, btnElement) {
  // 1. Change Title
  const titles = {
    standard: "Standard", scientific: "Scientific", graphing: "Graphing", programmer: "Programmer",
    date: "Date calculation", currency: "Currency", volume: "Volume", length: "Length", settings: "Settings"
  };
  document.getElementById("mode-title").innerText = titles[modeName];

  // 2. Hide all modes, show selected
  document.querySelectorAll(".mode-content").forEach(el => el.classList.remove("active"));
  document.getElementById(`mode-${modeName}`).classList.add("active");

  // 3. Highlight active menu item
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
  if(btnElement) btnElement.classList.add("active");

  // 4. Close menu
  toggleMenu();
}

// --- Calculator Logic ---
function append(value) { display.value += value; }
function clearDisplay() { display.value = ""; }
function backspace() { display.value = display.value.slice(0, -1); }

function calculate() {
  const expr = display.value.trim();
  if (!expr) return;
  if (!/^[0-9+\-*/%.() ]+$/.test(expr)) { display.value = "Invalid input"; return; }
  let result;
  try { result = eval(expr); } catch { display.value = "Invalid expression"; return; }
  if (!Number.isFinite(result)) { display.value = "Undefined"; return; }
  display.value = parseFloat(result.toFixed(10)).toString();
}

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
    answerEl.textContent = "Could not reach server. Is it running?";
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
