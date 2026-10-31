import Phaser from 'phaser';

export const HERO_ATLAS_KEY='coffee-hero-v062';
export const HERO_DIRECTIONS=['n','ne','e','se','s','sw','w','nw'] as const;
export type HeroDirection=typeof HERO_DIRECTIONS[number];
const W=80,H=112;
const color={outline:'#5b453e',skin:'#f6c99d',hair:'#52392f',hat:'#f1c36e',shirt:'#438f94',apron:'#f8e8bd',trousers:'#52546b'};
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,fill:string){
 c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();
}
function stroke(c:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,w:number,fill:string){
 c.strokeStyle=fill;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
}
function frame(c:CanvasRenderingContext2D,dir:HeroDirection,pose:number,x:number){
 // Each of the 24 frames has a distinct direction/pose silhouette.
 const back=dir==='n'||dir==='ne'||dir==='nw';
 const side=dir==='e'||dir==='w';
 const diagonal=dir.length===2;
 const sign=dir==='w'||dir==='sw'||dir==='nw'?-1:1;
 const swing=pose===0?0:pose===1?8:-8;
 const bob=pose===0?0:pose===1?-3:2;
 const shoulder=side?sign*5:diagonal?sign*3:0;
 const headX=side?sign*7:diagonal?sign*4:0;
 c.save();c.translate(x+W/2,bob);
 ellipse(c,0,103-bob,23,6,'rgba(34,45,33,.22)');
 // Shoes, separate moving legs and a stitched trouser seam.
 for(const k of [-1,1]){
  const footX=k*11-k*swing;
  stroke(c,k*11,79,footX,98,13,color.outline);
  stroke(c,k*11,79,footX,97,9,color.trousers);
  ellipse(c,footX+sign*2,99,8,4,'#3c3541');
  stroke(c,footX-4,96,footX+4,96,1,'#8c8190');
 }
 // Arm swing is mirrored with the walk phase, never mirrored at the texture level.
 for(const k of [-1,1]){
  const armX=k*21+shoulder;
  stroke(c,armX,55,armX+k*swing*.7,78,15,color.outline);
  stroke(c,armX,55,armX+k*swing*.7,76,10,k<0?'#64aaa4':'#347d83');
  ellipse(c,armX+k*swing*.7,79,6,7,color.skin);
 }
 ellipse(c,shoulder,64,24,29,color.outline);
 ellipse(c,shoulder,63,21,26,color.shirt);
 if(back){
  // Back apron straps form a recognisable X on north-facing frames.
  stroke(c,shoulder-13,53,shoulder+12,79,4,'#f3d8a7');
  stroke(c,shoulder+13,53,shoulder-12,79,4,'#f3d8a7');
  ellipse(c,shoulder,76,7,4,'#d7a66c');
 }else{
  ellipse(c,shoulder+sign*(side?5:0),70,14,20,color.apron);
  stroke(c,shoulder-15,57,shoulder+15,57,3,'#b8865e');
  stroke(c,shoulder-9,82,shoulder+9,82,2,'#d2b58c');
  ellipse(c,shoulder+sign*(side?5:0),70,3,3,'#c48c56');
 }
 // Eight-facing chibi head, nose profile and hairstyle.
 ellipse(c,headX,36,25,25,color.outline);
 ellipse(c,headX,37,22,22,back?color.hair:color.skin);
 if(!back){
  ellipse(c,headX,24,21,10,color.hair);
  if(side){
   ellipse(c,headX+sign*12,37,4,5,color.outline);
   ellipse(c,headX+sign*20,42,5,4,color.skin);
   ellipse(c,headX-sign*11,43,4,7,color.hair);
  }else if(diagonal){
   ellipse(c,headX+sign*9,39,3.5,4,color.outline);
   ellipse(c,headX-sign*5,40,2.2,3,color.outline);
   ellipse(c,headX+sign*15,46,5,3,'#eaa59a');
  }else{
   ellipse(c,headX-8,39,3,3.5,color.outline);
   ellipse(c,headX+8,39,3,3.5,color.outline);
   ellipse(c,headX-14,46,5,3,'#eaa59a');
   ellipse(c,headX+14,46,5,3,'#eaa59a');
   stroke(c,headX-3,48,headX+3,48,1.5,'#ad746b');
  }
 }else{
  ellipse(c,headX,31,20,17,color.hair);
  for(const xx of [-12,0,12])stroke(c,headX+xx,25,headX+xx+4,42,2,'#69483a');
 }
 // Wide straw brim, dimensional crown, leaf pin and specular highlight.
 ellipse(c,headX,19,31,9,color.outline);
 ellipse(c,headX,18,29,7,color.hat);
 ellipse(c,headX,11,20,12,'#e8b75d');
 ellipse(c,headX,14,18,3,'#b88747');
 ellipse(c,headX+9,9,5,3,'#4f936e');
 ellipse(c,headX-8,10,5,2,'rgba(255,245,205,.65)');
 // Small coffee bean patch; differs in side/back orientations.
 ellipse(c,shoulder+(back?-8:side?sign*13:0),65,3,5,'#8c5942');
 c.restore();
}
export function registerHeroAtlas(scene:Phaser.Scene):void{
 if(scene.textures.exists(HERO_ATLAS_KEY)){
  const tex=scene.textures.get(HERO_ATLAS_KEY);
  const fw=tex.source[0].width/24,fh=tex.source[0].height;
  HERO_DIRECTIONS.forEach((dir,d)=>{for(let p=0;p<3;p++){
   const name=dir+'-'+p;
   if(!tex.has(name))tex.add(name,0,(d*3+p)*fw,0,fw,fh);
  }});
  return;
 }
 const canvas=document.createElement('canvas');canvas.width=W*HERO_DIRECTIONS.length*3;canvas.height=H;
 const c=canvas.getContext('2d');if(!c)throw new Error('Hero atlas Canvas2D unavailable');
 const texture=scene.textures.addCanvas(HERO_ATLAS_KEY,canvas);
 if(!texture)throw new Error('Hero atlas registration failed');
 HERO_DIRECTIONS.forEach((dir,d)=>{for(let p=0;p<3;p++){
  const x=(d*3+p)*W;frame(c,dir,p,x);
  texture.add(dir+'-'+p,0,x,0,W,H);
 }});
 texture.refresh();
}
export function makeHeroSprite(scene:Phaser.Scene):Phaser.GameObjects.Sprite{
 registerHeroAtlas(scene);
 const sprite=scene.add.sprite(0,-12,HERO_ATLAS_KEY,'s-0').setOrigin(.5,.9);
 if(sprite.frame.width===40)sprite.setScale(2);
 return sprite;
}
