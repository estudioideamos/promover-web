import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
html=html.replace('<div class="hero-art-title">Hecho para<br><em>llevar tu marca.</em></div>','');
html=html.replace('<span class="category-title">Promociones</span><span class="category-subtitle">El momento de tu marca.</span>','<span class="category-title">Promociones</span><span class="category-subtitle">Conservadoras y accesorios.</span>');
html=html.replace('<div class="year-card"><span>Desde</span><strong>1996</strong><span>Haciendo que las ideas pasen.</span></div>','');
const heritage='<div class="manufacture-heritage"><strong>1996</strong><span><span>Desde Buenos Aires.</span>Con ideas y con oficio.</span></div>';
html=html.replace('<a class="film-link"',heritage+'<a class="film-link"');
html=html.replace(/(<a class="contact-form-link"[^>]*>)Contanos tu proyecto/,'$1Completá el formulario');
html=html.replace('</head>','<link rel="stylesheet" href="hierarchy-refinement.css"></head>');fs.writeFileSync('index.html',html);
