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
            actionGap:
              button.top -
              [...dialog.querySelector(".dialog-copy").children]
                .filter(
                  (el) =>
                    el !== dialog.querySelector("#dialog-cta") &&
                    getComputedStyle(el).display !== "none" &&
                    getComputedStyle(el).position !== "absolute",
                )
                .at(-1)
                .getBoundingClientRect().bottom,
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
        geometry.actionGap <= 24,
        `${key}: excessive space before the CTA`,
      );
      assert.equal(
        await page.locator("#dialog-cta").innerText(),
        "Consultá por esta línea",
      );
      assert.ok(
        (await page.locator("#dialog-cta").getAttribute("href")).includes(
          "5491167172341?text=",
        ),
      );
      const media = await page.locator(".product-visual").evaluate((el) => {
        const image = el.querySelector("img").getBoundingClientRect();
        const pager = el.querySelector("nav").getBoundingClientRect();
        return { imageBottom: image.bottom, pagerTop: pager.top };
      });
      assert.ok(
        media.imageBottom <= media.pagerTop + 1,
        `${key}: navigation overlaps the photo`,
      );
      if (
        key === "promociones" ||
        key === "sustentable" ||
        key === "boligrafos"
      )
        await page.screenshot({
          path: `qa/product-dialog-${key}-${width}-${height}.png`,
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
