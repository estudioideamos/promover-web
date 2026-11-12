import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 },
  });
  await page.goto("http://127.0.0.1:4173/");
  await page.locator("[data-category=boligrafos]").click();
  const next = page.locator("[data-product-next]");
  await next.hover();
  assert.equal(
    await next.locator(".pager-preview").innerText(),
    "Conservadoras y accesorios",
  );
  assert.equal(
    await next
      .locator(".pager-preview")
      .evaluate((el) => getComputedStyle(el).visibility),
    "visible",
  );
  assert.ok(
    await next.evaluate((el) => {
      el.click();
      return document.querySelector(".dialog-copy").getAnimations().length > 0;
    }),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () =>
      document
        .querySelector("#category-dialog")
        .getAnimations({ subtree: true }).length === 0,
  );
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .locator(".dialog-copy")
      .evaluate((el) => el.getAnimations().length),
    0,
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator("#category-dialog")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
    0,
  );
  console.log(
    "PASS adjacent preview, transition, live reduced-motion preference and cancellation on close",
  );
} finally {
  await browser.close();
}
