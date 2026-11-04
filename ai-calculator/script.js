const display = document.getElementById("display");

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  const expr = display.value.trim();
  if (!expr) return;

  if (!/^[0-9+\-*/%.() ]+$/.test(expr)) {
    display.value = "Invalid input";
    return;
  }

  let result;
  try {
    result = eval(expr);
  } catch {
    display.value = "Invalid expression";
    return;
  }

  if (!Number.isFinite(result)) {
    display.value = "Undefined";
    return;
  }

  display.value = parseFloat(result.toFixed(10)).toString();
}

function askAI() {
  const question = document.getElementById("aiQuestion").value.trim();
  const answerEl = document.getElementById("aiAnswer");
  if (!question) return;
  answerEl.textContent = "AI not connected yet. You asked: " + question;
}

// --- Keyboard support ---
document.addEventListener("keydown", (e) => {
  const key = e.key;
  const allowed = "0123456789.+-*/%()";

  if (key.length === 1 && allowed.includes(key)) {
    e.preventDefault();
    append(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    e.preventDefault();
    backspace();
  } else if (key === "Escape" || key === "Delete") {
    e.preventDefault();
    clearDisplay();
  }
});
