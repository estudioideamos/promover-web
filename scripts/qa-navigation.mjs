import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1440,1024,768,390,320]){
const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
if(width<=900){await page.locator('.menu-toggle').click();if(!await page.locator('body').evaluate(e=>e.classList.contains('menu-open')))throw Error('Menu scroll lock');await page.keyboard.press('Shift+Tab');if(!await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement))throw Error('Menu focus trap');await page.keyboard.press('Escape');if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('Escape closure');await page.locator('.menu-toggle').click();await page.locator('#navigation').screenshot({path:`qa/navigation-open-${width}.png`});}
await page.locator('#navigation a[href="#universo"]').click();await page.waitForTimeout(150);const rect=await page.locator('.header').boundingBox();if(Math.abs(rect.y)>1)throw Error('Header not sticky');if(await page.locator('#navigation a[href="#universo"]').getAttribute('aria-current')!=='location')throw Error('Active section');
if(width<=900&&await page.locator('body').evaluate(e=>e.classList.contains('menu-open')))throw Error('Menu still locked');
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);if(errors.length)throw Error(errors.join());
await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`qa/navigation-${width}.png`});console.log(`PASS ${width}: sticky header, active section, menu focus/escape/scroll restoration`);await page.close();
}await browser.close();
