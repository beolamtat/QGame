import Phaser from 'phaser';
import {RECIPES} from './Economy';

/** Reusable canvas atlas for labels that previously allocated one Phaser.Text per object. */
export const LABEL_ATLAS_KEY='coffee-labels-v064';
export const PLOT_LABEL_FRAMES=['empty','seed','growing','ripe'] as const;
const LABELS=[
 ['empty','🌱 Trồng'],
 ['seed','💧 Tưới'],
 ['growing','⏳ Đang lớn'],
 ['ripe','🫘 Thu hoạch'],
 ...Object.entries(RECIPES).map(([id,r])=>['recipe-'+id,r.name] as [string,string])
] as [string,string][];
const W=220,H=42;
export function registerLabelAtlas(scene:Phaser.Scene):void{
 if(scene.textures.exists(LABEL_ATLAS_KEY))return;
 const canvas=document.createElement('canvas');canvas.width=W*LABELS.length;canvas.height=H;
 const c=canvas.getContext('2d');if(!c)throw new Error('Label atlas Canvas2D unavailable');
 LABELS.forEach(([_,value],i)=>{
  const x=i*W;
  c.fillStyle='#365c45';c.beginPath();c.roundRect(x+1,2,W-2,H-4,8);c.fill();
  c.fillStyle='#fff3cb';c.font='bold 19px system-ui, sans-serif';c.textAlign='center';c.textBaseline='middle';
  c.fillText(value,x+W/2,H/2,W-18);
 });
 const texture=scene.textures.addCanvas(LABEL_ATLAS_KEY,canvas);
 if(!texture)throw new Error('Label atlas registration failed');
 LABELS.forEach(([name],i)=>texture.add(name,0,i*W,0,W,H));
 texture.refresh();
}
export function plotLabel(scene:Phaser.Scene):Phaser.GameObjects.Image{
 registerLabelAtlas(scene);
 return scene.add.image(0,-90,LABEL_ATLAS_KEY,'empty').setOrigin(.5);
}
export function recipeLabel(scene:Phaser.Scene,id:string):Phaser.GameObjects.Image{
 registerLabelAtlas(scene);
 return scene.add.image(0,-112,LABEL_ATLAS_KEY,'recipe-'+id).setOrigin(.5);
}

export function zoneSign(scene:Phaser.Scene,zone:'farm'|'cafe',x:number,y:number):Phaser.GameObjects.Image{
 registerLabelAtlas(scene);
 return scene.add.image(x,y,LABEL_ATLAS_KEY,zone+'-sign').setOrigin(.5).setDepth(400);
}
