const categories = {
  textil: {
    title: "Textil",
    image: "textil",
    description:
      "Indumentaria que lleva tu identidad. Desarrollamos cada prenda desde la moldería hasta los detalles de terminación, según tu proyecto.",
    tags: ["Indumentaria", "Identidad de marca", "Moldería propia"],
  },
  marroquineria: {
    title: "Marroquinería",
    image: "cuero",
    description:
      "Bolsos y accesorios para acompañar todos los días. Diseñamos piezas funcionales y cuidadas que llevan la identidad de tu empresa.",
    tags: ["Bolsos y accesorios", "Desarrollo a medida", "Funcionalidad"],
  },
  especiales: {
    title: "Desarrollos especiales",
    image: "objetos",
    description:
      "Tu idea, con su propia forma. Integramos diseño, moldería y fabricación en una propuesta para tu empresa, campaña o evento.",
    tags: ["Diseño a medida", "Fabricación propia", "Proyectos especiales"],
  },
  boligrafos: {
    title: "Bolígrafos",
    image: "boligrafos",
    description:
      "Un detalle cotidiano que lleva tu marca. Explorá propuestas de escritura para tus acciones de comunicación y regalos empresarios.",
    tags: ["Escritura", "Regalos empresarios", "Comunicación"],
  },
  promociones: {
    title: "Conservadoras y accesorios",
    image: "cooler-promover",
    sourceUrl: "https://www.instagram.com/promover.marketing/p/DesRZU7D8re/",
    description:
      "Tu marca, en cada salida. Conservadoras y accesorios pensados para tu público, tu campaña y el mensaje que querés transmitir.",
    tags: ["Acciones de marca", "Eventos", "Campañas"],
  },
  hogar: {
    title: "Hogar y tiempo libre",
    image: "asado-promover",
    sourceUrl: "https://www.instagram.com/promover.marketing/p/De0FTsCDjHV/",
    description:
      "Tu marca también acompaña los buenos momentos. Objetos útiles para disfrutar en casa, al aire libre y en compañía.",
    tags: ["Vida cotidiana", "Tiempo libre", "Regalos"],
  },
  sustentable: {
    title: "Sustentable",
    image: "sustentable",
    description:
      "Objetos reutilizables y materiales elegidos para acompañar tu marca. Desarrollamos una propuesta según tu proyecto.",
    tags: ["Reutilizables", "Selección de materiales", "Propuestas a medida"],
  },
};
const nav = document.querySelector("#navigation");
const header = document.querySelector(".header");
const sectionLinks = [...nav.querySelectorAll("[data-nav]")];
const navigationTargets = sectionLinks.map((link) => ({
  link,
  section: document.querySelector(link.hash),
}));
let navigationFrame = 0;
function syncNavigation() {
  navigationFrame = 0;
  // Batch geometry reads before attribute writes; no layout read during startup.
  const states = navigationTargets.map(({ link, section }) => {
    const rect = section?.getBoundingClientRect();
    return { link, active: rect && rect.top <= 140 && rect.bottom > 140 };
  });
  header.classList.toggle("scrolled", scrollY > 20);
  for (const { link, active } of states) {
    if (active && link.getAttribute("aria-current") !== "location")
      link.setAttribute("aria-current", "location");
    else if (!active && link.hasAttribute("aria-current"))
      link.removeAttribute("aria-current");
  }
}
function scheduleNavigation() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(syncNavigation);
}
addEventListener("scroll", scheduleNavigation, { passive: true });
addEventListener("resize", scheduleNavigation);
addEventListener("pageshow", () => {
  if (scrollY > 20) scheduleNavigation();
});
const dialog = document.querySelector("#category-dialog");
let lastCategory;
document.querySelectorAll("[data-category]").forEach((button) =>
  button.addEventListener("click", () => {
    const c = categories[button.dataset.category];
    lastCategory = button;
    const source = document.querySelector("#dialog-source");
    source.hidden = !c.sourceUrl;
    if (c.sourceUrl) source.href = c.sourceUrl;
    document.querySelector("#dialog-title").textContent = c.title;
    document.querySelector("#dialog-description").textContent = c.description;
    const img = document.querySelector("#dialog-image");
    img.src = `assets/${c.image}.webp`;
    img.alt = `Imagen ilustrativa de ${c.title}`;
    document.querySelector("#dialog-tags").replaceChildren(
      ...c.tags.map((t) => {
        const s = document.createElement("span");
        s.textContent = t;
        return s;
      }),
    );
    document.querySelector("#dialog-cta").href =
      "https://wa.me/5491167172341?text=" +
      encodeURIComponent(
        `Hola Promover, quiero solicitar un presupuesto para ${c.title}.`,
      );
    dialog.showModal();
    document.body.classList.add("locked");
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("locked");
  lastCategory?.focus({ preventScroll: true });
});
document.querySelector("#year").textContent = new Date().getFullYear();
const logos = document.querySelector("#client-logos");
const group = logos.querySelector(".logo-group");
const loopObserver = new IntersectionObserver(
  (entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("img").forEach((img) => (img.alt = ""));
    logos.append(clone);
    logos.classList.add("loop-ready");
    loopObserver.disconnect();
  },
  { rootMargin: "600px 0px" },
);
loopObserver.observe(logos);
const logoWindow = document.querySelector(".logo-window");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function syncMotionPreference() {
  if (reducedMotion.matches) {
    logoWindow.tabIndex = 0;
  } else {
    logoWindow.removeAttribute("tabindex");
  }
}
syncMotionPreference();
reducedMotion.addEventListener("change", syncMotionPreference);
const floatingContact = document.querySelector(".floating-contact");
floatingContact.inert = true;
const visibility = new Map([
  ["inicio", true],
  ["contacto", false],
  ["footer", false],
  ["universo", false],
]);
const contactSection = document.querySelector("#contacto");
function syncContactBackground() {
  contactSection.classList.toggle(
    "background-active",
    Boolean(
      visibility.get("contacto") &&
      !document.hidden &&
      !navigator.connection?.saveData,
    ),
  );
}
document.addEventListener("visibilitychange", syncContactBackground);
navigator.connection?.addEventListener("change", syncContactBackground);
const contactObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries)
      visibility.set(entry.target.id || "footer", entry.isIntersecting);
    syncContactBackground();
    const show =
      !visibility.get("inicio") &&
      !visibility.get("contacto") &&
      !visibility.get("footer");
    floatingContact.classList.toggle("shown", show);
    floatingContact.classList.toggle("compact", visibility.get("universo"));
    floatingContact.inert = !show;
  },
  { rootMargin: "-80px 0px 0px 0px" },
);
for (const selector of [
  "#inicio",
  "#contacto",
  ".footer-editorial",
  "#universo",
])
  contactObserver.observe(document.querySelector(selector));
if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-heading,.category,.manufacture-copy,.clients-heading,.process-steps article,.contact-main",
    )
    .forEach((el, index) => {
      if (el.classList.contains("category"))
        el.style.setProperty("--delay", `${(index % 3) * 70}ms`);
      observer.observe(el);
    });
}
