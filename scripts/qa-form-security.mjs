import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext(),page=await context.newPage();
let posts=0;
await page.route('https://formsubmit.co/**',async route=>{
  posts++;
  assert.equal(route.request().url(),'https://formsubmit.co/info@promovermarketing.com.ar');
  assert.ok(route.request().postData().includes('_captcha=true'));
  await route.fulfill({contentType:'text/html',body:'<h1>QA intercepted submission</h1>'});
});
async function fill(){
  await page.getByLabel('Tu nombre').fill('Control de calidad');
  await page.getByLabel('Email *',{exact:true}).fill('qa@example.com');
  await page.getByLabel('Contanos tu idea').fill('Consulta de prueba interceptada para verificar el formulario.');
  await page.locator('[name=consentimiento]').check();
}
await page.goto('http://127.0.0.1:4173/contacto.html');await fill();
await page.locator('[name=_honey]').evaluate(input=>input.value='spam');
await page.getByRole('button',{name:'Enviar mi consulta'}).click();assert.equal(posts,0);
assert.ok((await page.locator('#form-status').textContent()).includes('No pudimos'));
await page.locator('[name=_honey]').evaluate(input=>input.value='');
await page.getByRole('button',{name:'Enviar mi consulta'}).click();await page.waitForURL('https://formsubmit.co/**');assert.equal(posts,1);
await page.goto('http://127.0.0.1:4173/contacto.html');await fill();
await page.getByRole('button',{name:'Enviar mi consulta'}).click();assert.equal(posts,1);
assert.ok((await page.locator('#form-status').textContent()).includes('Esperá'));
await browser.close();console.log('PASS: honeypot, duplicate submission guard, new recipient, server CAPTCHA flag; no messages sent.');
