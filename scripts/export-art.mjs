import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';

const port=4175;
const server=spawn('npm',['run','dev','--','--port',String(port),'--strictPort'],{stdio:'ignore'});
const files=[
 ['coffee-hero-v062','hero-v069.webp',1920,112],
 ['coffee-props-v063','props-v069.webp',576,112],
 ['coffee-environment-farm-v065','farm-v069.webp',1600,1000],
 ['coffee-environment-cafe-v065','cafe-v069.webp',1600,1000]
];
let browser;
try{
 let ready=false;
 for(let i=0;i<80;i++){
  try{const r=await fetch('http://127.0.0.1:'+port+'/');if(r.ok){ready=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,300));
 }
 if(!ready)throw new Error('Vite server did not start');
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:960,height:540}});
 await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle'});
 await page.locator('#game[data-zone="farm"]').waitFor();
 await mkdir('public/assets',{recursive:true});
 for(const [key,name,width,height] of files){
  if(name.startsWith('cafe')){
   await page.locator('#action').click();
   await page.locator('#game[data-zone="cafe"]').waitFor();
  }
  const dataUrl=await page.evaluate(key=>(window).__coffeeExportArt(key),key);
  if(!dataUrl.startsWith('data:image/webp;base64,'))throw new Error('WebP encoding unavailable for '+key);
  const buffer=Buffer.from(dataUrl.split(',')[1],'base64');
  if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')throw new Error('Bad WebP signature: '+name);
  const size=await page.evaluate(async data=>{
   const blob=await(await fetch(data)).blob();
   const bitmap=await createImageBitmap(blob);
   const result=[bitmap.width,bitmap.height];bitmap.close();return result;
  },dataUrl);
  if(size[0]!==width||size[1]!==height)throw new Error('Unexpected atlas size for '+name+': '+size);
  await writeFile('public/assets/'+name,buffer);
  console.log(name+': '+width+'x'+height+', '+buffer.length+' bytes');
 }
}finally{
 await browser?.close();
 server.kill('SIGTERM');
}
