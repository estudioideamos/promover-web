import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const reports=[];
for(const file of ['index.html','contacto.html','gracias.html'])for(const width of [320,390,768,1366]){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}),page=await context.newPage();
 const errors=[],violations=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{window.cspErrors=[];document.addEventListener('securitypolicyviolation',e=>window.cspErrors.push(e.violatedDirective+': '+e.blockedURI))});
 await page.goto('http://127.0.0.1:4173/'+file,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('link[rel=canonical]').count(),1);
 assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),'https://estudioideamos.github.io/promover-web/assets/social-promover.jpg');
 await page.locator('script[type="application/ld+json"]').evaluate(el=>JSON.parse(el.textContent));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow '+file+' '+width);
 if(file==='index.html'){
  await page.locator('#confianza').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('#client-logos .logo-group').length===2);
  assert.equal(await page.locator('#client-logos .logo-group').count(),2);
  assert.ok((await page.locator('.hero-product').evaluate(img=>img.currentSrc)).endsWith('.avif'));
  await page.locator('[data-category="hogar"]').click();assert.ok((await page.locator('#dialog-image').getAttribute('src')).includes('asado-promover'));await page.keyboard.press('Escape');
  await page.locator('.philosophy summary').click();
  if(width===390)await page.locator('.principles-inline').screenshot({path:'qa/mobile-principles-premium.png'});
 }
 if(width<=760){
  for(const item of await page.locator('.footer-toggle').all()){assert.equal(await item.getAttribute('open'),null);await item.locator('summary').click()}
  if(width===390&&file==='index.html')await page.locator('.footer').screenshot({path:'qa/mobile-footer-premium-open.png'});
 }
 if(width===390||width===1366){
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  violations.push(...result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
 }
 reports.push({file,width,errors,csp:await page.evaluate(()=>window.cspErrors),violations});
 assert.deepEqual(errors,[]);assert.deepEqual(await page.evaluate(()=>window.cspErrors),[]);
 if(width===390&&file==='index.html'){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'qa/mobile-home-premium.png'});}
 if(width===390&&file==='contacto.html')await page.screenshot({path:'qa/mobile-contact-premium.png',fullPage:true});
 console.log(`PASS ${file} ${width}: layout, content, assets, CSP, contact toggles. Axe findings: ${violations.length}`);await context.close();
}
const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto('http://127.0.0.1:4173');assert.equal(await noJS.locator('#client-logos img').count(),23);assert.ok(await noJS.locator('h1').textContent());
fs.writeFileSync('qa/site-quality.json',JSON.stringify(reports,null,2));await browser.close();
if(reports.some(r=>r.violations.length))process.exitCode=1;
