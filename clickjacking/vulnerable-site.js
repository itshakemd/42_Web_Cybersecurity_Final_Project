// vulnerable-site.js
// JS logic for vulnerable-site.html (the "victim" page).

if (!localStorage.getItem('demo_session')) {
  localStorage.setItem('demo_session', 'malek_logged_in_token_123');
}

function log(msg) {
  document.getElementById('log').textContent += msg + "\n";
  window.parent.postMessage({ demo: true, action: msg }, "*");
}

document.getElementById('orderBtn').addEventListener('click', () => {
  log('[EXECUTED] Order placed for $249.99 using session token: ' + localStorage.getItem('demo_session'));
});
document.getElementById('deleteBtn').addEventListener('click', () => {
  log('[EXECUTED] Account deletion requested for logged-in user.');
});
document.getElementById('subscribeBtn').addEventListener('click', () => {
  log('[EXECUTED] Premium membership subscription started ($9.99/mo) without explicit user intent.');
});
