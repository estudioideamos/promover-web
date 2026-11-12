import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const file of ["index.html", "contacto.html", "gracias.html"]) {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 768 },
    });
    await page.goto(`http://127.0.0.1:4173/${file}`);
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      scrollTo({ top: 100, behavior: "instant" });
    });
    await page.mouse.move(600, 300);
    const start = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 120);
    await page.waitForFunction((y) => scrollY >= y + 64, start);
    await page.waitForTimeout(180);
    const travel = await page.evaluate((y) => scrollY - y, start);
    assert.ok(
      travel >= 64 && travel <= 68,
      `${file}: expected ~66px, got ${travel}`,
    );
    const firstFrame = await page.evaluate(() => {
      const y = scrollY;
      document.body.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          deltaY: 120,
        }),
      );
      return new Promise((resolve) =>
        requestAnimationFrame(() => resolve(scrollY - y)),
      );
    });
    assert.ok(
      firstFrame > 0 && firstFrame < 50,
      "Wheel travel must ease over frames",
    );
    const native = await page.evaluate(() => {
      window.dispatchEvent(new PointerEvent("pointerdown"));
      const result = [];
      for (const init of [
        { deltaY: 6.5 },
        { deltaY: 120, ctrlKey: true },
        { deltaY: 120, deltaX: 10 },
        { deltaY: 120, shiftKey: true },
      ]) {
        const event = new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          ...init,
        });
        document.body.dispatchEvent(event);
        result.push(event.defaultPrevented);
      }
      return result;
    });
    assert.deepEqual(native, [false, false, false, false]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page.evaluate(() => {
        const event = new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          deltaY: 120,
        });
        document.body.dispatchEvent(event);
        return event.defaultPrevented;
      }),
      false,
    );
    await page.close();
    console.log(
      `PASS ${file}: trusted wheel slows to 55% travel; precision, zoom, horizontal and reduced-motion events remain native`,
    );
  }
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 },
  });
  await page.goto("http://127.0.0.1:4173/contacto.html");
  const textarea = page.locator("textarea");
  assert.equal(
    await textarea.evaluate((el) => {
      const e = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: 120,
      });
      el.dispatchEvent(e);
      return e.defaultPrevented;
    }),
    false,
  );
  await page.goto("http://127.0.0.1:4173/");
  await page.locator("[data-category=textil]").click();
  assert.equal(
    await page.locator("#category-dialog").evaluate((el) => {
      const e = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: 120,
      });
      el.dispatchEvent(e);
      return e.defaultPrevented;
    }),
    false,
  );
  await page.keyboard.press("Escape");
  await page.evaluate(() => scrollTo({ top: 100, behavior: "instant" }));
  await page.mouse.move(600, 300);
  await page.mouse.wheel(0, 120);
  await page.mouse.click(600, 300);
  const canceled = await page.evaluate(() => scrollY);
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(() => scrollY), canceled);
  await page.close();
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto("http://127.0.0.1:4173/");
  assert.equal(
    await mobile.evaluate(() => {
      const e = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: 120,
      });
      document.body.dispatchEvent(e);
      return e.defaultPrevented;
    }),
    false,
  );
  await mobile.close();
  console.log(
    "PASS native textarea, modal and mobile behavior; pointer interaction cancels easing",
  );
} finally {
  await browser.close();
}
