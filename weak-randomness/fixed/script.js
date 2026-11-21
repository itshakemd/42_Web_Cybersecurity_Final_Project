
"use strict";

// ==========================================
// Weak Randomness Lab - Fixed Version
// Browser-only educational simulation
// ==========================================

const TOKEN_RANGE = 1000000;
const MAX_ATTEMPTS = 5;
const TOKEN_LIFETIME_MS = 2 * 60 * 1000;

let attackerHistory = [];
let userToken = null;
let tokenIssuedAt = null;
let otherCount = 0;
let attemptsUsed = 0;
let accessGranted = false;

// DOM elements

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

// Secure token generation without modulo bias

function generateSecureToken() {
  const limit =
    Math.floor(4294967296 / TOKEN_RANGE) * TOKEN_RANGE;

  const randomValues = new Uint32Array(1);
  let value;

  do {
    crypto.getRandomValues(randomValues);
    value = randomValues[0];
  } while (value >= limit);

  return String(value % TOKEN_RANGE).padStart(6, "0");
}

// Table helpers

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

// Attacker history

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

// Token state

function tokenIsExpired() {
  return (
    tokenIssuedAt === null ||
    Date.now() - tokenIssuedAt >= TOKEN_LIFETIME_MS
  );
}

function invalidateUserToken(message) {
  userToken = null;
  tokenIssuedAt = null;

  userTokenOutput.textContent = "Expired";
  verifyBtn.disabled = true;

  verifyMessage.textContent = message;
  verifyMessage.className = "message failure";
}

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

// Attacker requests tokens

attackerBtn.addEventListener("click", () => {
  const token = generateSecureToken();

  attackerHistory.push(token);
  attackerTokenOutput.textContent = token;

  renderHistory();
});

// User requests token

userBtn.addEventListener("click", () => {
  userToken = generateSecureToken();
  tokenIssuedAt = Date.now();

  attemptsUsed = 0;
  accessGranted = false;

  userTokenOutput.textContent = "Token Issued";

  verifyInput.value = "";
  verifyBtn.disabled = false;

  verifyMessage.textContent =
    "Waiting for verification.";
  verifyMessage.className = "message";

  userMessage.textContent =
    "A new secure token was generated for the simulated user.";

  resetSimulationDisplay();
});

// Other users

otherBtn.addEventListener("click", () => {
  for (let i = 0; i < 5; i++) {
    generateSecureToken();
    otherCount++;
  }

  otherCountOutput.textContent = otherCount;

  userMessage.textContent =
    "Five independent token requests were simulated.";
});

// Shared verification logic

function checkCandidate(candidate) {
  if (userToken === null) {
    return "NO TOKEN";
  }

  if (tokenIsExpired()) {
    invalidateUserToken("Token expired. Request a new token.");
    return "EXPIRED";
  }

  if (accessGranted) {
    return "ALREADY VERIFIED";
  }

  if (attemptsUsed >= MAX_ATTEMPTS) {
    return "BLOCKED";
  }

  attemptsUsed++;

  if (candidate === userToken) {
    accessGranted = true;
    userToken = null;
    tokenIssuedAt = null;

    userTokenOutput.textContent = "Verified";
    verifyBtn.disabled = true;

    return "MATCH";
  }

  if (attemptsUsed >= MAX_ATTEMPTS) {
    verifyBtn.disabled = true;
  }

  return "NO MATCH";
}

// User verification

verifyBtn.addEventListener("click", () => {
  const candidate = verifyInput.value.trim();

  if (!/^\d{6}$/.test(candidate)) {
    verifyMessage.textContent =
      "Enter a valid 6-digit token.";
    verifyMessage.className = "message failure";
    return;
  }

  const result = checkCandidate(candidate);

  if (result === "MATCH") {
    verifyMessage.textContent =
      "ACCESS GRANTED — Demo account verified.";
    verifyMessage.className = "message success";
  } else if (result === "NO MATCH") {
    const remaining = MAX_ATTEMPTS - attemptsUsed;

    verifyMessage.textContent =
      `ACCESS DENIED — ${remaining} attempt(s) remaining.`;
    verifyMessage.className = "message failure";
  } else {
    verifyMessage.textContent =
      `Verification unavailable: ${result}.`;
    verifyMessage.className = "message failure";
  }
});

// Brute Force Simulation

testBtn.addEventListener("click", () => {
  if (userToken === null) {
    testResult.textContent = "NOT READY";
    testResult.className = "failure";
    testMessage.textContent =
      "Request a new user token first.";
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

  if (!candidates.every(token => /^\d{6}$/.test(token))) {
    testResult.textContent = "INVALID INPUT";
    testResult.className = "failure";
    testMessage.textContent =
      "Each candidate must contain exactly six digits.";
    return;
  }

  attemptBody.innerHTML = "";

  let lastResult = "NO MATCH";
  let comparisons = 0;

  for (const candidate of candidates) {
    const result = checkCandidate(candidate);
    comparisons++;

    addTableRow(attemptBody, [
      comparisons,
      candidate,
      result
    ]);

    lastResult = result;

    if (result !== "NO MATCH") {
      break;
    }
  }

  if (lastResult === "MATCH") {
    testResult.textContent = "MATCH FOUND";
    testResult.className = "success";

    testMessage.textContent =
      "The fictional token was verified and consumed.";
  } else if (
    lastResult === "BLOCKED" ||
    attemptsUsed >= MAX_ATTEMPTS
  ) {
    testResult.textContent = "BLOCKED";
    testResult.className = "failure";

    testMessage.textContent =
      "The shared verification attempt limit was reached.";
  } else if (lastResult === "EXPIRED") {
    testResult.textContent = "EXPIRED";
    testResult.className = "failure";

    testMessage.textContent =
      "The token expired before verification.";
  } else {
    testResult.textContent = "NO MATCH";
    testResult.className = "failure";

    testMessage.textContent =
      `${comparisons} comparison(s) completed. ` +
      `${MAX_ATTEMPTS - attemptsUsed} attempt(s) remaining.`;
  }
});

// Clear history

clearBtn.addEventListener("click", () => {
  attackerHistory = [];
  attackerTokenOutput.textContent = "------";
  renderHistory();
});

// Reset lab

resetBtn.addEventListener("click", () => {
  attackerHistory = [];
  userToken = null;
  tokenIssuedAt = null;
  otherCount = 0;
  attemptsUsed = 0;
  accessGranted = false;

  attackerTokenOutput.textContent = "------";
  userTokenOutput.textContent = "Not requested";
  otherCountOutput.textContent = "0";

  verifyInput.value = "";
  verifyBtn.disabled = false;

  verifyMessage.textContent =
    "Waiting for verification.";
  verifyMessage.className = "message";

  userMessage.textContent =
    "Waiting for user token generation.";

  candidateInput.value = "";

  renderHistory();
  resetSimulationDisplay();
});

// Initialize

renderHistory();
resetSimulationDisplay();
