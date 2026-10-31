import Phaser from 'phaser';

/** Decorative atlas: one texture, reused across zones and scene switches. */
export const PROP_ATLAS_KEY='coffee-props-v063';
export const PROP_FRAMES=['shrub','flowerpot','coffee-sack','crate','lantern','coffee-cup'] as const;
const W=96,H=112;
const oval=(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string)=>{
 c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();
};
const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string,r=0)=>{
 c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();
};
function paint(c:CanvasRenderingContext2D,index:number,x:number){
 c.save();c.translate(x+48,0);
 oval(c,0,99,34,9,'rgba(42,46,33,.22)');
 if(index===0){
  rect(c,-17,78,34,22,'#af7554',5);
  for(const [dx,dy,r,col] of [[-19,65,23,'#4e995d'],[16,60,25,'#70b96a'],[0,45,27,'#4a9b61'],[-4,29,16,'#89c978']] as const)oval(c,dx,dy,r,r*.78,col);
  for(const [dx,dy] of [[-21,58],[14,43],[0,33]])oval(c,dx,dy,4,5,'#f3d28c');
 }else if(index===1){
  rect(c,-22,71,44,28,'#bf7659',6);rect(c,-26,70,52,8,'#e1a076',3);
  for(let i=0;i<5;i++){const dx=(i-2)*10;rect(c,dx-2,33+(i%2)*10,4,40,'#4c8b54',2);oval(c,dx,32+(i%2)*10,10,15,i%2?'#edb3a6':'#ffe0a2')}
 }else if(index===2){
  rect(c,-27,33,54,66,'#c8a57b',14);rect(c,-23,39,46,51,'#e7c89a',12);
  c.strokeStyle='#8e6b4b';c.lineWidth=4;c.beginPath();c.moveTo(-22,43);c.quadraticCurveTo(0,54,22,43);c.stroke();
  oval(c,0,68,13,18,'#835d40');oval(c,0,66,9,13,'#b08054');
 }else if(index===3){
  rect(c,-30,47,60,51,'#865c43',6);rect(c,-26,51,52,43,'#d1a36b',3);
  rect(c,-2,51,5,43,'#986d4c');rect(c,-26,70,52,5,'#986d4c');
  rect(c,-30,43,60,8,'#f0c18a',3);
 }else if(index===4){
  rect(c,-3,5,6,31,'#624d3c',3);
  oval(c,0,54,23,29,'rgba(255,215,138,.3)');
  rect(c,-19,32,38,44,'#d99b65',12);
  rect(c,-14,37,28,34,'#ffe2a0',8);
  rect(c,-22,32,44,6,'#805a47',3);rect(c,-22,71,44,6,'#805a47',3);
 }else{
  oval(c,0,88,35,9,'#d7b58b');
  rect(c,-24,50,48,35,'#f6e9ce',9);
  oval(c,0,52,24,9,'#fff8e6');oval(c,0,52,17,6,'#a26843');
  c.strokeStyle='#f6e9ce';c.lineWidth=8;c.beginPath();c.arc(24,64,11,-Math.PI/2,Math.PI/2);c.stroke();
  oval(c,0,51,8,3,'#f5d6a8');
 }
 // Inked accents, highlights and tiny craftsmanship details on each object.
 if(index===0){for(let i=0;i<9;i++){const a=i*2.4;oval(c,Math.cos(a)*23,48+Math.sin(a)*16,5,3,i%2?'#a5d982':'#386d4d')}}
 if(index===1){for(let i=0;i<5;i++)oval(c,(i-2)*10,31+(i%2)*10,3,5,'#fff3ca');rect(c,-15,83,30,3,'#f5c59c',1)}
 if(index===2){for(let i=0;i<7;i++)rect(c,-18+i*6,48+(i%2)*3,2,3,'rgba(111,74,44,.35)',1);oval(c,0,69,4,8,'#dfad79')}
 if(index===3){for(let i=0;i<4;i++){rect(c,-21+i*14,58,2,31,'#efc68d',1);oval(c,-20+i*14,76,2,2,'#76523e')}}
 if(index===4){for(let i=0;i<5;i++)oval(c,(i-2)*6,47+(i%2)*7,2,4,'rgba(255,250,209,.8)')}
 if(index===5){oval(c,-10,55,8,2,'#fff6e9');oval(c,8,59,5,2,'#f5d9aa')}
 c.restore();
}
export function registerPropAtlas(scene:Phaser.Scene):void{
 if(scene.textures.exists(PROP_ATLAS_KEY)){
  const tex=scene.textures.get(PROP_ATLAS_KEY);
  const fw=tex.source[0].width/PROP_FRAMES.length,fh=tex.source[0].height;
  PROP_FRAMES.forEach((name,i)=>{if(!tex.has(name))tex.add(name,0,i*fw,0,fw,fh)});
  return;
 }
 const canvas=document.createElement('canvas');canvas.width=W*PROP_FRAMES.length;canvas.height=H;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Prop atlas requires Canvas2D');
 PROP_FRAMES.forEach((_,i)=>paint(ctx,i,i*W));
 const tex=scene.textures.addCanvas(PROP_ATLAS_KEY,canvas);
 if(!tex)throw new Error('Prop atlas registration failed');
 PROP_FRAMES.forEach((name,i)=>tex.add(name,0,i*W,0,W,H));
 tex.refresh();
}
export function placeProps(scene:Phaser.Scene,zone:'farm'|'cafe'):void{
 registerPropAtlas(scene);
 const layout: {x:number;y:number;frame:typeof PROP_FRAMES[number];scale?:number}[]=zone==='farm'?
 [
  {x:80,y:330,frame:'flowerpot'},{x:75,y:690,frame:'shrub'},{x:530,y:120,frame:'shrub'},
  {x:1020,y:150,frame:'flowerpot'},{x:1470,y:520,frame:'coffee-sack'},
  {x:1290,y:515,frame:'crate'},{x:1450,y:330,frame:'lantern'},
  {x:1030,y:900,frame:'shrub'},{x:400,y:900,frame:'flowerpot'}
 ]:[
  {x:105,y:300,frame:'flowerpot'},{x:1500,y:310,frame:'flowerpot'},
  {x:155,y:900,frame:'shrub'},{x:1440,y:900,frame:'shrub'},
  {x:310,y:650,frame:'coffee-cup',scale:.65},{x:830,y:645,frame:'coffee-cup',scale:.65},
  {x:1350,y:645,frame:'coffee-cup',scale:.65},{x:1170,y:405,frame:'coffee-sack',scale:.8}
 ];
 for(const p of layout){
  const img=scene.add.image(p.x,p.y,PROP_ATLAS_KEY,p.frame).setOrigin(.5,.9);
  img.setScale((p.scale??1)*(img.frame.width===48?2:1)).setDepth(p.y-1);
 }
}
