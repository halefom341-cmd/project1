const display = document.getElementById("display");

function append(value) { display.value += value; }
function clearDisplay() { display.value = ""; }
function backspace() { display.value = display.value.slice(0, -1); }

function calculate() {
  const expr = display.value.trim();
  if (!expr) return;
  
  // Allow letters for Math functions, numbers, and operators
  if (!/^[0-9a-zA-Z+\-*/%.() ]+$/.test(expr)) { display.value = "Invalid input"; return; }
  
  let result;
  try { 
    result = eval(expr); 
  } catch { 
    display.value = "Invalid expression"; 
    return; 
  }
  
  if (!Number.isFinite(result) || Number.isNaN(result)) { display.value = "Undefined"; return; }
  display.value = parseFloat(result.toFixed(10)).toString();
}

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
