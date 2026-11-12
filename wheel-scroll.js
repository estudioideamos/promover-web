/* Ease discrete mouse-wheel steps without taking over native gestures or controls. */
(() => {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0,
    target = 0,
    position = 0,
    velocity = 0,
    lastWritten = 0,
    lastTime = 0,
    wheelUntil = 0;
  const limit = () =>
    Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const clamp = (value) => Math.max(0, Math.min(limit(), value));
  function cancel() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    velocity = 0;
    wheelUntil = 0;
    document.documentElement.classList.remove("wheel-active");
  }
  function tick(time) {
    if (Math.abs(scrollY - lastWritten) > 3) {
      cancel();
      return;
    }
    // Do not catch up with a large jump after a delayed frame.
    const elapsed = (lastTime ? Math.min(20, time - lastTime) : 16) / 1000;
    lastTime = time;
    target = clamp(target);
    // Exact critically damped spring: preserve velocity as new wheel steps arrive.
    const frequency = 13.5;
    const displacement = position - target;
    const momentum = velocity + frequency * displacement;
    const decay = Math.exp(-frequency * elapsed);
    const springPosition = target + (displacement + momentum * elapsed) * decay;
    const maxStep = 900 * elapsed;
    const nextPosition =
      position +
      Math.max(-maxStep, Math.min(maxStep, springPosition - position));
    position = clamp(nextPosition);
    velocity = Math.max(
      -900,
      Math.min(900, (velocity - frequency * momentum * elapsed) * decay),
    );
    if (position !== nextPosition) velocity = 0;
    const finished =
      Math.abs(target - position) < 0.1 && Math.abs(velocity) < 1;
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
      if (!event.deltaY && !event.deltaX) return;
      const discrete =
        event.deltaMode !== 0 ||
        (Number.isInteger(event.deltaY) && Math.abs(event.deltaY) >= 24);
      const wheelContinuation = event.timeStamp < wheelUntil;
      if (
        event.defaultPrevented ||
        !event.cancelable ||
        !finePointer.matches ||
        reduced.matches ||
        (!discrete && !wheelContinuation) ||
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
        velocity = 0;
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
      wheelUntil = event.timeStamp + 240;
      target = next;
      if (!frame) {
        document.documentElement.classList.add("wheel-active");
        frame = requestAnimationFrame(tick);
      }
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
