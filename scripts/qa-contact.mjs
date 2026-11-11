import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1366,1024,390,320]){
const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);const contact=page.locator('#contacto');await contact.evaluate(el=>el.scrollIntoView({block:'start'}));await page.waitForTimeout(100);
if(await contact.locator('a').count()!==1)throw Error('Competing contact actions');if(!await contact.locator('a').getAttribute('href').then(h=>h.startsWith('https://wa.me/5491167172341')))throw Error('WhatsApp link');
const style=await contact.locator('h2 em').evaluate(e=>({spacing:getComputedStyle(e).letterSpacing,stroke:parseFloat(getComputedStyle(e).webkitTextStrokeWidth)}));if(style.spacing!=='normal'&&parseFloat(style.spacing)<0)throw Error('Outline has negative tracking');if(!style.stroke)throw Error('Outline missing');
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');if(!await contact.locator('.contact-hours').isVisible())throw Error('Hours missing');if(await page.locator('.floating-contact').evaluate(e=>e.classList.contains('shown')))throw Error('Floating contact competes');
await contact.screenshot({path:`qa/contact-${width}.png`});console.log(`PASS ${width}: clean outline spacing, single CTA, hours, no overflow`);await page.close();
}await browser.close();
