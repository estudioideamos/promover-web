import fs from "node:fs";
import path from "node:path";
import { buildPage } from "./bundle-site-styles.mjs";
import { prepareResponsiveImages } from "./responsive-images.mjs";
import sharp from "sharp";

const root = process.cwd(),
  output = path.resolve(root, "dist");
if (
  output !== path.join(root, "dist") ||
  (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink())
)
  throw Error("Unsafe build output");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
const pages = ["index.html", "contacto.html", "gracias.html"];
const scripts = new Set(),
  styles = new Set(),
  assets = new Set();
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/<script src="([^"?]+)(?:\?[^"\s]*)?"/g))
    scripts.add(match[1]);
  for (const match of html.matchAll(
    /<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^":]+\.css)"[^>]*>/g,
  ))
    styles.add(match[1]);
}
const texts = [...pages, ...scripts, ...styles].map((f) =>
  fs.readFileSync(f, "utf8"),
);
for (const text of texts)
  for (const match of text.matchAll(
    /assets\/[a-z\d_./-]+\.(?:svg|webp|jpg|mp4|woff2|txt)/gi,
  ))
    assets.add(match[0]);
assets.add("assets/fonts/OFL.txt");
for (const file of assets) {
  if (!fs.existsSync(file)) throw Error("Missing asset " + file);
  fs.mkdirSync(path.dirname(path.join(output, file)), { recursive: true });
  fs.copyFileSync(file, path.join(output, file));
}
for (const file of scripts) fs.copyFileSync(file, path.join(output, file));
for (const file of assets) {
  if (!/^assets\/clients\/\d+\.webp$/.test(file)) continue;
  await sharp(file)
    .resize({
      width: 512,
      height: 192,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ lossless: true, effort: 6 })
    .toFile(path.join(output, file));
}
for (const file of ["robots.txt", "sitemap.xml", "llms.txt"])
  fs.copyFileSync(file, path.join(output, file));
fs.writeFileSync(path.join(output, ".nojekyll"), "");
for (const file of pages) await buildPage(file, [...scripts]);
await prepareResponsiveImages(pages);
for (const file of pages) {
  const target = path.join(output, file);
  let html = fs.readFileSync(target, "utf8");
  html = html.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (_, open, json, close) => open + JSON.stringify(JSON.parse(json)) + close,
  );
  html = html.replace(/\r?\n[ \t]*/g, " ").replace(/>[ \t]+</g, "> <");
  fs.writeFileSync(target, html);
}
const files = fs
  .readdirSync(output, { recursive: true })
  .filter((f) => fs.statSync(path.join(output, f)).isFile());
const bytes = files.reduce(
  (sum, f) => sum + fs.statSync(path.join(output, f)).size,
  0,
);
console.log(
  `Built ${pages.length} pages, ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB. Only referenced assets are shipped.`,
);
