// attack-classic-overlay.js
// JS logic for attack-classic-overlay.html (Payload 1: classic overlay).

// DEBUG LISTENER (for demo/verification purposes only):
// The hidden victim page (vulnerable-site.html) sends a postMessage every
// time one of its buttons is actually clicked. This listener catches that
// message and prints it to the DevTools Console, so you can confirm the
// hidden click actually landed on a real button WITHOUT needing to raise
// the iframe's opacity. Open DevTools (F12) -> Console tab, click the
// decoy button, and watch for "[ATTACKER PAGE] Captured hidden action".
window.addEventListener('message', (event) => {
  if (event.data && event.data.demo) {
    console.log('[ATTACKER PAGE] Captured hidden action:', event.data.action);
  }
});
