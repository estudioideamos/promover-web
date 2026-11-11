import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
html=html.replace('<div class="section-kicker"><span>Lo que hacemos</span><span>Objetos con identidad.</span></div>','<div class="section-kicker"><span>Lo que hacemos</span></div>');
html=html.replace('<span class="category-title">Promociones</span><span class="category-subtitle">Conservadoras y accesorios.</span>','<span class="category-title">Conservadoras y accesorios</span><span class="category-subtitle">Promociones con utilidad.</span>');
html=html.replace(/(<span class="special-top"><span>Desarrollos especiales<\/span>)<span aria-hidden="true">[\s\S]*?<\/span><\/span>/,'$1</span>');
html=html.replace(/<span class="special-bottom">[\s\S]*?<\/span><\/span>/,'<span class="special-bottom">Hablemos de tu idea<svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span>');
html=html.replace(/(<div class="universe-footer"><p class="reference-note">[\s\S]*?<\/p>)<a class="under-link"[\s\S]*?<\/a>/,'$1');
html=html.replace('Imágenes conceptuales de referencia.<br>Cada propuesta se desarrolla según tu proyecto.','Imágenes conceptuales de referencia. Cada propuesta se desarrolla según tu proyecto.');
html=html.replace('</head>','<link rel="stylesheet" href="categories-refinement.css"></head>');fs.writeFileSync('index.html',html);
