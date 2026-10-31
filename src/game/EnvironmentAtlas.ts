import Phaser from 'phaser';

/** v0.6.5 art-directed static scene plates. Each zone is one shared texture.
 * No per-frame canvas drawing, DOM images or scene-transition allocations.
 * World coordinates and gameplay hit areas stay 1600x1000.
 */
export const ENV_KEY={farm:'coffee-environment-farm-v065',cafe:'coffee-environment-cafe-v065'} as const;
const W=1600,H=1000;
type C=CanvasRenderingContext2D;
function rr(c:C,x:number,y:number,w:number,h:number,r:number,color:string){
 c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();
}
function oval(c:C,x:number,y:number,rx:number,ry:number,color:string){
 c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();
}
function line(c:C,x:number,y:number,xx:number,yy:number,color:string,width=3){
 c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();
}
function farm(c:C){
 const ground=c.createLinearGradient(0,0,W,H);ground.addColorStop(0,'#c0df9d');ground.addColorStop(.55,'#9ecb83');ground.addColorStop(1,'#74a56d');c.fillStyle=ground;c.fillRect(0,0,W,H);
 // Soft sun patches, farm soil and an intentionally uncluttered central walkable path.
 for(let i=0;i<26;i++){const x=(i*211+53)%W,y=(i*157+87)%H;oval(c,x,y,110,50,'rgba(249,240,169,.09)')}
 rr(c,692,-30,206,1080,36,'#c9ad79');rr(c,719,-30,152,1080,30,'#efdaa9');
 rr(c,65,854,1430,77,29,'#d1b483');rr(c,82,868,1390,45,22,'#f4dfb1');
 // Farming terraces deliberately aligned with existing 12 crop interaction points.
 for(let i=0;i<12;i++){
  const x=170+(i%4)*145+(i%4>=2?225:0),y=240+Math.floor(i/4)*205;
  oval(c,x,y+29,66,30,'rgba(43,69,31,.24)');
  rr(c,x-63,y-1,126,57,24,'#98734c');
  rr(c,x-59,y+2,118,44,20,'#6d503b');
  for(let j=0;j<4;j++)line(c,x-47,y+12+j*8,x+47,y+12+j*8,'rgba(204,159,103,.22)',2);
  oval(c,x,y+19,47,14,'#b18759');
 }
 // Pond, shoreline, highlights and reeds.
 oval(c,1230,751,237,142,'#66946b');oval(c,1230,743,221,126,'#e4d59e');
 oval(c,1230,741,205,111,'#5dabb0');oval(c,1221,729,187,91,'#7bd0c6');
 for(let i=0;i<10;i++){const x=1105+i*28;line(c,x,713+i%3*16,x+28,709+i%3*16,'rgba(237,255,239,.6)',3)}
 for(let i=0;i<15;i++){const x=1028+i*28;line(c,x,833+(i%3)*6,x+4,808+(i%3)*6,'#4e8852',3)}
 // Roasting workshop with layered roof and wooden awning.
 rr(c,1260,91,300,191,18,'#6f4d40');
 rr(c,1278,115,266,142,13,'#e4bf87');
 rr(c,1369,172,73,84,6,'#80553e');
 for(let i=0;i<6;i++)line(c,1285+i*43,118,1285+i*43,252,'rgba(124,77,48,.22)',3);
 c.fillStyle='#9b534b';c.beginPath();c.moveTo(1217,136);c.lineTo(1408,26);c.lineTo(1592,136);c.closePath();c.fill();
 line(c,1219,137,1590,137,'#e8bd7d',10);
 // Perimeter fence and meadow texture.
 for(const x of [43,1561])for(let y=82;y<955;y+=49){rr(c,x,y,14,40,4,'#e9c992');rr(c,x-4,y+13,23,6,2,'#ae7951')}
 for(let i=0;i<180;i++){
  const x=(i*137+29)%1560+20,y=(i*191+71)%880+40;
  if(x>670&&x<915||x>1020&&y>630&&y<875)continue;
  oval(c,x,y,i%5===0?4:2,i%5===0?4:2,['#fff1c7','#e8acb1','#f8e5a3','#77b16d'][i%4]);
  if(i%4===0)line(c,x,y+5,x+3,y-4,'rgba(71,125,67,.6)',2);
 }
 // Path edging and subtle ambient shadows.
 line(c,694,5,694,975,'rgba(117,94,58,.28)',7);
 line(c,897,5,897,975,'rgba(255,251,218,.4)',6);
}
function cafe(c:C){
 const floor=c.createLinearGradient(0,0,W,H);floor.addColorStop(0,'#f1d9a9');floor.addColorStop(1,'#c69b74');c.fillStyle=floor;c.fillRect(0,0,W,H);
 for(let y=175;y<H;y+=84)for(let x=0;x<W;x+=84){
  rr(c,x+3,y+3,78,78,7,(x+y)%3===0?'rgba(255,239,207,.2)':'rgba(143,102,67,.08)');
  line(c,x+3,y+81,x+81,y+81,'rgba(117,80,57,.12)',2);
 }
 rr(c,0,0,W,171,0,'#795b4c');rr(c,0,153,W,24,0,'#efcf97');
 for(const x of [175,580,990,1400]){
  rr(c,x-77,23,154,119,14,'#b77f56');rr(c,x-67,32,134,99,9,'#527e78');
  rr(c,x-58,40,116,84,7,'#9ec9b7');
  line(c,x,34,x,130,'#d7ac77',7);
  oval(c,x-25,73,23,33,'rgba(255,250,201,.19)');
 }
 // Counter has strong silhouette and layered marble highlights.
 rr(c,354,201,846,192,20,'rgba(74,44,36,.23)');
 rr(c,368,195,820,173,19,'#6d4b3e');
 rr(c,344,173,866,48,13,'#edc58b');
 rr(c,357,176,838,16,7,'#ffe6ad');
 for(const x of [520,706,894]){
  rr(c,x-43,110,86,79,11,'#536b68');rr(c,x-32,121,64,31,6,'#b9ccc1');
  oval(c,x,168,10,10,'#333f40');line(c,x-24,189,x+24,189,'#d5a86e',5);
 }
 // Menu board.
 rr(c,1221,194,279,187,14,'#b98a59');rr(c,1231,204,259,167,10,'#354e43');
 for(let i=0;i<4;i++){rr(c,1256,227+i*32,162-i*10,6,3,'#d6c39b');oval(c,1450,230+i*32,8,8,'#e4a86d')}
 // Pendant lighting.
 for(const x of [322,801,1290]){
  line(c,x,0,x,74,'#644b3f',5);oval(c,x,88,44,24,'#a97554');oval(c,x,91,36,15,'#ffe5a5');
  oval(c,x,115,78,27,'rgba(255,235,174,.13)');
 }
 // Cozy seating groups with chairs, wood rims, shadows, cups.
 for(const x of [250,500,750,1000,1250]){
  oval(c,x,703,115,33,'rgba(69,49,39,.16)');
  for(const dx of [-85,85]){
   rr(c,x+dx-25,576,50,78,10,'#9c674d');
   rr(c,x+dx-20,584,40,48,8,'#d9a87b');
  }
  oval(c,x,650,80,50,'#765340');oval(c,x,636,76,43,'#e5bd8b');
  oval(c,x+17,632,17,15,'#fff2d7');oval(c,x+17,632,12,10,'#9b6542');
  oval(c,x+17,632,6,3,'#f0d8aa');
 }
 // Welcome rug at the lower edge, leaves room for existing customers.
 rr(c,480,906,650,69,22,'#7c9e83');rr(c,494,917,622,46,16,'#a8c6a0');
}
export function registerEnvironment(scene:Phaser.Scene,zone:'farm'|'cafe'):void{
 const key=ENV_KEY[zone];if(scene.textures.exists(key))return;
 const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
 const c=canvas.getContext('2d');if(!c)throw new Error('Environment Canvas2D unavailable');
 if(zone==='farm')farm(c);else cafe(c);
 const tex=scene.textures.addCanvas(key,canvas);if(!tex)throw new Error('Environment texture unavailable');tex.refresh();
}
export function placeEnvironment(scene:Phaser.Scene,zone:'farm'|'cafe'):void{
 registerEnvironment(scene,zone);
 scene.add.image(W/2,H/2,ENV_KEY[zone]).setDepth(-700);
}
