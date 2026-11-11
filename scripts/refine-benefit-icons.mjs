import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
const paths={
factory:'<path class="benefit-tint" d="M5 29V15l8 4v-6l9 5V6h6v23Z"/><path d="M5 29V15l8 4v-6l9 5M22 17V6h6v23H5M22 10h6M9 24h2m5 0h2m5 0h2"/><path class="benefit-accent" d="M26 3h4M8 32h18"/>',
ruler:'<path class="benefit-tint" d="m5 24 18-18 7 7-18 18Z"/><path d="m5 24 18-18 7 7-18 18Zm14-14 3 3m-7 1 2 2m-6 2 3 3m-7 1 2 2"/><path class="benefit-accent" d="M5 8h8M9 4v8M24 29h6"/>',
layers:'<path class="benefit-tint" d="m18 5 13 7-13 7L5 12Z"/><path d="m18 5 13 7-13 7L5 12Zm-13 13 13 7 13-7M5 24l13 7 13-7"/><path class="benefit-accent" d="M18 10v4m-2-2h4"/>'
};
for(const [name,body] of Object.entries(paths)){const pattern=new RegExp('<svg class="premium-icon icon-'+name+'"[\\s\\S]*?<\\/svg>');if(!pattern.test(html))throw Error('Missing '+name);html=html.replace(pattern,`<span class="benefit-icon-frame" aria-hidden="true"><svg class="premium-icon benefit-detail-icon icon-${name}" viewBox="0 0 36 36" width="34" height="34" focusable="false">${body}</svg></span>`)}
html=html.replace('</head>','<link rel="stylesheet" href="benefit-icons.css"></head>');fs.writeFileSync('index.html',html);
