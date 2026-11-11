import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
const original=html.match(/<details class="philosophy">[\s\S]*?<\/details>/)[0];
const paragraphs=[...original.matchAll(/<p>(.*?)<\/p>/g)].map(m=>m[1]);
const arrow='<svg class="principles-toggle" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const icons=[
'<path d="M5 5h14v11H9l-4 4Zm4 4h6m-6 3h4"/>',
'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8m-4 0h4v4"/>',
'<path d="m12 3 8 4v6c0 4-8 8-8 8S4 17 4 13V7Zm-4 9 3 3 5-6"/>'
];
const titles=['Filosofía','Misión','Valores'];
const cards=paragraphs.map((p,i)=>`<article class="principle-card"><svg class="premium-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg><h3>${titles[i]}</h3><p>${p}</p></article>`).join('');
html=html.replace(original,'');
const start=html.indexOf('<section class="manufacture');if(start<0)throw Error('Manufacture missing');const end=html.indexOf('</section>',start)+10;
const section=`<section class="brand-principles" aria-label="Filosofía y compromiso de Promover"><details class="philosophy"><summary><span><span class="principles-eyebrow">El valor de hacerlo propio</span><span class="principles-title">Nuestra filosofía y compromiso.</span></span>${arrow}</summary><div class="principles-grid">${cards}</div></details></section>`;
html=html.slice(0,end)+section+html.slice(end);html=html.replace('</head>','<link rel="stylesheet" href="principles.css"></head>');fs.writeFileSync('index.html',html);
