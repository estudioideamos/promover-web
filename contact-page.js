addEventListener(
  "scroll",
  () =>
    document
      .querySelector(".header")
      .classList.toggle("scrolled", scrollY > 20),
  { passive: true },
);
const form = document.querySelector("form");
if (form) {
  const button = form.querySelector("button"),
    status = document.querySelector("#form-status");
  let submitting = false;
  const lastSubmission = () => {
    try {
      return Number(sessionStorage.getItem("promover-submitted-at")) || 0;
    } catch {
      return 0;
    }
  };
  form.addEventListener("submit", (event) => {
    if (form.elements._honey.value.trim()) {
      event.preventDefault();
      status.textContent =
        "No pudimos procesar la consulta. Probá nuevamente o escribinos por WhatsApp.";
      return;
    }
    if (submitting || Date.now() - lastSubmission() < 30000) {
      event.preventDefault();
      status.textContent =
        "Tu consulta se está procesando. Esperá unos segundos antes de volver a enviar.";
      return;
    }
    submitting = true;
    button.disabled = true;
    status.textContent = "Abriendo el envío seguro…";
    try {
      sessionStorage.setItem("promover-submitted-at", String(Date.now()));
    } catch {}
    setTimeout(() => {
      button.disabled = false;
      submitting = false;
    }, 12000);
  });
  addEventListener("pageshow", () => {
    button.disabled = false;
    submitting = false;
    status.textContent = "";
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
