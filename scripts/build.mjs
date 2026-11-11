import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
for(const f of ['index.html','styles.css','typography.css','editorial-footer.css','vector-icons.css','brand-details.css','editorial-layout.css','app.js'])fs.copyFileSync(f,'dist/'+f);
fs.cpSync('assets','dist/assets',{recursive:true,filter:p=>!p.endsWith('.png')&&!p.endsWith('.jpg')&&!p.endsWith('logo.svg')});
fs.writeFileSync('dist/.nojekyll','');
console.log('Static site built to dist/');
