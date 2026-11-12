const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
function syncEditorialMotion() {
  document.documentElement.classList.toggle(
    "editorial-motion",
    !motionPreference.matches && !navigator.connection?.saveData,
  );
}
syncEditorialMotion();
motionPreference.addEventListener("change", syncEditorialMotion);
navigator.connection?.addEventListener("change", syncEditorialMotion);

const productSheet = document.querySelector("#category-dialog");
const lightbox = document.querySelector("#product-lightbox");
const expand = document.querySelector(".product-expand");
let photos = [],
  title = "",
  photoIndex = 0;
const image = lightbox.querySelector("#lightbox-image");
const caption = lightbox.querySelector("#lightbox-caption");
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  image.src = photos[photoIndex];
  image.alt = `${photoIndex ? "Otra propuesta" : "Vista principal"} de la línea ${title}. Imagen ilustrativa.`;
  caption.textContent =
    photos.length > 1
      ? `${photoIndex ? "Otra propuesta de esta línea" : "Vista principal"} · Imagen ilustrativa`
      : "Vista ampliada · Imagen ilustrativa";
}
productSheet.addEventListener("productchange", (event) => {
  ({ photos, title } = event.detail);
  photoIndex = 0;
  expand.setAttribute(
    "aria-label",
    `Ampliar ${photos.length > 1 ? "galería" : "foto"} de ${title}`,
  );
  expand.querySelector("span").textContent =
    photos.length > 1 ? "Ver galería" : "Ampliar";
});
expand.addEventListener("click", () => {
  if (!photos.length) return;
  lightbox.querySelector("#lightbox-title").textContent = title;
  lightbox.querySelector("nav").hidden = photos.length < 2;
  showPhoto(0);
  lightbox.showModal();
});
lightbox
  .querySelector(".lightbox-close")
  .addEventListener("click", () => lightbox.close());
lightbox
  .querySelector("[data-photo-previous]")
  .addEventListener("click", () => showPhoto(photoIndex - 1));
lightbox
  .querySelector("[data-photo-next]")
  .addEventListener("click", () => showPhoto(photoIndex + 1));
lightbox.addEventListener("keydown", (event) => {
  if (
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    photos.length < 2
  )
    return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
lightbox.addEventListener("click", (event) => {
  if (event.target !== lightbox) return;
  const rect = lightbox.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    lightbox.close();
});
lightbox.addEventListener("close", () => {
  if (productSheet.open) expand.focus({ preventScroll: true });
});
