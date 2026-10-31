import Phaser from 'phaser';
import {makeHeroSprite,type HeroDirection} from './HeroAtlas';

export type Direction=HeroDirection;
export type CharacterRig={
 root:Phaser.GameObjects.Container;
 sprite:Phaser.GameObjects.Sprite;
 direction:Direction;
 phase:number;
 walking:boolean;
 actionUntil:number;
 lastFrame:string;
};
const TAU=Math.PI*2;
export function directionFromVector(dx:number,dy:number):Direction{
 const angle=(Math.atan2(dy,dx)+TAU)%TAU;
 const dirs:Direction[]=['e','se','s','sw','w','nw','n','ne'];
 return dirs[Math.round(angle/(Math.PI/4))%8];
}
export function createCharacter(scene:Phaser.Scene,x:number,y:number,_shirt:number):CharacterRig{
 const sprite=makeHeroSprite(scene);
 const root=scene.add.container(x,y,[sprite]).setDepth(y+10);
 return {root,sprite,direction:'s',phase:0,walking:false,actionUntil:0,lastFrame:'s-0'};
}
export function updateCharacter(rig:CharacterRig,dx:number,dy:number,delta:number,now:number):void{
 const walking=Math.hypot(dx,dy)>0.01;
 if(walking)rig.direction=directionFromVector(dx,dy);
 rig.walking=walking;
 rig.phase+=delta*(walking?.012:0);
 const working=now<rig.actionUntil;
 const pose=working?1:walking?(Math.floor(rig.phase)%2===0?1:2):0;
 const frame=rig.direction+'-'+pose;
 if(frame!==rig.lastFrame){rig.sprite.setFrame(frame);rig.lastFrame=frame}
}
export function playAction(rig:CharacterRig,now:number,duration=500):void{rig.actionUntil=now+duration}
