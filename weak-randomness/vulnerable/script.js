
"use strict";

// ==========================================
// Weak Randomness Lab
// Educational Local Simulation
// ==========================================

const INITIAL_TOKEN = 120063;
const TOKEN_STEP = 37;
const TOKEN_MODULUS = 1000000;
const MAX_CANDIDATES = 20;
const MAX_VERIFY_ATTEMPTS = 5;

let currentToken = INITIAL_TOKEN;
let attackerHistory = [];
let userToken = null;
let otherCount = 0;
let verifyAttempts = 0;
let accessGranted = false;

// DOM Elements

const attackerBtn = document.getElementById("attackerBtn");
const userBtn = document.getElementById("userBtn");
const otherBtn = document.getElementById("otherBtn");
const clearBtn = document.getElementById("clearBtn");
const testBtn = document.getElementById("testBtn");
const resetBtn = document.getElementById("resetBtn");
const verifyBtn = document.getElementById("verifyBtn");

const attackerTokenOutput = document.getElementById("attackerToken");
const userTokenOutput = document.getElementById("userToken");
const historyBody = document.getElementById("historyBody");
const otherCountOutput = document.getElementById("otherCount");
const userMessage = document.getElementById("userMessage");

const verifyInput = document.getElementById("verifyInput");
const verifyMessage = document.getElementById("verifyMessage");

const candidateInput = document.getElementById("candidateInput");
const testResult = document.getElementById("testResult");
const testMessage = document.getElementById("testMessage");
const attemptBody = document.getElementById("attemptBody");

// ==========================================
// Vulnerable Global Token Generator
// ==========================================

function generateToken() {
  currentToken =
    (currentToken + TOKEN_STEP) % TOKEN_MODULUS;

  return String(currentToken).padStart(6, "0");
}

// ==========================================
// Table Helpers
// ==========================================

function addEmptyRow(body, columns, message) {
  body.innerHTML = "";

  const row = document.createElement("tr");
  const cell = document.createElement("td");

  cell.colSpan = columns;
  cell.className = "empty";
  cell.textContent = message;

  row.appendChild(cell);
  body.appendChild(row);
}

function addTableRow(body, values) {
  const row = document.createElement("tr");

  values.forEach(value => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  body.appendChild(row);
}

// ==========================================
// Attacker History
// ==========================================

function renderHistory() {
  if (attackerHistory.length === 0) {
    addEmptyRow(
      historyBody,
      2,
      "No tokens generated yet."
    );
    return;
  }

  historyBody.innerHTML = "";

  attackerHistory.forEach((token, index) => {
    addTableRow(historyBody, [
      index + 1,
      token
    ]);
  });
}

// ==========================================
// Attacker: Request Token
// ==========================================

attackerBtn.addEventListener("click", () => {
  const token = generateToken();

  attackerHistory.push(token);
  attackerTokenOutput.textContent = token;

  renderHistory();
});

// ==========================================
// User: Request Token
// ==========================================

userBtn.addEventListener("click", () => {
  userToken = generateToken();
  verifyAttempts = 0;
  accessGranted = false;

  userTokenOutput.textContent = "Token Issued";

  verifyInput.value = "";
  verifyBtn.disabled = false;

  verifyMessage.textContent = "Waiting for verification.";
  verifyMessage.className = "message";

  userMessage.textContent =
    "A new token was generated for the simulated user.";

  resetSimulationDisplay();
});

// ==========================================
// Other Users
// ==========================================

otherBtn.addEventListener("click", () => {
  for (let i = 0; i < 5; i++) {
    generateToken();
    otherCount++;
  }

  otherCountOutput.textContent = otherCount;

  userMessage.textContent =
    "Five additional token requests were simulated.";
});

// ==========================================
// Verification
// ==========================================

verifyBtn.addEventListener("click", () => {
  if (userToken === null) {
    verifyMessage.textContent =
      "Request a token first.";
    verifyMessage.className = "message failure";
    return;
  }

  if (accessGranted) {
    verifyMessage.textContent =
      "ACCESS GRANTED — Demo account already verified.";
    verifyMessage.className = "message success";
    return;
  }

  if (verifyAttempts >= MAX_VERIFY_ATTEMPTS) {
    verifyMessage.textContent =
      "Verification attempt limit reached.";
    verifyMessage.className = "message failure";
    verifyBtn.disabled = true;
    return;
  }

  const enteredToken = verifyInput.value.trim();

  if (!/^\d{6}$/.test(enteredToken)) {
    verifyMessage.textContent =
      "Enter a valid 6-digit token.";
    verifyMessage.className = "message failure";
    return;
  }

  verifyAttempts++;

  if (enteredToken === userToken) {
    accessGranted = true;

    verifyMessage.textContent =
      "ACCESS GRANTED — Demo account verified.";
    verifyMessage.className = "message success";

    userTokenOutput.textContent = "Verified";
    verifyBtn.disabled = true;
  } else {
    const remaining = MAX_VERIFY_ATTEMPTS - verifyAttempts;

    verifyMessage.textContent =
      remaining > 0
        ? `ACCESS DENIED — Invalid token. ${remaining} attempt(s) remaining.`
        : "ACCESS DENIED — Verification attempt limit reached.";

    verifyMessage.className = "message failure";

    if (remaining === 0) {
      verifyBtn.disabled = true;
    }
  }
});

// ==========================================
// Clear Attacker History
// ==========================================

clearBtn.addEventListener("click", () => {
  attackerHistory = [];
  attackerTokenOutput.textContent = "------";
  renderHistory();
});

// ==========================================
// Simulation Helpers
// ==========================================

function resetSimulationDisplay() {
  testResult.textContent = "Waiting";
  testResult.className = "";

  testMessage.textContent =
    "Enter candidate tokens to start a local simulation.";

  addEmptyRow(
    attemptBody,
    3,
    "No simulation attempts yet."
  );
}

// ==========================================
// Brute Force Simulation
// ==========================================

testBtn.addEventListener("click", () => {
  if (userToken === null) {
    testResult.textContent = "NOT READY";
    testResult.className = "failure";

    testMessage.textContent =
      "Request a user token before starting the simulation.";
    return;
  }

  const candidates = candidateInput.value
    .split(/\r?\n/)
    .map(value => value.trim())
    .filter(Boolean);

  if (candidates.length === 0) {
    testResult.textContent = "NO INPUT";
    testResult.className = "failure";

    testMessage.textContent =
      "Enter at least one candidate token.";
    return;
  }

  if (candidates.length > MAX_CANDIDATES) {
    testResult.textContent = "LIMIT EXCEEDED";
    testResult.className = "failure";

    testMessage.textContent =
      `Maximum ${MAX_CANDIDATES} candidates per simulation.`;
    return;
  }

  if (!candidates.every(token => /^\d{6}$/.test(token))) {
    testResult.textContent = "INVALID INPUT";
    testResult.className = "failure";

    testMessage.textContent =
      "Each candidate must contain exactly six digits.";
    return;
  }

  attemptBody.innerHTML = "";

  let matchedToken = null;
  let attempts = 0;

  for (const candidate of candidates) {
    attempts++;

    const matched = candidate === userToken;

    addTableRow(attemptBody, [
      attempts,
      candidate,
      matched ? "MATCH" : "NO MATCH"
    ]);

    if (matched) {
      matchedToken = candidate;
      break;
    }
  }

  if (matchedToken !== null) {
    testResult.textContent = "MATCH FOUND";
    testResult.className = "success";

    testMessage.textContent =
      `Matched demo token: ${matchedToken}. ` +
      `Found after ${attempts} comparison(s). ` +
      "Enter it in the User verification field.";
  } else {
    testResult.textContent = "NO MATCH";
    testResult.className = "failure";

    testMessage.textContent =
      `No matching token among ${attempts} candidate(s).`;
  }
});

// ==========================================
// Reset Entire Lab
// ==========================================

resetBtn.addEventListener("click", () => {
  currentToken = INITIAL_TOKEN;

  attackerHistory = [];
  userToken = null;
  otherCount = 0;
  verifyAttempts = 0;
  accessGranted = false;

  attackerTokenOutput.textContent = "------";
  userTokenOutput.textContent = "Not requested";
  otherCountOutput.textContent = "0";

  verifyInput.value = "";
  verifyBtn.disabled = false;

  verifyMessage.textContent = "Waiting for verification.";
  verifyMessage.className = "message";

  userMessage.textContent =
    "Waiting for user token generation.";

  candidateInput.value = "";

  renderHistory();
  resetSimulationDisplay();
});

// ==========================================
// Initialize
// ==========================================

renderHistory();
resetSimulationDisplay();
