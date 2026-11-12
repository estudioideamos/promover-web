addEventListener(
  "scroll",
  () =>
    document
      .querySelector(".header")
      .classList.toggle("scrolled", scrollY > 20),
  { passive: true },
);
const form = document.querySelector("form");
const floatingContact = document.querySelector(".floating-contact");
const contactFooter = document.querySelector(".footer-editorial");
if (floatingContact && contactFooter) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      const visible = !entries[0].isIntersecting;
      floatingContact.classList.toggle("shown", visible);
      floatingContact.inert = !visible;
    },
    { rootMargin: "0px 0px 80px 0px" },
  );
  footerObserver.observe(contactFooter);
}
const contactAside = document.querySelector(".contact-page-aside");
const contactHeader = document.querySelector(".header");
if (contactAside && contactHeader) {
  // Short viewports pin the bottom of the sidebar so every contact remains reachable.
  const syncAside = () => {
    const top = Math.min(
      contactHeader.offsetHeight + 18,
      innerHeight - contactAside.offsetHeight - 20,
    );
    contactAside.style.setProperty("--contact-aside-top", `${top}px`);
  };
  const asideObserver = new ResizeObserver(syncAside);
  asideObserver.observe(contactAside);
  asideObserver.observe(contactHeader);
  addEventListener("resize", syncAside, { passive: true });
  syncAside();
}
if (form) {
  const button = form.querySelector("button"),
    status = document.querySelector("#form-status");
  let submitting = false;
  let sendTimer, recoveryTimer;
  const lastSubmission = () => {
    try {
      return Number(sessionStorage.getItem("promover-submitted-at")) || 0;
    } catch {
      return 0;
    }
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.elements._honey.value.trim()) {
      status.textContent =
        "No pudimos procesar la consulta. Probá nuevamente o escribinos por WhatsApp.";
      return;
    }
    if (submitting || Date.now() - lastSubmission() < 30000) {
      status.textContent =
        "Tu consulta se está procesando. Esperá unos segundos antes de volver a enviar.";
      return;
    }
    submitting = true;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    form.classList.add("is-sending");
    status.textContent = "Preparando tu consulta para el envío seguro…";
    try {
      sessionStorage.setItem("promover-submitted-at", String(Date.now()));
    } catch {}
    sendTimer = setTimeout(
      () => HTMLFormElement.prototype.submit.call(form),
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600,
    );
    recoveryTimer = setTimeout(() => {
      button.disabled = false;
      submitting = false;
      form.removeAttribute("aria-busy");
      form.classList.remove("is-sending");
      status.textContent =
        "El envío está tardando. Podés volver a intentar o escribirnos por WhatsApp.";
    }, 12000);
  });
  addEventListener("pageshow", () => {
    clearTimeout(sendTimer);
    clearTimeout(recoveryTimer);
    button.disabled = false;
    submitting = false;
    form.removeAttribute("aria-busy");
    form.classList.remove("is-sending");
    status.textContent = "";
  });
  addEventListener("pagehide", () => {
    clearTimeout(sendTimer);
    clearTimeout(recoveryTimer);
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
