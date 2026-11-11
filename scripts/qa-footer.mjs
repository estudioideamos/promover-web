import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1440,390,320]){
const page=await browser.newPage({viewport:{width,height:960},reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
await page.locator('.home-marquee').scrollIntoViewIfNeeded();await page.mouse.move(0,0);
const state=()=>page.locator('.marquee-track').evaluate(e=>({time:e.getAnimations()[0].currentTime,transform:getComputedStyle(e).transform,groups:[...e.children].map(g=>g.getBoundingClientRect().width),width:e.getBoundingClientRect().width}));
const a=await state();await page.waitForTimeout(150);const b=await state();if(a.transform===b.transform)throw Error('Marquee not moving');if(Math.abs(b.groups[0]-b.groups[1])>1||Math.abs(b.width-2*b.groups[0])>1)throw Error('Loop geometry');
await page.locator('.home-marquee').hover();const c=await state();await page.waitForTimeout(150);if((await state()).time<=c.time)throw Error('Marquee pauses on hover');if(await page.locator('.marquee-toggle').count())throw Error('Pause control remains');
await page.locator('.home-marquee').screenshot({path:`qa/marquee-${width}.png`});await page.locator('.footer-editorial').screenshot({path:`qa/footer-${width}.png`});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);
if(!await page.locator('.footer-phone a').getAttribute('href').then(s=>s.startsWith('https://wa.me/5491167172341')))throw Error('Contact link');
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);if(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName!=='none'))throw Error('Reduced motion');console.log('PASS footer / marquee '+width);await page.close();
}await browser.close();
