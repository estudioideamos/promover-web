import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
const icons={
conversation:'<path class="process-icon-tint" d="M7 6h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H14l-7 5V9a3 3 0 0 1 3-3Z"/><path d="M10 6h15a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H14l-7 5V9a3 3 0 0 1 3-3Z"/><path d="M12 12h11M12 17h8"/><path class="process-icon-accent" d="M24 28h5m-2.5-2.5v5"/>',
design:'<path class="process-icon-tint" d="m7 26 3-13L23 5l6 6-8 13-14 3Z"/><path d="m7 27 3-14L23 5l6 6-8 13Zm0 0 9-9M20 7l7 7"/><circle cx="18" cy="16" r="2.6"/><path class="process-icon-accent" d="M6 31h20"/>',
delivery:'<path class="process-icon-tint" d="m6 11 12-6 12 6v14l-12 6-12-6Z"/><path d="m6 11 12 6 12-6-12-6Zm0 0v14l12 6 3-1.5M18 17v14M12 8l12 6v5M30 11v8"/><path class="process-icon-accent" d="m24 25 3 3 5-7"/>'
};
for(const [name,paths] of Object.entries(icons)){const pattern=new RegExp('<svg class="premium-icon icon-'+name+'"[\\s\\S]*?<\\/svg>');if(!pattern.test(html))throw Error('Missing '+name);html=html.replace(pattern,`<svg class="premium-icon process-detail-icon icon-${name}" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false">${paths}</svg>`)}
fs.writeFileSync('index.html',html);
