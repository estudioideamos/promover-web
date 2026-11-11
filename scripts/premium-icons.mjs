import fs from 'node:fs';
const glyphs=[
 ['factory','<path class="icon-wash" d="M3 20V10l6 3V9l6 4V4h4v16Z"/><path d="M3 20V10l6 3V9l6 4M15 11V4h4v16H3M7 17h1m4 0h1m4 0h1"/>'],
 ['ruler','<path class="icon-wash" d="m4 16 12-12 4 4L8 20Z"/><path d="m4 16 12-12 4 4L8 20Zm9-9 2 2m-5 1 2 2m-5 1 2 2M4 16l4 4"/>'],
 ['layers','<path class="icon-wash" d="m12 3 9 5-9 5-9-5Z"/><path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>'],
 ['conversation','<path class="icon-wash" d="M4 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H3V6a2 2 0 0 1 1-2Z"/><path d="M9 17H5l-2 3V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3M7 8h9M7 12h6"/><circle cx="18" cy="20" r="1" class="icon-dot"/>'],
 ['design','<path class="icon-wash" d="m5 11 11-7 4 4-7 11-9 2Z"/><path d="m5 11 11-7 4 4-7 11-9 2Zm0 9 6-6m5-10 4 4"/><circle cx="12" cy="13" r="2"/>'],
 ['delivery','<path class="icon-wash" d="m12 3 9 5v10l-9 5-9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v9M8 5l9 5M21 12V8l-9-5-9 5v10l9 5 3-2m2-4 2 2 4-5"/>']
];
let html=fs.readFileSync('index.html','utf8');let i=0;
html=html.replace(/<svg viewBox="0 0 32 32"[^>]*>[\s\S]*?<\/svg>/g,()=>{const [name,paths]=glyphs[i++];return `<svg class="premium-icon icon-${name}" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">${paths}</svg>`});
if(i!==6)throw Error('Unexpected icon count '+i);
html=html.replace('<button class="dialog-close" aria-label="Cerrar categoría">✕</button>','<button class="dialog-close" aria-label="Cerrar categoría"><svg class="premium-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>');
fs.writeFileSync('index.html',html);
for(const file of ['index.html','contacto.html','gracias.html']){let page=fs.readFileSync(file,'utf8');page=page.replace('</head>','<link rel="stylesheet" href="premium-icons.css"></head>');fs.writeFileSync(file,page)}
