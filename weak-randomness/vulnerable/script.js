document.querySelector("#generate")?.addEventListener("click", () => {
  document.querySelector("#token").textContent = String(Math.floor(Math.random() * 100000));
});