window.addEventListener('message', (event) => {
  if (event.data && event.data.demo) {
    console.log('[ATTACKER PAGE] Captured hidden action:', event.data.action);
  }
});
