(() => {
  const button = document.querySelector(".menu-toggle"),
    nav = document.querySelector("#navigation");
  const mobile = matchMedia("(max-width:900px)");
  const background = [
    ...document.querySelectorAll(
      "body > main,body > footer,body > .floating-contact,.header > .brand,body > .skip",
    ),
  ];
  let previousInert = new Map();
  function setOpen(open, returnFocus = false) {
    open = open && mobile.matches;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    nav.inert = mobile.matches && !open;
    if (open) {
      previousInert = new Map(background.map((el) => [el, el.inert]));
      background.forEach((el) => (el.inert = true));
      nav.querySelector("a").focus({ preventScroll: true });
    } else {
      previousInert.forEach((value, el) => (el.inert = value));
      previousInert.clear();
      if (returnFocus) button.focus({ preventScroll: true });
    }
  }
  window.promoverCloseMenu = () => setOpen(false);
  button.addEventListener("click", () =>
    setOpen(button.getAttribute("aria-expanded") !== "true"),
  );
  nav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => setOpen(false, true)));
  document.addEventListener("keydown", (e) => {
    if (button.getAttribute("aria-expanded") !== "true") return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false, true);
    }
    if (e.key === "Tab") {
      const first = nav.querySelector("a");
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        button.focus();
      } else if (!e.shiftKey && document.activeElement === button) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  mobile.addEventListener("change", () => setOpen(false));
  setOpen(false);
})();
