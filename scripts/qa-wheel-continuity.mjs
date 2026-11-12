import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 },
  });
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(async () => {
    scrollTo({ top: 100, behavior: "instant" });
    const samples = [],
      prevented = [];
    let done = false,
      zeroPreserved = false;
    const start = performance.now(),
      initial = scrollY;
    function record(time) {
      samples.push({
        t: time - start,
        y: scrollY,
        h: document.documentElement.scrollHeight,
      });
      if (!done) requestAnimationFrame(record);
    }
    for (const deltaY of [120, 120, 120, 120, 120, 120, 40, 16, 5.5]) {
      const event = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY,
      });
      document.body.dispatchEvent(event);
      prevented.push(event.defaultPrevented);
      if (deltaY === 40) {
        document.body.dispatchEvent(
          new WheelEvent("wheel", {
            bubbles: true,
            cancelable: true,
            deltaY: 0,
          }),
        );
        zeroPreserved =
          document.documentElement.classList.contains("wheel-active");
      }
      if (prevented.length === 1) requestAnimationFrame(record);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    await new Promise((resolve) => setTimeout(resolve, 1800));
    done = true;
    return {
      samples,
      prevented,
      initial,
      end: scrollY,
      active: document.documentElement.classList.contains("wheel-active"),
      zeroPreserved,
    };
  });
  assert.ok(
    result.prevented.every(Boolean),
    "All parts of a wheel gesture, including small tail events, must share the same easing",
  );
  assert.ok(
    result.end > result.initial &&
      result.end - result.initial <= (600 + 61.5) * 0.35152 + 2,
    "Burst travel must stay within the much slower wheel limit",
  );
  assert.equal(result.active, false, "Animation must stop after settling");
  assert.equal(
    result.zeroPreserved,
    true,
    "Zero-delta wheel packets must not interrupt the gesture",
  );
  const deltas = result.samples.slice(1).map((sample, index) => ({
    distance: sample.y - result.samples[index].y,
    time: sample.t - result.samples[index].t,
  }));
  const jumps = deltas.filter((sample) => sample.distance > 15);
  if (jumps.length) console.log(JSON.stringify({ jumps }));
  assert.ok(
    deltas.every((sample) => sample.distance >= 0),
    "A downward gesture must not jump backward",
  );
  assert.ok(
    deltas.every((sample) => sample.distance <= 15),
    "No abrupt per-frame native-scroll jumps",
  );
  assert.ok(
    Math.max(...result.samples.map((s) => s.h)) -
      Math.min(...result.samples.map((s) => s.h)) <=
      2,
    "Page height and scrollbar geometry must stay stable",
  );
  console.log(
    JSON.stringify({
      result: "PASS continuous wheel gesture with mixed deltas",
      frames: result.samples.length,
      travel: result.end - result.initial,
      maxFrameStep: Math.max(...deltas.map((s) => s.distance)),
    }),
  );
  await page.mouse.move(600, 300);
  const smallerStep = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 40);
  await page.waitForFunction((start) => scrollY >= start + 13, smallerStep);
  await page.waitForTimeout(400);
  assert.ok(
    Math.abs((await page.evaluate(() => scrollY)) - smallerStep - 14.0608) <= 1,
    "Lower-resolution wheel settings must also use the same easing",
  );
  const storm = await page.evaluate(async () => {
    window.dispatchEvent(new PointerEvent("pointerdown"));
    const start = scrollY;
    let captured = true;
    for (let i = 0; i < 100; i++) {
      const event = new WheelEvent("wheel", {
        deltaY: 10000,
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(event);
      captured &&= event.defaultPrevented;
    }
    await new Promise((resolve) => setTimeout(resolve, 1800));
    return { distance: scrollY - start, captured };
  });
  assert.ok(
    storm.captured && storm.distance <= 142 && storm.distance > 0,
    "Even extreme OS wheel multipliers must not skip a section",
  );
  console.log(
    `PASS small wheel step ~14px; extreme 100-packet burst limited to ${storm.distance}px`,
  );
  await page.close();
} finally {
  await browser.close();
}
