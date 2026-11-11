import {chromium} from '@playwright/test';import fs from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});fs.mkdirSync('qa',{recursive:true});
for(const width of [1440,390,320,768]){
 const page=await browser.newPage({viewport:{width,height:960},reducedMotion:'reduce'});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow at '+width);
 for(const key of ['textil','marroquineria','especiales','boligrafos','promociones','hogar','sustentable']){
 await page.locator(`[data-category="${key}"]`).click();await page.locator('#category-dialog').waitFor({state:'visible'});
 const href=await page.locator('#dialog-cta').getAttribute('href');if(!href.includes('5491167172341?text='))throw Error('Invalid CTA');
 await page.keyboard.press('Escape');if(await page.locator('#category-dialog').isVisible())throw Error('Dialog did not close');
 }
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>{})})));
 const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));if(broken.length)throw Error('Broken images '+broken);
 if(width<=700){await page.locator('.menu-toggle').click();if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Menu');await page.locator('#navigation a[href="#contacto"]').click();if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('Menu closure');}
 await page.locator('.philosophy summary').click();if(!await page.locator('.philosophy').getAttribute('open')&&await page.locator('.philosophy').getAttribute('open')===null)throw Error('Accordion');
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`qa/${width}.png`,fullPage:true});if(errors.length)throw Error(errors.join());console.log(`PASS ${width}px: 7 category dialogs, images, overflow, navigation, no JS errors`);await page.close();
}
await browser.close();
