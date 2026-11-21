// ==========================================
// Lab: Client-Side Enforcement of Server-Side Security
// ==========================================

// 1. Lab States and Variables
let isFixedMode = false;
// defult role in web 
let clientRole = "guest"; // A local variable in the browser that is easily tampered with (Source of the vulnerability)

// func check if clintrole is admin show delete button else hides it
function renderUI() {
    const deleteBtn = document.getElementById("deleteBtn");
    const roleIndicator = document.getElementById("currentRole");
    
    //update the role text in the page , the defult vlue is guest here we just show it upper case
    if (roleIndicator) {
        roleIndicator.innerText = clientRole.toUpperCase();
    }

    // [The Vulnerability]: Showing or hiding the delete button based solely on a browser-side variable
    if (clientRole === "admin") {
        if (deleteBtn) deleteBtn.style.display = "inline-block";
    } else {
        if (deleteBtn) deleteBtn.style.display = "none";
    }
}


function deleteProduct() {
    const output = document.getElementById("labOutput");
    const card = document.querySelector(".product-card");

    // Fixed Mode: check from the server
    if (isFixedMode) {
        const serverCheck = mockServerVerifySession();
        if (!serverCheck.authorized) {
            if (output) {
                output.innerHTML = "<strong>Blocked (Server-Side Check):</strong> Server session role is <code>guest</code>. Delete denied!";
                output.style.color = "crimson";
            }
            return;
        }
    }
    // Vulnerable Mode: dependnd om browser without check from the server 
    if (card) {
        card.style.display = "none";
    }
    if (output) {
        output.innerHTML = `<strong>Deleted (No Server Check):</strong> Action allowed based on client role (<code>${clientRole}</code>).`;
        output.style.color = "green";
    }
}


// 3. Mock Secure Server (Does not rely on browser variables)
function mockServerVerifySession() {
    // The server maintains the true session state in its database, not in the browser
    const actualDatabaseRole = "guest"; 
    return { authorized: actualDatabaseRole === "admin" };
}

// ==========================================
// 4. Payloads (Triggered by the visitor in the lab)
// ==========================================

// Payload 1: Memory/Variable Tampering in JavaScript
function payloadChangeRole() {
    clientRole = "admin";
    renderUI();
    const output = document.getElementById("labOutput");
    if (output) {
        output.innerHTML = " <strong>Payload 1 Executed:</strong> Injected and changed `clientRole` to `admin` in browser memory. Now click the Delete button!";
        output.style.color = "orange";
    }
}


// Payload 3: Local Storage Tampering
function payloadModifyLocalStorage() {
    localStorage.setItem("userSessionRole", "admin");
    clientRole = "admin";
    renderUI();
    const output = document.getElementById("labOutput");
    if (output) {
        output.innerHTML = " <strong>Payload 3 Executed:</strong> Injected a new value into `localStorage` successfully to bypass frontend checks!";
        output.style.color = "orange";
    }
}

// ==========================================
// 5. Lab Controls (Toggling Vulnerable/Fixed and Resetting)
// ==========================================
function toggleSecurityMode() {
    const modeSwitch = document.getElementById("modeSwitch");
    const modeLabel = document.getElementById("modeLabel");
    
    if (modeSwitch) {
        isFixedMode = modeSwitch.checked;
    }
    
    if (modeLabel) {
        modeLabel.innerText = isFixedMode 
            ? "Fixed (Server-Side Enforcement)" 
            : "Vulnerable (Client-Side Check)";
    }
    resetLab();
}

function resetLab() {
    clientRole = "guest";
    localStorage.removeItem("userSessionRole");
    renderUI();
    const output = document.getElementById("labOutput");
    if (output) {
        output.innerHTML = "Status: Logged in as Guest (Standard User)";
        output.style.color = "black";
    }

    const card = document.querySelector(".product-card");
if (card) card.style.display = "block";
}

// Initialize on window load
window.onload = function() {
    renderUI();
};


function renderTheLineSnapshot() {
  const codeEl = document.getElementById("vulnerableCodeSnapshot");
  const lineNumEl = document.getElementById("vulnerableLineNumber");
  const reasonEl = document.getElementById("vulnerableLineReason");

  if (!codeEl) return;

  const fullCode = `function deleteProduct() {

    if (isFixedMode) {
        const serverCheck = mockServerVerifySession();
        if (!serverCheck.authorized) {
            if (output) {
                output.innerHTML = "<strong>Blocked (Server-Side Check):</strong> Server session role is <code>guest</code>. Delete denied!";
                output.style.color = "crimson";
            }
            return;
        }
    }
    // Vulnerable Mode: dependnd om browser without check from the server 
    if (card) {
        card.style.display = "none";
    }
    if (output) {
        output.innerHTML = \`<strong>Deleted (No Server Check):</strong> Action allowed based on client role (<code>\${clientRole}</code>).\`;
        output.style.color = "green";
    }
}`;

  const escapeHtml = (str) =>
    str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const lines = fullCode.split("\n");
  const highlightedLineNumbers = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed === "if (card) {" ||
      trimmed === 'card.style.display = "none";' ||
      (index > 15 && index < 22 && trimmed === "}")
    ) {
      highlightedLineNumbers.push(index + 1);
    }
  });

  codeEl.innerHTML = lines
    .map((line, idx) => {
      const lineNum = idx + 1;
      const isHl = highlightedLineNumbers.includes(lineNum);
      return `<span class="snap-line${isHl ? " is-highlight" : ""}">${escapeHtml(line)}</span>`;
    })
    .join("");

  if (lineNumEl) {
    lineNumEl.textContent = highlightedLineNumbers.join(", ");
  }

  if (reasonEl) {
    reasonEl.textContent =
      'Hides the product card directly in the browser without verifying authorization on the server.';
  }
}

document.addEventListener("DOMContentLoaded", renderTheLineSnapshot);

function renderFixedCodeSnapshot() {
  const codeEl = document.getElementById("fixedCodeSnapshot");
  const lineNumEl = document.getElementById("fixedLineNumber");
  const explainEl = document.getElementById("fixExplanationText");

  if (!codeEl) return;

  const fixCode = `// 3. Mock Secure Server (Does not rely on browser variables)
function mockServerVerifySession() {
    // The server maintains the true session state in its database, not in the browser
    const actualDatabaseRole = "guest"; 
    return { authorized: actualDatabaseRole === "admin" };
}`;

  const escapeHtml = (str) =>
    str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const lines = fixCode.split("\n");
  const highlightedLines = [];

  lines.forEach((line, idx) => {
    if (line.includes('actualDatabaseRole === "admin"')) {
      highlightedLines.push(idx + 1);
    }
  });

  codeEl.innerHTML = lines
    .map((line, idx) => {
      const lineNum = idx + 1;
      const isHl = highlightedLines.includes(lineNum);
      return `<span class="snap-line${isHl ? " is-highlight" : ""}">${escapeHtml(line)}</span>`;
    })
    .join("");

  if (lineNumEl) {
    lineNumEl.textContent = highlightedLines.join(", ");
  }

  if (explainEl) {
    explainEl.textContent =
      "Checks the user role against the server-side session state instead of trusting client-controlled browser values.";
  }
}

document.addEventListener("DOMContentLoaded", renderFixedCodeSnapshot);