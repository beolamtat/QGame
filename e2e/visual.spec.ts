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
 await expect.poll(async()=>host.getAttribute('data-viewport')).toMatch(/^390x[3-9]\d{2}$/);
 await testInfo.attach('mobile-portrait-v065.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.setViewportSize({width:844,height:390});
 await expect.poll(async()=>host.getAttribute('data-viewport')).toMatch(/^844x[2-9]\d{2}$/);
 await testInfo.attach('mobile-landscape-v065.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 for(let i=0;i<20;i++){
  await page.locator('#action').dispatchEvent('click');
  await expect(host).toHaveAttribute('data-zone',i%2===0?'farm':'cafe');
 }
 await expect.poll(async()=>Number(await host.getAttribute('data-texture-count'))).toBeGreaterThan(0);
 expect(Number(await host.getAttribute('data-texture-count'))).toBeLessThanOrEqual(12);
 expect(errors).toEqual([]);
});

test('v0.6.6 responsive HUD fits mobile portrait and landscape without horizontal overflow',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 for(const viewport of [{width:320,height:568},{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(viewport);
  await expect.poll(async()=>host.getAttribute('data-camera-mode')).toBe(viewport.width>viewport.height?'landscape':'portrait');
  const metrics=await page.evaluate(()=>{
   const rect=(id:string)=>{const e=document.getElementById(id)!;const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
   return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,top:rect('top'),bottom:rect('bottom'),controls:rect('controls'),stats:rect('stats'),help:rect('help')};
  });
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width+1);
  expect(metrics.controls.left).toBeGreaterThanOrEqual(-1);
  expect(metrics.controls.right).toBeLessThanOrEqual(metrics.width+1);
  expect(metrics.top.bottom).toBeLessThan(metrics.bottom.top);
  expect(metrics.stats.right).toBeLessThanOrEqual(metrics.width+1);
  expect(metrics.help.left).toBeGreaterThanOrEqual(-1);
  const zoom=Number(await host.getAttribute('data-camera-zoom'));
  expect(zoom).toBeGreaterThanOrEqual(.25);
  expect(zoom).toBeLessThanOrEqual(1.5);
  await testInfo.attach('hud-'+viewport.width+'x'+viewport.height+'-v066.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 }
 await page.locator('#action').click();
 await expect(host).toHaveAttribute('data-zone','cafe');
 await page.locator('#map-open').click();
 await expect(page.locator('#world-map')).toHaveClass(/visible/);
 await page.locator('#map-close').click();
 expect(errors).toEqual([]);
});

test('v0.6.7 WebP crop atlas loads once and preserves crop frames across zones',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const host=page.locator('#game');
 await expect(host).toHaveAttribute('data-asset-format','webp');
 await expect(host).toHaveAttribute('data-crop-webp-bytes','816');
 await expect(host).toHaveAttribute('data-atlas-frames','4');
 await testInfo.attach('webp-crops-v067.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 for(let i=0;i<12;i++){
  await page.locator('#action').dispatchEvent('click');
  await expect(host).toHaveAttribute('data-zone',i%2===0?'cafe':'farm');
  await expect(host).toHaveAttribute('data-asset-format','webp');
 }
 await expect.poll(async()=>Number(await host.getAttribute('data-texture-count'))).toBeGreaterThan(0);
 expect(Number(await host.getAttribute('data-texture-count'))).toBeLessThan(20);
 expect(errors).toEqual([]);
});

test('v0.6.8 binary WebP asset review: valid headers, frame sizes, stable transitions',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?art=webp');
 const host=page.locator('#game');
 await expect(host).toHaveAttribute('data-review-art','webp');
 await expect(host).toHaveAttribute('data-hero-atlas-frames','24');
 await expect(host).toHaveAttribute('data-prop-atlas-frames','6');
 await expect(host).toHaveAttribute('data-webp-binary-bytes','2196');
 const assets=[
  {url:'/assets/hero-v068.webp',width:960,height:56,bytes:238},
  {url:'/assets/props-v068.webp',width:288,height:56,bytes:468},
  {url:'/assets/farm-v068.webp',width:800,height:500,bytes:1090},
  {url:'/assets/cafe-v068.webp',width:800,height:500,bytes:400}
 ];
 const report=await page.evaluate(async items=>{
  return await Promise.all(items.map(async item=>{
   const response=await fetch(item.url);const buffer=await response.arrayBuffer();
   const bytes=new Uint8Array(buffer);
   const signature=String.fromCharCode(...bytes.slice(0,4))+'/'+String.fromCharCode(...bytes.slice(8,12));
   const bitmap=await createImageBitmap(new Blob([buffer],{type:'image/webp'}));
   const result={status:response.status,size:bytes.length,width:bitmap.width,height:bitmap.height,signature};
   bitmap.close();return result;
  }));
 },assets);
 report.forEach((item,i)=>{
  expect(item.status).toBe(200);
  expect(item.signature).toBe('RIFF/WEBP');
  expect(item.size).toBe(assets[i].bytes);
  expect(item.width).toBe(assets[i].width);
  expect(item.height).toBe(assets[i].height);
 });
 await testInfo.attach('farm-binary-webp-v068.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.locator('#action').click();
 await expect(host).toHaveAttribute('data-zone','cafe');
 await testInfo.attach('cafe-binary-webp-v068.png',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 for(let i=0;i<20;i++){
  await page.locator('#action').dispatchEvent('click');
  await expect(host).toHaveAttribute('data-zone',i%2===0?'farm':'cafe');
 }
 await expect.poll(async()=>Number(await host.getAttribute('data-texture-count'))).toBeGreaterThan(0);
 expect(Number(await host.getAttribute('data-texture-count'))).toBeLessThan(20);
 expect(errors).toEqual([]);
});
