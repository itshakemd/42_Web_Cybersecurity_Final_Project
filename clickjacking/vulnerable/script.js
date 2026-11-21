// alignment-test.js
// JS logic for alignment-test.html (single-document alignment helper page).

function log(msg) {
  document.getElementById('log').textContent += msg + "\n";
  console.log('[ACTION]', msg);
}

document.getElementById('orderBtn').addEventListener('click', () => {
  log('[EXECUTED] Order placed for $249.99.');
});
document.getElementById('deleteBtn').addEventListener('click', () => {
  log('[EXECUTED] Account deletion requested for logged-in user.');
});
document.getElementById('subscribeBtn').addEventListener('click', () => {
  log('[EXECUTED] Premium membership subscription started ($9.99/mo).');
});

// Generic delegation: each .target-wrap is a shared ancestor of its real
// button and its decoy. Whichever one the browser treats as the native
// click target, the event still bubbles up to the wrap, and we forward
// it to the real button with realBtn.click() (see the big comment at the
// top of alignment-test.html for why this JS step is needed here but NOT
// in the real iframe PoC).
document.querySelectorAll('.target-wrap').forEach((wrap) => {
  wrap.addEventListener('click', () => {
    const realBtn = wrap.querySelector('button:not(.decoy-overlay)');
    if (realBtn) realBtn.click();
  });
});

// ---- Spin-wheel-specific visual behavior (on top of the generic
// delegation above, which already fires the hidden Delete action) ----
const wheel = document.getElementById('wheel');
const decoyWheel = document.getElementById('decoyWheel');
const wheelWrap = decoyWheel.closest('.target-wrap');
let step = 1;
let currentRotation = 0;

const prizes = [
  { label: '$1000', centerDeg: 30 },
  { label: '$50', centerDeg: 90 },
  { label: 'FREE', centerDeg: 150 },
  { label: '$500', centerDeg: 210 },
  { label: '$0', centerDeg: 270 },
  { label: '$2000', centerDeg: 330 },
];

function spinWheel() {
  const target = prizes[Math.floor(Math.random() * prizes.length)];
  const extraSpins = 1440;
  const delta = (360 - target.centerDeg) % 360;
  currentRotation += extraSpins + delta;
  wheel.style.transform = `rotate(${currentRotation}deg)`;
  return target;
}

wheelWrap.addEventListener('click', () => {
  if (step === 1) {
    const won = spinWheel();
    decoyWheel.textContent = '...';
    setTimeout(() => {
      decoyWheel.textContent = `🎉 CLAIM YOUR ${won.label} 🎉`;
      step = 2;
    }, 2500); // keep in sync with the CSS transition duration in styles.css
  } else {
    decoyWheel.textContent = 'Thanks for playing!';
  }
});
