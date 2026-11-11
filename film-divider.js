const separator = document.querySelector(".film-divider");
if (separator) {
  const video = separator.querySelector("video"),
    button = separator.querySelector("button"),
    motion = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false,
    pausedByUser = false,
    loaded = false;
  const load = () => {
    if (!loaded) {
      video.src = video.dataset.src;
      video.load();
      loaded = true;
    }
  };
  const play = () => {
    load();
    video.play().catch(() => {
      button.hidden = false;
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", "Reproducir película de productos");
    });
  };
  const sync = () => {
    if (
      visible &&
      !document.hidden &&
      !pausedByUser &&
      !motion.matches &&
      !navigator.connection?.saveData
    )
      play();
    else video.pause();
  };
  video.muted = true;
  if (motion.matches || navigator.connection?.saveData) {
    button.hidden = false;
    button.setAttribute("aria-pressed", "true");
  }
  video.addEventListener("playing", () => {
    video.classList.add("ready");
    button.hidden = false;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Pausar película de productos");
  });
  video.addEventListener("pause", () => {
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Reproducir película de productos");
  });
  video.addEventListener("error", () => {
    video.classList.remove("ready");
    button.hidden = true;
  });
  button.addEventListener("click", () => {
    pausedByUser = !video.paused;
    if (pausedByUser) video.pause();
    else play();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0.12 },
  ).observe(separator);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", () => {
    if (motion.matches) {
      video.classList.remove("ready");
      button.hidden = false;
    }
    sync();
  });
}
