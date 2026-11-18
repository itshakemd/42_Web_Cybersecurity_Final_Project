document.querySelector("#generate")?.addEventListener("click", () => {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  document.querySelector("#token").textContent = values[0].toString(16).padStart(8, "0");
});