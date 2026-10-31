import Phaser from 'phaser';

export type Direction='n'|'ne'|'e'|'se'|'s'|'sw'|'w'|'nw';
export type CharacterRig={root:Phaser.GameObjects.Container;face:Phaser.GameObjects.Container;leftLeg:Phaser.GameObjects.Rectangle;rightLeg:Phaser.GameObjects.Rectangle;leftArm:Phaser.GameObjects.Rectangle;rightArm:Phaser.GameObjects.Rectangle;shadow:Phaser.GameObjects.Ellipse;direction:Direction;phase:number;walking:boolean;actionUntil:number};
const TAU=Math.PI*2;
export function directionFromVector(dx:number,dy:number):Direction{
 const angle=(Math.atan2(dy,dx)+TAU)%TAU;
 const dirs:Direction[]=['e','se','s','sw','w','nw','n','ne'];
 return dirs[Math.round(angle/(Math.PI/4))%8];
}
export function createCharacter(scene:Phaser.Scene,x:number,y:number,shirt:number):CharacterRig{
 const shadow=scene.add.ellipse(0,24,46,16,0x1e3529,.28);
 const leftLeg=scene.add.rectangle(-9,12,13,30,0x4c4b65).setOrigin(.5,.3);
 const rightLeg=scene.add.rectangle(9,12,13,30,0x45445b).setOrigin(.5,.3);
 const leftArm=scene.add.rectangle(-22,-10,13,34,shirt).setOrigin(.5,.2);
 const rightArm=scene.add.rectangle(22,-10,13,34,shirt).setOrigin(.5,.2);
 const torso=scene.add.ellipse(0,-13,43,47,shirt);
 const apron=scene.add.rectangle(0,-6,25,31,0xf5e2b8);
 const neck=scene.add.rectangle(0,-39,17,15,0xe9b78d);
 const head=scene.add.ellipse(0,-53,46,44,0xffd4aa);
 const ears=[scene.add.circle(-22,-53,6,0xf0ba95),scene.add.circle(22,-53,6,0xf0ba95)];
 const hair=scene.add.ellipse(0,-70,47,21,0x4b332d);
 const eyes=scene.add.container(0,-53,[scene.add.circle(-9,0,2.8,0x382b30),scene.add.circle(9,0,2.8,0x382b30)]);
 const blush=scene.add.container(0,-47,[scene.add.ellipse(-17,0,9,4,0xe9a5a4,.65),scene.add.ellipse(17,0,9,4,0xe9a5a4,.65)]);
 const face=scene.add.container(0,0,[head,...ears,hair,eyes,blush]);
 const hatBrim=scene.add.ellipse(0,-78,60,15,0xf4c46d);
 const hatCrown=scene.add.ellipse(0,-85,39,24,0xe3a85c);
 const hatBadge=scene.add.circle(0,-88,5,0x5c9867);
 const root=scene.add.container(x,y,[shadow,leftLeg,rightLeg,leftArm,rightArm,torso,apron,neck,face,hatBrim,hatCrown,hatBadge]);
 root.setDepth(y+10);
 return {root,face,leftLeg,rightLeg,leftArm,rightArm,shadow,direction:'s',phase:0,walking:false,actionUntil:0};
}
export function updateCharacter(rig:CharacterRig,dx:number,dy:number,delta:number,now:number):void{
 const walking=Math.hypot(dx,dy)>0.01;
 if(walking)rig.direction=directionFromVector(dx,dy);
 rig.walking=walking;
 const diagonal=rig.direction.length===2;
 const back=rig.direction==='n'||rig.direction==='ne'||rig.direction==='nw';
 const west=rig.direction==='w'||rig.direction==='sw'||rig.direction==='nw';
 const east=rig.direction==='e'||rig.direction==='se'||rig.direction==='ne';
 const lookingX=west?-1:east?1:0;
 rig.face.setScale(diagonal?.94:1,1);
 rig.face.x=lookingX*4;
 rig.face.setAlpha(back?.9:1);
 rig.phase+=delta*(walking?.014:.003);
 const swing=walking?Math.sin(rig.phase)*24:0;
 const working=now<rig.actionUntil;
 rig.leftLeg.angle=swing;
 rig.rightLeg.angle=-swing;
 rig.leftArm.angle=working?-48:-swing*.7;
 rig.rightArm.angle=working?48:swing*.7;
 rig.root.y+=0; // World scene owns position.
 rig.root.setScale(1,walking?1+Math.abs(Math.sin(rig.phase))*.018:1+Math.sin(rig.phase)*.008);
 rig.shadow.setScale(walking?1.05:1,.9);
}
export function playAction(rig:CharacterRig,now:number,duration=500){rig.actionUntil=now+duration}
