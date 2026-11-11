import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const file of ['index.html','contacto.html','gracias.html'])for(const [width,height] of [[390,844],[320,640],[768,900],[844,390],[1366,900]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/'+file);await page.evaluate(()=>document.fonts.ready);
 const button=page.locator('.menu-toggle'),nav=page.locator('#navigation');
 if(width<=900){
  if(!await nav.evaluate(el=>el.inert))throw Error('Closed navigation not inert');
  await button.click();await page.waitForTimeout(850);
  if(await button.getAttribute('aria-expanded')!=='true')throw Error('Not open');
  if(!await page.locator('main').evaluate(el=>el.inert))throw Error('Background not isolated');
  if(!await nav.locator('a').first().evaluate(el=>el===document.activeElement))throw Error('Opening focus');
  await page.keyboard.press('Shift+Tab');if(!await button.evaluate(el=>el===document.activeElement))throw Error('Reverse focus trap');
  await page.keyboard.press('Tab');if(!await nav.locator('a').first().evaluate(el=>el===document.activeElement))throw Error('Forward focus trap');
  if(await nav.evaluate(el=>el.scrollWidth>el.clientWidth))throw Error('Menu horizontal overflow');
  await nav.locator('.mobile-menu-contact a').last().scrollIntoViewIfNeeded();
  if(!await nav.locator('.mobile-menu-contact a').last().isVisible())throw Error('Unreachable contacts');
  if(width===390&&file==='index.html'){await nav.evaluate(el=>el.scrollTop=0);await page.screenshot({path:'qa/mobile-menu-premium.png'})}
  await page.keyboard.press('Escape');await page.waitForTimeout(500);
  if(await button.getAttribute('aria-expanded')!=='false'||await page.locator('main').evaluate(el=>el.inert))throw Error('Escape restoration');
  await button.click();await page.waitForTimeout(650);await nav.locator('a').first().click();
  await page.waitForTimeout(500);if(await button.getAttribute('aria-expanded')!=='false')throw Error('Link closure');
  await button.click();await page.waitForTimeout(600);await page.setViewportSize({width:1200,height:900});
  if(await nav.evaluate(el=>el.inert)||await page.locator('main').evaluate(el=>el.inert))throw Error('Desktop restoration');
 }else if(await nav.locator('.mobile-menu-intro').isVisible())throw Error('Mobile extras visible desktop');
 if(errors.length)throw Error(errors.join('\n'));
 console.log(`PASS ${file} ${width}x${height}: menu, keyboard, contacts, responsive restoration`);await page.close();
}
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await reduced.goto('http://127.0.0.1:4173');await reduced.locator('.menu-toggle').click();
if(await reduced.locator('#navigation').evaluate(el=>getComputedStyle(el).transitionDuration)!=='0s')throw Error('Reduced motion ignored');
console.log('PASS reduced motion');await browser.close();
