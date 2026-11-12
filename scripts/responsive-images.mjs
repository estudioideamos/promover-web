import fs from "node:fs";
import sharp from "sharp";
import { createHash } from "node:crypto";
const sizes = {
  hero: "(max-width: 760px) 90vw, 50vw",
  textil: "(max-width: 760px) 88vw, 52vw",
  cuero: "(max-width: 760px) 88vw, 36vw",
  "workshop-refined": "(max-width: 760px) 88vw, 50vw",
  "workshop-detail-refined": "(max-width: 760px) 88vw, 40vw",
};
export async function prepareResponsiveImages(pages) {
  fs.mkdirSync(".cache/images", { recursive: true });
  const prepared = new Map();
  for (const file of pages) {
    let html = fs.readFileSync("dist/" + file, "utf8");
    const images = [
      ...html.matchAll(/<img\b[^>]*src="assets\/([^"/]+)\.webp"[^>]*>/g),
    ];
    for (const [tag, base] of images) {
      if (
        tag.includes('id="dialog-image"') ||
        tag.includes('id="lightbox-image"')
      )
        continue;
      if (base === "ideamos-light") continue;
      if (!prepared.has(base)) {
        const image = sharp(`assets/${base}.webp`),
          metadata = await image.metadata();
        const widths = [
          ...new Set(
            [480, 960, 1440, metadata.width].filter((w) => w <= metadata.width),
          ),
        ].sort((a, b) => a - b);
        const key = createHash("sha256")
          .update(fs.readFileSync(`assets/${base}.webp`))
          .update("avif-q62-e4-v1")
          .digest("hex")
          .slice(0, 16);
        await Promise.all(
          widths.map(async (width) => {
            const cached = `.cache/images/${base}-${key}-${width}.avif`,
              target = `dist/assets/${base}-${width}.avif`;
            if (!fs.existsSync(cached)) {
              if (fs.existsSync(target)) fs.copyFileSync(target, cached);
              else
                await image
                  .clone()
                  .resize({ width, withoutEnlargement: true })
                  .avif({ quality: 62, effort: 4 })
                  .toFile(cached);
            }
            fs.copyFileSync(cached, target);
          }),
        );
        prepared.set(base, { widths, metadata });
      }
      const { widths, metadata } = prepared.get(base),
        size = sizes[base] || "(max-width: 760px) 88vw, 30vw";
      const srcset = widths
        .map((w) => `assets/${base}-${w}.avif ${w}w`)
        .join(", ");
      const img = tag
        .replace(/width="\d+"/, `width="${metadata.width}"`)
        .replace(/height="\d+"/, `height="${metadata.height}"`);
      html = html.replace(
        tag,
        `<picture><source type="image/avif" srcset="${srcset}" sizes="${size}">${img}</picture>`,
      );
      if (base === "hero" && tag.includes("hero-product"))
        html = html.replace(
          "</head>",
          `<link rel="preload" as="image" type="image/avif" href="assets/hero-960.avif" imagesrcset="${srcset}" imagesizes="${size}" fetchpriority="high"></head>`,
        );
    }
    fs.writeFileSync("dist/" + file, html);
  }
}
