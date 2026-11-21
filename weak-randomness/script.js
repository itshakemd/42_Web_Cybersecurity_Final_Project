
"use strict";

// ==========================================
// Weak Randomness — Fix Snapshot
// ==========================================

const fixCode = document.getElementById("fixCode");
const copyBtn = document.getElementById("copyBtn");
const copyMessage = document.getElementById("copyMessage");

const secureCode = `// Secure password reset token generation
// using the Web Crypto API.

function generateSecureToken() {
  const TOKEN_RANGE = 1000000;

  const limit =
    Math.floor(4294967296 / TOKEN_RANGE)
    * TOKEN_RANGE;

  const values = new Uint32Array(1);
  let randomValue;

  do {
    crypto.getRandomValues(values);
    randomValue = values[0];
  } while (randomValue >= limit);

  return String(randomValue % TOKEN_RANGE)
    .padStart(6, "0");
}

// Additional protections:
// - Expire tokens after a short period.
// - Invalidate tokens after successful use.
// - Limit verification attempts.
// - Enforce token verification on the server.`;

if (fixCode) {
  fixCode.textContent = secureCode;
}

if (copyBtn && copyMessage) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(secureCode);
      copyMessage.textContent = "Code copied successfully.";
    } catch {
      copyMessage.textContent =
        "Copy unavailable. Select the code manually.";
    }
  });
}
