# Promover Marketing

Sitio institucional en español de Argentina. HTML semántico, CSS y JavaScript sin dependencias de ejecución. Publicación: https://estudioideamos.github.io/promover-web/.

## Desarrollo y validación

```sh
npm ci
npm run build
npm run dev
npm test
npm run test:quality
npm run test:contact
npm run test:menu
npm run audit:security
```

La vista local usa http://127.0.0.1:4173. Las pruebas de navegador requieren Chrome instalado. Las pruebas de formulario interceptan el envío y no mandan mensajes reales.

## Compilación

`scripts/build.mjs` prepara `dist/` desde cero y copia únicamente los recursos referenciados. `bundle-site-styles.mjs` elimina selectores sin uso por página, compacta CSS y JavaScript y agrega versiones basadas en el contenido. `responsive-images.mjs` produce variantes AVIF con WebP de respaldo; conserva las proporciones y nunca amplía los originales. La caché `.cache/images/` evita repetir conversiones sin cambios. Las fuentes Montserrat están alojadas localmente con su licencia SIL Open Font License.

El video se carga al entrar en pantalla, se detiene fuera de ella y respeta ahorro de datos y movimiento reducido. La portada mantiene una imagen estática. Los logos de clientes se entregan con transparencia, compresión sin pérdida y resolución suficiente para el tamaño de presentación. Los SVG originales de marca y los iconos oficiales no se redibujan.

## Contacto y protección antispam

El correo público y destinatario del formulario es **info@promovermarketing.com.ar**. El sitio usa FormSubmit con CAPTCHA activado, campo trampa, validación nativa, consentimiento obligatorio y control de envíos duplicados en la sesión. La protección de sesión es complementaria; la comprobación de CAPTCHA ocurre en el proveedor.

**Activación pendiente del destinatario:** la primera consulta real genera el correo de activación de FormSubmit a la nueva dirección. El titular debe confirmarlo para recibir los mensajes. No se almacenan credenciales SMTP en el repositorio.

La política CSP restringe scripts, conexiones y recursos al propio sitio y habilita únicamente FormSubmit para el formulario. GitHub Pages administra las cabeceras HTTP: la CSP disponible aquí se aplica mediante metaetiqueta, sin prometer controles de servidor que Pages no permite configurar.

## SEO y lectura automática

Títulos, descripciones, canonical, Open Graph, tarjetas sociales, JSON-LD de Organization/WebSite/WebPage y ContactPage. `sitemap.xml` incluye inicio y contacto; la página de agradecimiento tiene `noindex`. Los contenidos y los logos de clientes existen en HTML, sin depender de JavaScript para leerse.

`llms.txt` ofrece un resumen factual y enlaces oficiales; es una ayuda de descubrimiento y no garantiza inclusión ni posiciones en respuestas de IA. En Pages bajo `/promover-web/`, el archivo `robots.txt` del proyecto no sustituye al del dominio raíz; las directivas por página siguen presentes en HTML.

## Publicación

`.github/workflows/publish.yml` instala dependencias con `npm ci`, compila y publica el artefacto oficial de Pages. Las ejecuciones obsoletas se reemplazan por la última versión y cada trabajo tiene un límite de diez minutos. Compilación y despliegue están separados para diagnosticar fallas. La configuración conserva la URL existente.

## Recursos e identidad

La palabra PROMOVER y el logo horizontal reutilizan los contornos del SVG original. WhatsApp e Instagram conservan sus trazados oficiales. El crédito usa el logo original de Ideamos y enlaza íntegramente a https://ideamos.com.ar/.

La imagen social `assets/social-promover.jpg` mide 1200 × 630 px, sin texto ni logos inventados, con márgenes amplios para recortes de redes. Se creó con la herramienta integrada de generación de imágenes. Prompt: composición editorial cinematográfica de bolso textil, chomba verde, termo oscuro, bolígrafo metálico y cuaderno de cuero, sobre piedra cálida; luces laterales, fondo verde oscuro y naranja; productos en el 70 % central y al menos 12 % de margen, sin textos ni marcas inventadas.

Las composiciones de producto son recursos visuales de presentación. Las escenas de conservadora y asado toman como referencia los productos del Instagram oficial. Las imágenes del taller provienen del material compartido para el proyecto.
