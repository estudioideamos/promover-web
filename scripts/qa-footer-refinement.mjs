import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const [width,height] of [[1366,606],[390,844],[320,740]]){
const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
await page.locator('.footer-editorial').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
const floating=await page.locator('.floating-contact').evaluate(el=>({opacity:getComputedStyle(el).opacity,inert:el.inert}));if(floating.opacity!=='0'||!floating.inert)throw Error('Floating CTA at footer');
const footer=await page.locator('.footer-editorial').boundingBox();if(width===1366&&footer.height>606)throw Error('Footer too tall '+footer.height);
const email=await page.locator('.footer-mail').evaluate(el=>({height:el.getBoundingClientRect().height,line:parseFloat(getComputedStyle(el).lineHeight)}));if(width>1000&&email.height>email.line*1.5)throw Error('Desktop email wraps');
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
if(await page.locator('.footer-editorial').evaluate(el=>getComputedStyle(el,'::before').display!=='none'))throw Error('Background rings remain');
await page.locator('.footer-editorial').screenshot({path:`qa/footer-refined-${width}.png`});
await page.locator('#proceso').scrollIntoViewIfNeeded();await page.waitForTimeout(100);if(!await page.locator('.floating-contact').evaluate(el=>el.classList.contains('shown')))throw Error('Floating CTA does not return');
console.log(`PASS ${width}: footer ${Math.round(footer.height)}px, readable email, no floating overlay, brand credit intact`);await page.close();
}await browser.close();
