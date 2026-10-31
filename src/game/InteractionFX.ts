import Phaser from 'phaser';
export function floatingReward(scene:Phaser.Scene,x:number,y:number,label:string,color='#fff4b7'){
 const text=scene.add.text(x,y-85,label,{fontFamily:'sans-serif',fontSize:'25px',fontStyle:'bold',color,stroke:'#3e5944',strokeThickness:5}).setOrigin(.5).setDepth(2500);
 scene.tweens.add({targets:text,y:y-145,alpha:0,scale:1.18,duration:850,ease:'Cubic.easeOut',onComplete:()=>text.destroy()});
}
export function interactionBurst(scene:Phaser.Scene,x:number,y:number,kind:'harvest'|'plant'|'water'|'brew'|'coin'){
 const colors={harvest:[0xc74e4d,0xf1cb76,0x79bd75],plant:[0x79c47b,0xf3dd9c],water:[0x8ad4f0,0xc3f2ff],brew:[0xfff0c0,0xc29c66],coin:[0xffda65,0xf5aa4e]}[kind];
 const count=kind==='brew'?12:8;
 for(let i=0;i<count;i++){
  const a=(i/count)*Math.PI*2;
  const distance=28+(i%3)*15;
  const particle=scene.add.circle(x,y-28,3+i%3,colors[i%colors.length],.9).setDepth(2400);
  scene.tweens.add({targets:particle,x:x+Math.cos(a)*distance,y:y-28+Math.sin(a)*distance-22,alpha:0,scale:.25,duration:500+i%4*65,ease:'Cubic.easeOut',onComplete:()=>particle.destroy()});
 }
}
export function brewProgress(scene:Phaser.Scene,x:number,y:number,duration:number,onDone:()=>void){
 const bg=scene.add.rectangle(x,y-120,142,16,0x4d3d32,.85).setDepth(2400);
 const bar=scene.add.rectangle(x-67,y-120,0,10,0xf4d28a).setOrigin(0,.5).setDepth(2401);
 const label=scene.add.text(x,y-150,'☕ Đang pha...', {fontFamily:'sans-serif',fontSize:'20px',color:'#fff5cf',stroke:'#503e30',strokeThickness:4}).setOrigin(.5).setDepth(2401);
 scene.tweens.add({targets:bar,width:134,duration,ease:'Linear',onComplete:()=>{bg.destroy();bar.destroy();label.destroy();onDone();interactionBurst(scene,x,y,'brew')}});
}
