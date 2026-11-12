/* Ease discrete mouse-wheel steps without taking over native gestures or controls. */
(() => {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0,
    target = 0,
    position = 0,
    lastWritten = 0,
    lastTime = 0;
  const limit = () =>
    Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const clamp = (value) => Math.max(0, Math.min(limit(), value));
  function cancel() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }
  function tick(time) {
    if (Math.abs(scrollY - lastWritten) > 3) {
      cancel();
      return;
    }
    const elapsed = lastTime ? Math.min(32, time - lastTime) : 16;
    lastTime = time;
    target = clamp(target);
    position = clamp(
      position + (target - position) * (1 - Math.exp(-elapsed / 105)),
    );
    const finished = Math.abs(target - position) < 0.5;
    if (finished) position = target;
    scrollTo({ top: position, behavior: "instant" });
    lastWritten = scrollY;
    if (finished) cancel();
    else frame = requestAnimationFrame(tick);
  }
  function hasNativeScroller(event) {
    for (const node of event.composedPath()) {
      if (
        !(node instanceof Element) ||
        node === document.body ||
        node === document.documentElement
      )
        continue;
      if (
        node.matches(
          'dialog, textarea, input, select, [contenteditable]:not([contenteditable="false"]), [data-native-scroll]',
        )
      )
        return true;
      if (
        node.scrollHeight > node.clientHeight + 1 &&
        /auto|scroll/.test(getComputedStyle(node).overflowY)
      )
        return true;
    }
    return false;
  }
  addEventListener(
    "wheel",
    (event) => {
      const discrete =
        event.deltaMode !== 0 ||
        (Number.isInteger(event.deltaY) && Math.abs(event.deltaY) >= 80);
      if (
        event.defaultPrevented ||
        !event.cancelable ||
        !finePointer.matches ||
        reduced.matches ||
        !discrete ||
        !event.deltaY ||
        event.deltaX ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        document.body.matches(".locked, .menu-open") ||
        document.querySelector("dialog[open]") ||
        hasNativeScroller(event)
      ) {
        cancel();
        return;
      }
      if (!frame) {
        position = scrollY;
        target = scrollY;
        lastWritten = scrollY;
      }
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      const distance =
        Math.max(-300, Math.min(300, event.deltaY * unit)) * 0.55;
      const next = clamp(target + distance);
      if (next === target) {
        if (frame) event.preventDefault();
        return;
      }
      event.preventDefault();
      target = next;
      if (!frame) frame = requestAnimationFrame(tick);
    },
    { passive: false },
  );
  for (const type of [
    "keydown",
    "pointerdown",
    "touchstart",
    "focusin",
    "hashchange",
    "pagehide",
    "resize",
  ])
    addEventListener(type, cancel, { passive: true });
  document.addEventListener("visibilitychange", cancel);
  reduced.addEventListener("change", cancel);
  finePointer.addEventListener("change", cancel);
})();
