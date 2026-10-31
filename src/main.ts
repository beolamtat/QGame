import Phaser from 'phaser';
import './style.css';
import {createWorldMap} from './game/WorldMap';
import {decorateWorld} from './game/WorldArt';
import {createCharacter,updateCharacter,playAction,type CharacterRig} from './game/CharacterAnimation';
import {floatingReward,interactionBurst,brewProgress} from './game/InteractionFX';
import {load,persist,grow,plant,water,harvest,roast,brew,serve,upgrade,restock,newOrder,RECIPES,type RecipeId,type Order,type State} from './game/Economy';

const state:State=load();
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<div id="game"></div><div id="hud"><div id="top"><span>☕ COFFEE WORLD · LV <b id="level">1</b></span><span id="stats"></span></div><div id="toast"></div><div id="orders" class="panel"></div><div id="bottom"><span class="panel" id="help">Chạm để di chuyển và tương tác</span><div id="controls"><button id="map-open">🌏 Bản đồ</button><button id="extra">Nâng cấp</button><button id="action">Đến quán ☕</button></div></div></div>`;
const el=(id:string)=>document.getElementById(id)!;
const stats=el('stats'),toastEl=el('toast'),ordersEl=el('orders'),help=el('help'),action=el('action') as HTMLButtonElement,extra=el('extra') as HTMLButtonElement;
let toastTimer=0;
function toast(msg:string){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>toastEl.classList.remove('show'),2200)}
function sync(){el('level').textContent=String(state.level);stats.textContent=`🪙 ${state.coins}  🫘 ${state.beans}  🔥 ${state.roasted}  ☕ ${state.drinks}  🥛 ${state.milk}  🍫 ${state.chocolate}`;persist(state)}
type Zone='farm'|'cafe';
type Interact={x:number,y:number,kind:'plot'|'roaster'|'counter'|'customer',index?:number};
class World extends Phaser.Scene{
  player!:Phaser.GameObjects.Container;
  hero!:CharacterRig;
  target?:Phaser.Math.Vector2;
  pending?:Interact;
  zone:Zone='farm';
  objects:Interact[]=[];
  visuals:Phaser.GameObjects.Container[]=[];
  customerActors:{order:Order,actor:Phaser.GameObjects.Container,homeX:number,homeY:number}[]=[];
  busy=false;
  lastOrders=0;
  mapOpen=false;
  constructor(){super('world')}
  create(){
    this.drawZone('farm');
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(this.mapOpen||this.busy)return;
      const pos=this.cameras.main.getWorldPoint(p.x,p.y);
      const near=this.objects.filter(o=>Phaser.Math.Distance.Between(o.x,o.y,pos.x,pos.y)<110).sort((a,b)=>Phaser.Math.Distance.Between(a.x,a.y,pos.x,pos.y)-Phaser.Math.Distance.Between(b.x,b.y,pos.x,pos.y))[0];
      this.pending=near;
      const x=near?near.x:pos.x,y=near?near.y:pos.y;
      this.target=new Phaser.Math.Vector2(Phaser.Math.Clamp(x,45,1555),Phaser.Math.Clamp(y,175,940));
    });
    action.onclick=()=>{if(this.busy){toast('Đang pha chế, vui lòng đợi');return}this.drawZone(this.zone==='farm'?'cafe':'farm')};
    extra.onclick=()=>{if(this.zone==='farm'){if(roast(state)){toast('Đã rang 3 hạt cà phê 🔥')}else toast('Cần 3 hạt cà phê tươi')}else{if(upgrade(state)){toast('Quán lên cấp '+state.level+'! ✨')}else toast('Cần '+100*state.level+' xu để nâng cấp')}sync()};
    this.scale.on('resize',()=>this.adjustCamera());
    this.adjustCamera();
  }
  adjustCamera(){if(!this.player)return;this.cameras.main.setZoom(Math.min(this.scale.width/900,this.scale.height/560)*1.12);this.cameras.main.startFollow(this.player,true,.09,.09);this.cameras.main.setBounds(0,0,1600,1000)}
  circle(x:number,y:number,r:number,c:number){return this.add.circle(x,y,r,c)}
  rect(x:number,y:number,w:number,h:number,c:number){return this.add.rectangle(x,y,w,h,c)}
  makePerson(x:number,y:number,color:number){const shadow=this.add.ellipse(0,22,44,16,0x273b2e,.3),legs=this.rect(0,11,24,24,0x443c50),body=this.rect(0,-13,34,40,color),face=this.circle(0,-44,22,0xffd4a4),hair=this.add.ellipse(0,-61,46,24,0x4b322e),hat=this.add.ellipse(0,-72,58,14,0xd5a65b),eyes=this.add.text(-11,-48,'• •',{fontSize:'13px',color:'#30231d'});return this.add.container(x,y,[shadow,legs,body,face,hair,hat,eyes]).setDepth(y)}
  drawZone(zone:Zone){
    this.tweens.killAll();this.time.removeAllEvents();this.children.removeAll(true);
    this.zone=zone;this.target=undefined;this.pending=undefined;this.objects=[];this.visuals=[];this.customerActors=[];this.busy=false;
    this.rect(800,500,1600,1000,zone==='farm'?0x9dd49c:0xcba66e).setDepth(-1000);
    decorateWorld(this,zone);
    if(zone==='farm'){
      for(let i=0;i<12;i++){
        const x=170+(i%4)*145+(i%4>=2?225:0),y=240+Math.floor(i/4)*205;
        this.objects.push({x,y,kind:'plot',index:i});
        const label=this.add.text(0,-90,'',{fontSize:'19px',color:'#fff3cb',backgroundColor:'#365c45',padding:{x:6,y:3}}).setOrigin(.5);
        const leaves=this.circle(0,-35,35,0x3c9756),fruit=this.add.text(-26,-57,'🔴 🔴',{fontSize:'17px'});
        const ground=this.add.ellipse(0,15,95,42,0x80573e,.7);
        const obj=this.add.container(x,y,[ground,leaves,fruit,label]).setDepth(y);
        this.visuals.push(obj);
      }
      this.objects.push({x:1380,y:300,kind:'roaster'});
      this.add.text(1280,280,'🔥 LÒ RANG',{fontSize:'24px',color:'#fff3c7',backgroundColor:'#704b36'}).setDepth(400);
      help.textContent='Cây: trồng → tưới → thu hoạch · Chạm lò rang hoặc nút Rang';
      extra.textContent='🔥 Rang 3 hạt';
    }else{
      this.objects.push({x:750,y:410,kind:'counter'});
      this.add.text(570,350,'☕ QUẦY PHA CHẾ',{fontSize:'28px',color:'#fff4c7',backgroundColor:'#704b36'}).setDepth(400);
      help.textContent='Chạm quầy pha theo đơn · Chạm khách giao đồ · Nâng cấp quán';
      extra.textContent='⬆ Nâng cấp';
      if(state.orders.length===0)newOrder(state);
      this.refreshCustomers();
    }
    this.hero=createCharacter(this,800,750,0x367f9b);
    this.player=this.hero.root;
    this.adjustCamera();
    action.textContent=zone==='farm'?'Đến quán ☕':'Về nông trại 🌱';
    this.refreshVisuals();sync();
  }
  refreshCustomers(){
    for(const c of this.customerActors){this.tweens.killTweensOf(c.actor);c.actor.destroy()}
    this.customerActors=[];
    this.objects=this.objects.filter(o=>o.kind!=='customer');
    state.orders.forEach((order,i)=>{
      const x=380+i*230,y=790;
      const actor=this.makePerson(x,y,([0xbd668c,0x7687b4,0x78a45e,0xc58a55][i%4]));
      const nameplate=this.add.text(0,-112,RECIPES[order.recipe].name,{fontSize:'19px',color:'#fff',backgroundColor:'#76513c',padding:{x:5,y:3}});actor.add(nameplate);
      this.customerActors.push({order,actor,homeX:x,homeY:y});
      this.objects.push({x,y,kind:'customer',index:order.id});
      this.tweens.add({targets:actor,x:x+16,duration:1200+i*100,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    });
  }
  refreshVisuals(){
    if(this.zone!=='farm')return;
    const before=state.plots.filter(p=>p.stage==='ripe').length;
    grow(state);
    if(state.plots.filter(p=>p.stage==='ripe').length!==before)sync();
    state.plots.forEach((p,i)=>{
      const o=this.visuals[i];if(!o)return;
      const leaves=o.list[1] as Phaser.GameObjects.Arc;
      const fruit=o.list[2] as Phaser.GameObjects.Text;
      const label=o.list[3] as Phaser.GameObjects.Text;
      leaves.setFillStyle(p.stage==='empty'?0x91633e:p.stage==='seed'?0x86a94f:p.stage==='growing'?0x5ba96c:0x358a4e);
      leaves.setScale(p.stage==='empty'?.25:p.stage==='seed'?.45:p.stage==='growing'?.75:1);
      fruit.setVisible(p.stage==='ripe');
      label.setText(p.stage==='empty'?'🌱 Trồng':p.stage==='seed'?'💧 Tưới':p.stage==='growing'?'⏳ Đang lớn':'🫘 Thu hoạch');
    });
  }
  update(time:number,delta:number){
    if(this.zone==='farm'&&Math.floor(time/500)!==Math.floor((time-delta)/500)){this.refreshVisuals()}
    if(this.zone==='cafe'){
      const before=state.orders.length;
      state.orders=state.orders.filter(o=>o.expiresAt>Date.now());
      if(before!==state.orders.length){toast('Một khách đã rời quán!');this.refreshCustomers();sync()}
      if(time-this.lastOrders>18000){this.lastOrders=time;if(newOrder(state)){this.refreshCustomers();sync()}}
    }
    if(!this.target||this.busy||this.mapOpen){updateCharacter(this.hero,0,0,delta,time);return;}
    const dx=this.target.x-this.player.x,dy=this.target.y-this.player.y,d=Math.hypot(dx,dy),step=Math.min(d,delta*.23);
    if(d>56){this.player.x+=dx/d*step;this.player.y+=dy/d*step;this.player.setDepth(this.player.y+10);updateCharacter(this.hero,dx,dy,delta,time)}
    else{this.target=undefined;updateCharacter(this.hero,0,0,delta,time);if(this.pending){const obj=this.pending;this.pending=undefined;this.interact(obj)}}
  }
  interact(obj:Interact){
    if(this.busy)return;
    playAction(this.hero,this.time.now,550);
    if(obj.kind==='plot'){
      const i=obj.index!;const p=state.plots[i];
      if(p.stage==='empty'){if(plant(state,i)){toast('Đã gieo hạt (-3 xu) 🌱');interactionBurst(this,obj.x,obj.y,'plant')}else toast('Không đủ 3 xu')}
      else if(p.stage==='seed'){if(water(state,i)){toast('Đã tưới! Chờ cây lớn 💧');interactionBurst(this,obj.x,obj.y,'water')}else toast('Chưa thể tưới')}
      else if(p.stage==='ripe'){if(harvest(state,i)){toast('+3 hạt cà phê 🫘');interactionBurst(this,obj.x,obj.y,'harvest');floatingReward(this,obj.x,obj.y,'+3 🫘')}else toast('Chưa thu hoạch được')}
      else toast('Cây đang phát triển ⏳');
      this.refreshVisuals();sync();
    }else if(obj.kind==='roaster'){if(roast(state)){toast('Đã rang 3 hạt 🔥');interactionBurst(this,obj.x,obj.y,'brew');floatingReward(this,obj.x,obj.y,'+3 🔥')}else toast('Cần 3 hạt tươi');sync()}
    else if(obj.kind==='counter'){
      const order=state.orders[0];if(!order){toast('Chưa có đơn hàng');return}
      if(!brew(state,order.recipe)){toast('Thiếu hạt rang, sữa hoặc sô-cô-la');return}
      this.busy=true;toast('Đang pha '+RECIPES[order.recipe].name+'...');
      brewProgress(this,obj.x,obj.y,RECIPES[order.recipe].brewMs,()=>{state.prepared.push(order.recipe);state.drinks=state.prepared.length;this.busy=false;toast('Đã pha '+RECIPES[order.recipe].name+'! ☕');floatingReward(this,obj.x,obj.y,'☕ '+RECIPES[order.recipe].name);sync()});sync();
    }else if(obj.kind==='customer'){
      const order=state.orders.find(o=>o.id===obj.index);if(!order)return;
      if(serve(state,order)){const reward=RECIPES[order.recipe].price+5*(state.level-1);toast('Đã phục vụ '+RECIPES[order.recipe].name+'! +'+reward+' xu');interactionBurst(this,obj.x,obj.y,'coin');floatingReward(this,obj.x,obj.y,'+'+reward+' 🪙');this.refreshCustomers()}
      else toast('Chưa pha đúng món '+RECIPES[order.recipe].name+' hoặc khách đã rời quán');sync();
    }
  }
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:540,backgroundColor:'#9bd4a0',scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:false,antialias:true},scene:[World]});
const refreshOrders=()=>{if(!game.scene.isActive('world'))return;const scene=game.scene.getScene('world') as World;ordersEl.style.display=scene.zone==='cafe'?'block':'none';ordersEl.innerHTML=scene.zone==='cafe'?`📋 ĐƠN HÀNG <small>(còn ${state.orders.length})</small><div>${state.orders.map(o=>`<span>${RECIPES[o.recipe].name} · ${Math.max(0,Math.ceil((o.expiresAt-Date.now())/1000))}s</span>`).join('')}</div><button id="restock">🥛 Nhập nguyên liệu · 20 xu</button>`:'';const btn=document.querySelector<HTMLButtonElement>('#restock');if(btn)btn.onclick=()=>{toast(restock(state)?'Đã mua sữa và sô-cô-la':'Không đủ 20 xu');sync()}};
const worldMap=createWorldMap(state,sync,toast,open=>{const scene=game.scene.getScene('world') as World;scene.mapOpen=open;if(open){scene.target=undefined;scene.pending=undefined}});
(document.getElementById('map-open') as HTMLButtonElement).onclick=()=>worldMap.open();
window.setInterval(()=>{refreshOrders();worldMap.refresh()},1000);sync();
