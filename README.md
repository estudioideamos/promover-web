# Promover — demo institucional

Sitio estático editorial en español para Promover Marketing. Fabricación propia desde 1996, siete categorías fotográficas, fichas accesibles, WhatsApp contextual, historia, misión, valores y contacto. Portada de alto contraste, composiciones de producto y fabricación, y carrusel continuo con los 23 logos originales de clientes.

## Desarrollo

`npm ci`, `npm run build`, `npm run dev` (http://127.0.0.1:4173).

`npm test` verifica vistas de escritorio y móvil, categorías, navegación y enlaces de contacto con Playwright (requiere Chrome instalado). `node scripts/qa-motion.mjs` comprueba la visibilidad del presupuesto en 1366 × 606 px y el movimiento, loop, pausa y reanudación del carrusel. Respeta la preferencia de movimiento reducido; en ese caso, las marcas se recorren con scroll horizontal.

## Contenido y material

Contenido institucional y contactos basados en el correo de Julieta Jodar. Logo vectorial y logos de clientes tomados de la carpeta compartida del proyecto. Foto del proceso extraída de la referencia visual suministrada. Ocho imágenes de producto generadas con Magnific se presentan como ilustrativas, no como catálogo real. Costo acumulado: 520 créditos (260 iniciales y 260 del rediseño). No se publican credenciales ni el correo completo.

La demo no incorpora comercio electrónico ni integra cuentas de Instagram. El proceso de fabricación abre el reel original. GitHub Actions publica `dist/` en GitHub Pages al actualizar `main`.

El logo horizontal y la palabra PROMOVER del footer reutilizan los ocho contornos de letras del SVG original de Promover, sin sustituirlos por una tipografía aproximada. Los íconos de Instagram y WhatsApp proceden de Simple Icons (`simple-icons/simple-icons`, archivos `icons/instagram.svg` y `icons/whatsapp.svg`); sus trazados se conservan intactos. El logo del crédito de Ideamos proviene de `https://ideamos.com.ar/logos/ideamos-light.webp`. La firma completa enlaza a `https://ideamos.com.ar/`.

La composición editorial usa una portada clara, siete categorías fotográficas en grilla asimétrica, dos detalles de fabricación extraídos de la referencia proporcionada, un marquee de marca naranja y una sección de clientes de alto contraste. El footer conserva su composición compacta. Los nuevos encuadres reutilizan materiales existentes, sin generaciones adicionales.
