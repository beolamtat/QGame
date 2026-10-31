import {test,expect} from '@playwright/test';

test('v0.6.1 farm visual, crop atlas and camera fit',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 await expect(host.locator('canvas')).toBeVisible();
 await expect(host).toHaveAttribute('data-atlas-frames','4');
 await expect(host).toHaveAttribute('data-hero-atlas-frames','24');
 await expect(host).toHaveAttribute('data-zone','farm');
 await expect.poll(async()=>Number(await host.getAttribute('data-camera-zoom'))).toBeGreaterThan(.37);
 const canvas=host.locator('canvas');
 const box=await canvas.boundingBox();expect(box).not.toBeNull();
 expect(box!.width).toBeGreaterThan(250);
 expect(box!.height).toBeGreaterThan(250);
 await testInfo.attach('farm-v061.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.locator('#action').click();
 await expect(host).toHaveAttribute('data-zone','cafe');
 await expect(page.locator('#orders')).toBeVisible();
 await testInfo.attach('cafe-v061.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.locator('#action').click();
 await expect(host).toHaveAttribute('data-zone','farm');
 expect(errors).toEqual([]);
});

test('v0.6.1 orientation resize preserves usable camera and interactions',async({page},testInfo)=>{
 await page.goto('/');
 await expect(page.locator('#game canvas')).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 await expect.poll(async()=>await page.locator('#game').getAttribute('data-viewport')).toMatch(/^390x[3-9]\d{2}$/);
 const portrait=Number(await page.locator('#game').getAttribute('data-camera-zoom'));
 expect(portrait).toBeGreaterThanOrEqual(.38);
 await testInfo.attach('portrait-v061.png',{body:await page.screenshot(),contentType:'image/png'});
 await page.setViewportSize({width:844,height:390});
 await expect.poll(async()=>await page.locator('#game').getAttribute('data-viewport')).toMatch(/^844x[2-9]\d{2}$/);
 const landscape=Number(await page.locator('#game').getAttribute('data-camera-zoom'));
 expect(landscape).toBeGreaterThanOrEqual(.38);
 await page.locator('#map-open').click();
 await expect(page.locator('#world-map')).toHaveClass(/visible/);
 await page.locator('#map-close').click();
 await page.locator('#action').click();
 await expect(page.locator('#game')).toHaveAttribute('data-zone','cafe');
 await testInfo.attach('landscape-v061.png',{body:await page.screenshot(),contentType:'image/png'});
});

test('v0.6.2 character atlas survives movement, zone switches and reload',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('#game')).toHaveAttribute('data-hero-atlas-frames','24');
 const canvas=page.locator('#game canvas');
 await canvas.click({position:{x:200,y:230}});
 await page.waitForTimeout(450);
 await testInfo.attach('hero-walk-v062.png',{body:await page.screenshot(),contentType:'image/png'});
 await page.locator('#action').click();
 await expect(page.locator('#game')).toHaveAttribute('data-zone','cafe');
 await expect(page.locator('#game')).toHaveAttribute('data-hero-atlas-frames','24');
 await page.reload();
 await expect(page.locator('#game')).toHaveAttribute('data-hero-atlas-frames','24');
 expect(errors).toEqual([]);
});

test('v0.6.3 shared prop textures and runtime diagnostics remain bounded',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 await expect(host).toHaveAttribute('data-prop-atlas-frames','6');
 await expect.poll(async()=>Number(await host.getAttribute('data-display-objects')),{timeout:12000}).toBeGreaterThan(0);
 const farmObjects=Number(await host.getAttribute('data-display-objects'));
 const farmTextures=Number(await host.getAttribute('data-texture-count'));
 expect(farmObjects).toBeLessThan(150);
 expect(farmTextures).toBeLessThan(30);
 await testInfo.attach('farm-v063.png',{body:await page.screenshot(),contentType:'image/png'});
 for(let i=0;i<3;i++){
  await page.locator('#action').click();
  await expect(host).toHaveAttribute('data-zone','cafe');
  await page.locator('#action').click();
  await expect(host).toHaveAttribute('data-zone','farm');
 }
 await expect.poll(async()=>Number(await host.getAttribute('data-display-objects'))).toBeGreaterThan(0);
 const afterObjects=Number(await host.getAttribute('data-display-objects'));
 const afterTextures=Number(await host.getAttribute('data-texture-count'));
 expect(afterObjects).toBeLessThan(150);
 // Phaser Text creates generated textures during scene rebuilds; monitor an explicit budget.
 expect(afterTextures).toBeLessThan(100);
 expect(afterTextures).toBeGreaterThanOrEqual(farmTextures);
 await page.locator('#action').click();
 await testInfo.attach('cafe-v063.png',{body:await page.screenshot(),contentType:'image/png'});
 expect(errors).toEqual([]);
});

test('v0.6.4 stress: 40 scene transitions without unbounded GPU texture growth',async({page})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 await expect.poll(async()=>Number(await host.getAttribute('data-texture-count')),{timeout:12000}).toBeGreaterThan(0);
 const samples:number[]=[];
 for(let i=0;i<40;i++){
  await page.locator('#action').dispatchEvent('click');
  await expect(host).toHaveAttribute('data-zone',i%2===0?'cafe':'farm');
  if((i+1)%10===0){
   await expect.poll(async()=>Number(await host.getAttribute('data-texture-count'))).toBeGreaterThan(0);
   samples.push(Number(await host.getAttribute('data-texture-count')));
  }
 }
 console.log('v0.6.4 texture samples after 10/20/30/40 transitions:',JSON.stringify(samples));
 expect(samples[3]-samples[1]).toBeLessThanOrEqual(2);
 expect(samples[3]).toBeLessThan(30);
 expect(errors).toEqual([]);
});

test('v0.6.5 environment art is shared across scenes and mobile orientations',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 await expect(host).toHaveAttribute('data-environment-atlas','v065');
 await expect(host).toHaveAttribute('data-zone','farm');
 await testInfo.attach('farm-v065.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.locator('#action').click();
 await expect(host).toHaveAttribute('data-zone','cafe');
 await testInfo.attach('cafe-v065.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.setViewportSize({width:390,height:844});
 await expect.poll(async()=>host.getAttribute('data-viewport')).toMatch(/^390x[3-9]\\d{2}$/);
 await testInfo.attach('mobile-portrait-v065.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.setViewportSize({width:844,height:390});
 await expect.poll(async()=>host.getAttribute('data-viewport')).toMatch(/^844x[2-9]\\d{2}$/);
 await testInfo.attach('mobile-landscape-v065.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 for(let i=0;i<20;i++){
  await page.locator('#action').dispatchEvent('click');
  await expect(host).toHaveAttribute('data-zone',i%2===0?'farm':'cafe');
 }
 await expect.poll(async()=>Number(await host.getAttribute('data-texture-count'))).toBeGreaterThan(0);
 expect(Number(await host.getAttribute('data-texture-count'))).toBeLessThanOrEqual(12);
 expect(errors).toEqual([]);
});
