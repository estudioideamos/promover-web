import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [1366, 768],
    [1366, 600],
    [1024, 768],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto("http://127.0.0.1:4173/contacto.html");
    await page.evaluate(() => document.fonts.ready);
    const textarea = page.locator("textarea");
    for (const direction of [1, -1]) {
      await textarea.scrollIntoViewIfNeeded();
      const box = await textarea.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      const start = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, 600 * direction);
      await page.waitForTimeout(1100);
      const distance = (await page.evaluate(() => scrollY)) - start;
      assert.ok(
        Math.abs(distance - 59.40688 * direction) <= 2,
        `${width} empty message: ${distance}px`,
      );
    }
    await textarea.fill(
      Array(80)
        .fill(
          "Línea de un mensaje extenso para comprobar el desplazamiento interno.",
        )
        .join("\n"),
    );
    await textarea.scrollIntoViewIfNeeded();
    await textarea.evaluate((el) => (el.scrollTop = 0));
    const box = await textarea.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(350);
    assert.ok(
      await textarea.evaluate((el) => el.scrollTop > 0),
      "Long messages must scroll internally",
    );
    assert.equal(
      await page.evaluate(() => scrollY),
      before,
      "Internal message scrolling must not move the page",
    );
    await textarea.evaluate((el) => (el.scrollTop = el.scrollHeight));
    const start = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1100);
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - start - 59.40688) <= 2,
      "Message bottom must hand off to the same smooth page speed",
    );
    await textarea.evaluate((el) => (el.scrollTop = 0));
    const top = await page.evaluate(() => scrollY);
    // Reposition over the field after the document moved.
    const current = await textarea.boundingBox();
    await page.mouse.move(
      current.x + current.width / 2,
      current.y + current.height / 2,
    );
    await page.mouse.wheel(0, -600);
    await page.waitForTimeout(1100);
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - top + 59.40688) <= 2,
      "Message top must hand off upward without acceleration",
    );
    assert.equal(
      await page
        .locator(".contact-page-aside")
        .evaluate((el) => getComputedStyle(el).position),
      "sticky",
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.close();
    console.log(
      `PASS ${width}x${height}: empty message, long-message internal scroll and both boundary handoffs stay consistent`,
    );
  }
} finally {
  await browser.close();
}
