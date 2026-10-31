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
 const back=dir==='n'||dir==='ne'||dir==='nw';
 const side=dir==='e'||dir==='w';
 const diagonal=dir.length===2;
 const sign=dir==='w'||dir==='sw'||dir==='nw'?-1:1;
 const swing=pose===0?0:pose===1?7:-7;
 c.save();c.translate(x+W/2,0);
 ellipse(c,0,103,23,6,'rgba(34,45,33,.2)');
 stroke(c,-11,80,-11+swing,99,12,color.outline);
 stroke(c,11,80,11-swing,99,12,color.outline);
 stroke(c,-11,80,-11+swing,98,8,color.trousers);
 stroke(c,11,80,11-swing,98,8,color.trousers);
 stroke(c,-20,56,-22-swing*.7,79,13,color.outline);
 stroke(c,20,56,22+swing*.7,79,13,color.outline);
 stroke(c,-20,56,-22-swing*.7,79,9,color.shirt);
 stroke(c,20,56,22+swing*.7,79,9,color.shirt);
 ellipse(c,0,64,23,28,color.outline);
 ellipse(c,0,63,20,25,color.shirt);
 // Shirt seam and small brass buttons keep the chibi readable at half scale.
 if(!back){stroke(c,-13,52,-7,76,2,'#6cb0ac');stroke(c,13,52,7,76,2,'#33767e')}
 if(!back){ellipse(c,0,70,13,19,color.apron);stroke(c,-13,58,13,58,3,'#c49c69');ellipse(c,0,69,3,3,'#d2a66d');stroke(c,-9,80,9,80,2,'#ddcba4')}
 else{stroke(c,-13,65,13,65,3,'#367b79')}
 const hx=side?sign*4:diagonal?sign*2:0;
 ellipse(c,hx,35,24,24,color.outline);
 ellipse(c,hx,36,21,21,back?color.hair:color.skin);
 if(!back){
  ellipse(c,hx,23,21,10,color.hair);
  if(side){
   ellipse(c,hx+sign*11,37,3,4,color.outline);
  }else{
   ellipse(c,hx-8,39,2.6,3,color.outline);
   ellipse(c,hx+8,39,2.6,3,color.outline);
   ellipse(c,hx-14,45,5,2,'#e8a3a0');
   ellipse(c,hx+14,45,5,2,'#e8a3a0');
  }
 }else{
  ellipse(c,hx,32,19,16,color.hair);
 }
 ellipse(c,hx,18,29,8,color.outline);
 ellipse(c,hx,17,27,6,color.hat);
 ellipse(c,hx,11,19,12,color.hat);
 ellipse(c,hx,10,5,3,'#5c9b73');
 ellipse(c,hx-8,11,4,2,'rgba(255,245,205,.65)');
 c.restore();
}
export function registerHeroAtlas(scene:Phaser.Scene):void{
 if(scene.textures.exists(HERO_ATLAS_KEY))return;
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
