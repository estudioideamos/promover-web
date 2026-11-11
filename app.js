const categories = {
  textil: {
    title: "Textil",
    image: "textil",
    description:
      "Prendas que llevan tu identidad. Pensamos la indumentaria como una extensión de tu marca: desde el concepto y la moldería hasta los detalles de terminación.",
    tags: ["Indumentaria", "Identidad de marca", "Moldería propia"],
  },
  marroquineria: {
    title: "Marroquinería",
    image: "cuero",
    description:
      "Objetos para acompañar todos los días. Desarrollamos propuestas de marroquinería para llevar la identidad de tu empresa a piezas funcionales y cuidadas.",
    tags: ["Bolsos y accesorios", "Desarrollo a medida", "Funcionalidad"],
  },
  especiales: {
    title: "Desarrollos especiales",
    image: "objetos",
    description:
      "Hay ideas que necesitan su propia forma. Integramos diseño, moldería y fabricación para desarrollar una propuesta particular para tu empresa, tu campaña o tu evento.",
    tags: ["Diseño a medida", "Fabricación propia", "Proyectos especiales"],
  },
  boligrafos: {
    title: "Bolígrafos",
    image: "boligrafos",
    description:
      "Un detalle cotidiano puede ser un punto de contacto con tu marca. Consultanos por propuestas de escritura para tus acciones de comunicación y regalos empresarios.",
    tags: ["Escritura", "Regalos empresarios", "Comunicación"],
  },
  promociones: {
    title: "Conservadoras y accesorios",
    image: "cooler-promover",
    sourceUrl: "https://www.instagram.com/promover.marketing/p/DesRZU7D8re/",
    description:
      "Acompañamos el objetivo de cada acción con una propuesta de artículos promocionales pensada para tu público y el mensaje que querés transmitir.",
    tags: ["Acciones de marca", "Eventos", "Campañas"],
  },
  hogar: {
    title: "Hogar y tiempo libre",
    image: "asado-promover",
    sourceUrl: "https://www.instagram.com/promover.marketing/p/De0FTsCDjHV/",
    description:
      "Tu marca también puede formar parte de los momentos de disfrute. Buscamos objetos útiles y cercanos para acompañar la vida cotidiana de quienes los reciben.",
    tags: ["Vida cotidiana", "Tiempo libre", "Regalos"],
  },
  sustentable: {
    title: "Sustentable",
    image: "sustentable",
    description:
      "Una categoría para explorar alternativas de materiales y objetos reutilizables según las necesidades de tu proyecto. Consultanos por las opciones disponibles y sus características.",
    tags: ["Reutilizables", "Selección de materiales", "Propuestas a medida"],
  },
};
const nav = document.querySelector("#navigation");
function closeMenu() {
  window.promoverCloseMenu?.();
}
const header = document.querySelector(".header");
const sectionLinks = [...nav.querySelectorAll("[data-nav]")];
let sectionObserver;
function updateHeader() {
  header.classList.toggle("scrolled", scrollY > 20);
}
function observeNavigation() {
  sectionObserver?.disconnect();
  const active = new Set();
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target.id);
        else active.delete(entry.target.id);
      }
      for (const link of sectionLinks) {
        if (active.has(link.hash.slice(1)))
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    },
    {
      rootMargin: `-100px 0px -${Math.max(0, innerHeight - 140)}px 0px`,
      threshold: 0,
    },
  );
  for (const link of sectionLinks) {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  }
}
addEventListener("scroll", updateHeader, { passive: true });
addEventListener("resize", () => {
  if (innerWidth > 900) closeMenu();
  observeNavigation();
});
observeNavigation();
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
const contactObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries)
      visibility.set(entry.target.id || "footer", entry.isIntersecting);
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
