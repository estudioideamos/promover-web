import fs from "node:fs";
import { createHash } from "node:crypto";
import { transform as cssTransform } from "lightningcss";
import { transform as jsTransform } from "esbuild";
import { PurgeCSS } from "purgecss";

export async function buildPage(file, scripts) {
  let html = fs.readFileSync(file, "utf8");
  const links = [
    ...html.matchAll(
      /<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^":]+\.css)"[^>]*>/g,
    ),
  ];
  const css = links.map((m) => fs.readFileSync(m[1], "utf8")).join("\n");
  if (!links.length || css.length < 1000)
    throw Error("Stylesheets were not discovered for " + file);
  const [purged] = await new PurgeCSS().purge({
    content: [
      { raw: html, extension: "html" },
      ...scripts.map((s) => ({
        raw: fs.readFileSync(s, "utf8"),
        extension: "js",
      })),
    ],
    css: [{ raw: css }],
    safelist: {
      standard: [
        "open",
        "scrolled",
        "shown",
        "compact",
        "visible",
        "ready",
        "locked",
        "menu-open",
        "reveal-ready",
        "logo-group",
        "client-logo",
      ],
    },
    fontFace: false,
    keyframes: false,
    variables: false,
  });
  const result = cssTransform({
    filename: "site.css",
    code: Buffer.from(purged.css),
    minify: true,
    targets: { chrome: 109 << 16, safari: 16 << 16, firefox: 115 << 16 },
  }).code;
  const hash = createHash("sha256").update(result).digest("hex").slice(0, 12),
    name = file.replace(".html", "") + "-" + hash + ".css";
  fs.writeFileSync("dist/" + name, result);
  let first = true;
  html = html.replace(
    /<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^":]+\.css)"[^>]*>/g,
    () => {
      if (!first) return "";
      first = false;
      return `<link rel="stylesheet" href="${name}">`;
    },
  );
  for (const script of [
    ...html.matchAll(/<script src="([a-z-]+\.js)" defer><\/script>/g),
  ].map((m) => m[1])) {
    const code = (
      await jsTransform(fs.readFileSync(script, "utf8"), {
        minify: true,
        target: "es2020",
        legalComments: "none",
      })
    ).code;
    const version = createHash("sha256")
      .update(code)
      .digest("hex")
      .slice(0, 12);
    fs.writeFileSync("dist/" + script, code);
    html = html.replace(`src="${script}"`, `src="${script}?v=${version}"`);
  }
  fs.writeFileSync("dist/" + file, html);
  console.log(
    `${file}: CSS ${(Buffer.byteLength(css) / 1024).toFixed(1)} → ${(result.length / 1024).toFixed(1)} KiB`,
  );
}
