import Phaser from 'phaser';

/** A deterministic, self-contained sprite atlas. Replaces 4 separate display-object
 * trees per crop with one textured sprite. Future artist atlases can use the same frames.
 * No browser asset downloads or build-time graphics tools required.
 */
export const COFFEE_ATLAS_KEY='coffee-plants-v061';
export const COFFEE_FRAMES=['empty','seed','growing','ripe'] as const;
const WIDTH=96,HEIGHT=112;
function leaf(ctx:CanvasRenderingContext2D,x:number,y:number,r:number,color:string,rotation:number){
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,0,r,r*.56,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawCrop(ctx:CanvasRenderingContext2D,stage:number,x:number){
 ctx.save();ctx.translate(x+WIDTH/2,HEIGHT-8);
 ctx.fillStyle='rgba(37,46,24,.2)';ctx.beginPath();ctx.ellipse(0,-2,41,12,0,0,Math.PI*2);ctx.fill();
 // Hand-painted soil depth, highlights and irregular earth texture.
 ctx.fillStyle='#8d5c39';ctx.beginPath();ctx.ellipse(0,-8,40,17,0,0,Math.PI*2);ctx.fill();
 for(let i=0;i<7;i++){const px=-30+i*10;ctx.fillStyle=i%2?'#aa784e':'#65472e';ctx.beginPath();ctx.ellipse(px,-8+(i%3)*3,3,2,0,0,Math.PI*2);ctx.fill()}
 ctx.strokeStyle='#b98658';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-8,36,13,0,0,Math.PI*2);ctx.stroke();
 if(stage===0){ctx.restore();return}
 if(stage===1){
  ctx.strokeStyle='#6f9f52';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(0,-31);ctx.stroke();
  leaf(ctx,-8,-30,11,'#8bc96a',-.55);leaf(ctx,9,-34,10,'#6ab85e',.5);ctx.restore();return;
 }
 const tall=stage===3?75:52;
 ctx.strokeStyle='#715037';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,-tall);ctx.stroke();
 const layers=stage===3?4:3;
 for(let i=0;i<layers;i++){
  const y=-24-i*(stage===3?15:12);
  const radius=stage===3?21-i*2:16-i*2;
  leaf(ctx,-16,y,radius,i%2?'#4e9c56':'#6eb96c',-.36);
  leaf(ctx,16,y-4,radius,i%2?'#80c36f':'#3e9853',.36);
 }
 leaf(ctx,0,-tall,16,'#8cce79',0);
 // Pale veins and leaf sheen give each growth stage a readable silhouette at mobile zoom.
 ctx.strokeStyle='rgba(226,246,178,.65)';ctx.lineWidth=1.5;
 for(let i=0;i<layers;i++){
  const y=-24-i*(stage===3?15:12);
  ctx.beginPath();ctx.moveTo(-30,y+4);ctx.lineTo(-6,y-1);ctx.moveTo(7,y-5);ctx.lineTo(29,y-9);ctx.stroke();
 }
 if(stage===3){
  for(const [bx,by] of [[-19,-37],[20,-44],[-13,-61],[16,-68],[-5,-50]]){
   ctx.fillStyle='#6d3035';ctx.beginPath();ctx.arc(bx+1,by+3,6,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#d54c47';ctx.beginPath();ctx.arc(bx,by,6,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#ffb2a0';ctx.beginPath();ctx.arc(bx-2,by-2,2,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.restore();
}
export function registerCoffeeAtlas(scene:Phaser.Scene):void{
 if(scene.textures.exists(COFFEE_ATLAS_KEY)){
  const tex=scene.textures.get(COFFEE_ATLAS_KEY);
  COFFEE_FRAMES.forEach((name,i)=>{if(!tex.has(name))tex.add(name,0,i*WIDTH,0,WIDTH,HEIGHT)});
  return;
 }
 const canvas=document.createElement('canvas');canvas.width=WIDTH*COFFEE_FRAMES.length;canvas.height=HEIGHT;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Coffee atlas: Canvas2D unavailable');
 COFFEE_FRAMES.forEach((_,i)=>drawCrop(ctx,i,i*WIDTH));
 const texture=scene.textures.addCanvas(COFFEE_ATLAS_KEY,canvas);
 if(!texture)throw new Error('Coffee atlas: failed to register texture');
 COFFEE_FRAMES.forEach((name,i)=>texture.add(name,0,i*WIDTH,0,WIDTH,HEIGHT));
}
export function makeCoffeePlant(scene:Phaser.Scene,x=0,y=0):Phaser.GameObjects.Sprite{
 registerCoffeeAtlas(scene);
 return scene.add.sprite(x,y,COFFEE_ATLAS_KEY,'empty').setOrigin(.5,.89);
}
export function coffeeAtlasMetadata(){return {key:COFFEE_ATLAS_KEY,frameWidth:WIDTH,frameHeight:HEIGHT,frames:[...COFFEE_FRAMES]}}
