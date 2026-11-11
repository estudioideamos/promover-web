import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1366,768,390,320]){
const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
const section=page.locator('#proceso');await section.evaluate(e=>e.scrollIntoView({block:'start'}));await page.waitForTimeout(100);
if(await section.locator('article').count()!==3)throw Error('Steps');if(await section.locator('.step-number,.process-drawing').count())throw Error('Old decoration remains');
if(!await section.locator('.process-photo img').evaluate(i=>i.complete&&i.naturalWidth>0))throw Error('Photo');if(!await section.locator('.process-cta').getAttribute('href').then(h=>h.startsWith('https://wa.me/5491167172341')))throw Error('WhatsApp');
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');await section.screenshot({path:`qa/process-${width}.png`});console.log(`PASS ${width}: three connected stages, photo, WhatsApp, no overflow`);await page.close();
}await browser.close();
