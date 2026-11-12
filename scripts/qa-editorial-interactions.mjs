import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [1366, 768],
    [390, 844],
    [320, 640],
    [844, 390],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4173/");
    for (const key of ["textil", "promociones", "hogar"]) {
      await page.locator(`[data-category=${key}]`).click();
      await page.locator(".product-expand").click();
      const box = page.locator("#product-lightbox");
      await page.locator("#lightbox-image").evaluate((img) => img.decode());
      assert.ok(await box.isVisible());
      assert.ok(
        await box.evaluate(
          (el) =>
            el.scrollHeight <= el.clientHeight + 2 &&
            el.scrollWidth <= el.clientWidth + 2,
        ),
        "Lightbox must fit the viewport",
      );
      if (key === "textil")
        assert.equal(await box.locator("nav").isVisible(), false);
      else {
        const first = await page.locator("#lightbox-image").getAttribute("src");
        await page.locator("[data-photo-next]").click();
        await page.locator("#lightbox-image").evaluate((img) => img.decode());
        assert.notEqual(
          await page.locator("#lightbox-image").getAttribute("src"),
          first,
        );
        await page.keyboard.press("ArrowLeft");
        assert.equal(
          await page.locator("#lightbox-image").getAttribute("src"),
          first,
        );
      }
      if (key === "hogar")
        await page.screenshot({ path: `qa/gallery-${width}.png` });
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .locator(".product-expand")
          .evaluate((el) => el === document.activeElement),
        true,
      );
      assert.ok(await page.locator("#category-dialog").isVisible());
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .locator(`[data-category=${key}]`)
          .evaluate((el) => el === document.activeElement),
        true,
      );
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}x${height}: image expansion, gallery, keyboard, stacked dialogs, focus and viewport fit`,
    );
  }
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
  });
  await page.goto("http://127.0.0.1:4173/");
  assert.ok(
    await page.evaluate(() => CSS.supports("animation-timeline", "view()")),
  );
  assert.ok(
    await page
      .locator(".process-photo img")
      .evaluate((el) =>
        getComputedStyle(el).animationName.includes("editorial-photo"),
      ),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("editorial-motion"),
  );
  assert.equal(
    await page
      .locator(".process-photo img")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.goto("http://127.0.0.1:4173/contacto.html");
  let posts = 0;
  await page.route("https://formsubmit.co/**", (route) => {
    posts++;
    return route.fulfill({
      contentType: "text/html",
      body: "<h1>QA: intercepted submission</h1>",
    });
  });
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  assert.equal(await page.locator("form").getAttribute("aria-busy"), null);
  await page.getByLabel("Tu nombre").fill("Control de calidad");
  await page.getByLabel("Email *", { exact: true }).fill("qa@example.com");
  await page
    .getByLabel("Tu mensaje")
    .fill("Prueba interceptada de animación y envío.");
  await page.locator("[name=consentimiento]").check();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const state = await page.locator("form").evaluate((el) => {
    el.requestSubmit();
    return {
      busy: el.getAttribute("aria-busy"),
      sending: el.classList.contains("is-sending"),
      status: el.querySelector("#form-status").textContent,
    };
  });
  assert.equal(state.busy, "true");
  assert.equal(state.sending, true);
  assert.ok(state.status.includes("Preparando"));
  await page.waitForURL("https://formsubmit.co/**");
  assert.equal(posts, 1);
  await page.goto("http://127.0.0.1:4173/gracias.html");
  assert.ok(await page.locator(".confirmation-mark").isVisible());
  assert.ok(
    (await page.locator("main").innerText()).includes(
      "Tu consulta fue enviada",
    ),
  );
  await page.screenshot({ path: "qa/confirmation-brand.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".confirmation-mark img")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.close();
  console.log(
    "PASS native scroll timeline, reduced motion, native form validation, branded sending state and confirmation; no real mail sent",
  );
} finally {
  await browser.close();
}
