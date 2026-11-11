import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1366,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/contacto.html');await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('select option').count(),9);assert.equal(await page.locator('form').evaluate(f=>f.checkValidity()),false);
 await page.getByLabel('Tu nombre').fill('Prueba de diseño');await page.getByLabel('Email *',{exact:true}).fill('qa@example.com');await page.getByLabel('Contanos tu idea').fill('Necesitamos bolsos para un evento de nuestra empresa.');await page.locator('[name=consentimiento]').check();assert.equal(await page.locator('form').evaluate(f=>f.checkValidity()),true);
 let submitted=false;await page.route('https://formsubmit.co/**',async route=>{submitted=true;const body=route.request().postData();assert.ok(body.includes('qa%40example.com'));await route.fulfill({contentType:'text/html',body:'<h1>Envío interceptado para QA</h1>'})});
 await page.evaluate(()=>{document.activeElement.blur();scrollTo({top:0,behavior:'instant'})});await page.screenshot({path:`qa/contact-page-${width}.png`,fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.getByRole('button',{name:'Enviar mi consulta'}).click();await page.waitForURL('https://formsubmit.co/**');assert.ok(submitted);assert.deepEqual(errors,[]);
 await page.goto('http://127.0.0.1:4173/gracias.html');assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.goto('http://127.0.0.1:4173/');assert.equal(await page.locator('.nav-contact').getAttribute('href'),'contacto.html');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);console.log(`PASS ${width}: form validation, intercepted POST, thank-you page, home link and overflow`);await page.close();
}
await browser.close();
