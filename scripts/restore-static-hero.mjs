import fs from 'node:fs';import {execFileSync} from 'node:child_process';
let html=fs.readFileSync('index.html','utf8');
const original=execFileSync('git',['show','ac1c647:index.html'],{encoding:'utf8'});
const hero=original.match(/<section class="hero"[\s\S]*?<\/section>/)[0];
html=html.replace(/<section class="hero"[\s\S]*?<\/section>/,hero).replace('<link rel="stylesheet" href="hero-film.css">','').replace('<script src="hero-film.js" defer></script>','');fs.writeFileSync('index.html',html);
