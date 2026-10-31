import {test,expect} from '@playwright/test';

test('v0.6.1 farm visual, crop atlas and camera fit',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 await expect(host.locator('canvas')).toBeVisible();
 await expect(host).toHaveAttribute('data-atlas-frames','4');
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
