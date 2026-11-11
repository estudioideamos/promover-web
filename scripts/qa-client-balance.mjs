import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1366,390,320]){
const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.locator('#confianza').evaluate(e=>e.scrollIntoView({block:'start'}));await page.waitForTimeout(150);
if(await page.locator('#navigation [aria-current]').count())throw Error('Incorrect active section at clients');if(await page.locator('.client-signoff>p').count())throw Error('Repeated copy remains');if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
await page.locator('#confianza').screenshot({path:`qa/clients-balanced-${width}.png`});console.log(`PASS ${width}: client layout, correct navigation state, no overflow`);await page.close();
}await browser.close();
