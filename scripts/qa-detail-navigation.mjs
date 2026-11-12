import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import sharp from "sharp";

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [1366, 600],
    [390, 844],
    [320, 640],
    [844, 390],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    await page.goto("http://127.0.0.1:4173/");
    await page.evaluate(() => document.fonts.ready);
    const titles = [
      "Textil",
      "Marroquinería",
      "Bolígrafos",
      "Conservadoras y accesorios",
      "Hogar y tiempo libre",
      "Sustentable",
      "Desarrollos especiales",
    ];
    await page.locator("[data-category=textil]").click();
    const next = page.locator("[data-product-next]");
    for (let index = 1; index <= 7; index++) {
      await next.click();
      const title = titles[index % 7];
      assert.equal(await page.locator("#dialog-title").innerText(), title);
      assert.equal(
        await page.locator("#dialog-announcement").innerText(),
        title,
      );
      assert.ok(
        decodeURIComponent(
          await page.locator("#dialog-cta").getAttribute("href"),
        ).includes(title),
      );
      const source = page.locator("#dialog-source");
      assert.equal(await source.isVisible(), [3, 4].includes(index % 7));
      const layout = await page
        .locator("#category-dialog")
        .evaluate((el) => ({
          overflow: el.scrollHeight - el.clientHeight,
          x: el.scrollWidth - el.clientWidth,
        }));
      assert.ok(
        layout.overflow <= 2 && layout.x <= 2,
        `${width} ${title} overflows`,
      );
      assert.equal(
        await next.evaluate((el) => el === document.activeElement),
        true,
      );
    }
    await page.locator("[data-product-previous]").click();
    assert.equal(await page.locator("#dialog-title").innerText(), titles[6]);
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#dialog-title").innerText(), titles[0]);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.locator("#dialog-title").innerText(), titles[6]);
    await page.locator("#dialog-image").evaluate((img) => img.decode());
    await page.screenshot({ path: `qa/product-navigation-${width}.png` });
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => !document.querySelector("#category-dialog").open,
    );
    assert.equal(
      await page
        .locator("[data-category=textil]")
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await page.close();
    console.log(
      `PASS ${width}x${height}: both directions, loop, keyboard, focus, updated links, no overflow`,
    );
  }
  for (const [width, height] of [
    [1366, 600],
    [1440, 900],
    [768, 1024],
    [390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    await page.goto("http://127.0.0.1:4173/contacto.html");
    await page.evaluate(() => document.fonts.ready);
    const aside = page.locator(".contact-page-aside");
    if (width > 760) {
      await page.waitForFunction(() =>
        document
          .querySelector(".contact-page-aside")
          .style.getPropertyValue("--contact-aside-top"),
      );
      const geometry = await aside.evaluate((el) => ({
        start: el.getBoundingClientRect().top + scrollY,
        top: parseFloat(getComputedStyle(el).top),
        position: getComputedStyle(el).position,
      }));
      assert.equal(geometry.position, "sticky");
      await page.evaluate(
        (y) => {
          document.documentElement.style.scrollBehavior = "auto";
          scrollTo(0, y);
        },
        geometry.start - geometry.top + 25,
      );
      const first = await aside.boundingBox();
      const field = (await page.locator("#contact-form").count())
        ? page.locator("#contact-form")
        : page.locator(".contact-form-panel");
      const formFirst = await field.boundingBox();
      await page.evaluate(() => scrollBy(0, 60));
      const second = await aside.boundingBox();
      const formSecond = await field.boundingBox();
      assert.ok(
        Math.abs(first.y - second.y) < 2,
        `${width}: sidebar must remain pinned`,
      );
      assert.ok(
        formFirst.y - formSecond.y > 50,
        `${width}: form must keep moving`,
      );
    } else
      assert.notEqual(
        await aside.evaluate((el) => getComputedStyle(el).position),
        "sticky",
      );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.screenshot({ path: `qa/contact-sticky-${width}.png` });
    await page
      .locator(".footer")
      .screenshot({ path: `qa/footer-balanced-${width}.png` });
    await page.close();
    console.log(
      `PASS ${width}x${height}: responsive contact scroll and no page overflow`,
    );
  }
  const original = await fs.readFile("assets/brand-symbol.svg", "utf8");
  const favicon = await fs.readFile("assets/favicon.svg", "utf8");
  for (const path of original.matchAll(/d="([^"]+)"/g))
    assert.ok(
      favicon.includes(path[1]),
      "Favicon must preserve original brand paths",
    );
  assert.ok(!favicon.includes("<text"));
  await sharp("assets/favicon.svg")
    .resize(256, 256)
    .png()
    .toFile("qa/favicon-preview.png");
  console.log("PASS favicon: original vector paths, no invented typography");
} finally {
  await browser.close();
}
