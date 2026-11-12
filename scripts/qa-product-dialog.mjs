import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [1366, 600],
    [1440, 900],
    [1024, 600],
    [768, 1024],
    [390, 844],
    [360, 640],
    [320, 640],
    [844, 390],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/");
    await page.evaluate(() => document.fonts.ready);
    for (const key of [
      "textil",
      "marroquineria",
      "especiales",
      "boligrafos",
      "promociones",
      "hogar",
      "sustentable",
    ]) {
      const trigger = page.locator(`[data-category="${key}"]`);
      await trigger.click();
      await page.locator("#dialog-image").evaluate((img) => img.decode());
      const geometry = await page
        .locator("#category-dialog")
        .evaluate((dialog) => {
          const button = dialog
            .querySelector("#dialog-cta")
            .getBoundingClientRect();
          const rect = dialog.getBoundingClientRect();
          return {
            overflow: dialog.scrollHeight - dialog.clientHeight,
            horizontal: dialog.scrollWidth - dialog.clientWidth,
            bottom: button.bottom,
            top: rect.top,
            end: rect.bottom,
          };
        });
      assert.ok(
        geometry.overflow <= 2,
        `${width}x${height} ${key}: vertical overflow ${JSON.stringify(geometry)}`,
      );
      assert.ok(
        geometry.horizontal <= 2,
        `${width}x${height} ${key}: horizontal overflow`,
      );
      assert.ok(
        geometry.bottom <= height && geometry.top >= 0,
        `${key}: CTA outside viewport`,
      );
      assert.ok(
        (await page.locator("#dialog-cta").getAttribute("href")).includes(
          "5491167172341?text=",
        ),
      );
      if (key === "promociones")
        await page.screenshot({
          path: `qa/product-dialog-${width}-${height}.png`,
        });
      await page.keyboard.press("Escape");
      await page.waitForFunction(
        () => !document.body.classList.contains("locked"),
      );
      assert.equal(
        await trigger.evaluate((el) => el === document.activeElement),
        true,
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${width}x${height}: all 7 sheets fit, CTA visible, Escape restores focus`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
