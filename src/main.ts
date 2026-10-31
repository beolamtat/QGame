import Phaser from 'phaser';
import './style.css';
import {createWorldMap} from './game/WorldMap';
import {load,persist,grow,plant,water,harvest,roast,brew,serve,upgrade,restock,newOrder,RECIPES,type State,type Order} from './game/Economy';
import {loadStory,saveStory,advance,STORY,type Story,type Path} from './game/Story';

type Zone='farm'|'cafe'|'town';
type Hotspot={x:number,y:number,kind:'plot'|'roaster'|'counter'|'customer'|'npc'|'merchant'|'cultivate',index?:number};
const state:State=load();
let story:Story=loadStory();
let zone:Zone='farm';
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`
<div id="game" aria-label="Thế giới Coffee World"></div>
<div id="hud">
 <header id="top"><div class="identity"><div class="avatar">☕</div><div><strong>Coffee World</strong><small>Quảng · Cấp <b id="level">1</b></small><div class="xp"><i></i></div></div></div>
 <div class="currencies"><span>🪙 <b id="coins">0</b> <em>＋</em></span><span>💎 <b id="gems">1,250</b> <em>＋</em></span><span>⚡ <b id="energy">120/120</b> <em>＋</em></span></div><button id="map-open" class="minimap" aria-label="Mở bản đồ">🗺️<small id="zone-label">Nông trại</small></button></header>
 <aside class="quest panel"><div class="tabs"><button id="quest-tab" class="active">Nhiệm vụ</button><button id="daily-tab">Hàng ngày</button></div><div id="quest-content"></div></aside>
 <nav class="side-actions" aria-label="Tính năng"><button data-ui="bag">🎒<small>Túi đồ</small></button><button data-ui="skills">📖<small>Kỹ năng</small></button><button data-ui="workers">👥<small>Nhân viên</small></button><button data-ui="settings">⚙️<small>Quản lý</small></button></nav>
 <div id="toast" role="status" aria-live="polite"></div>
 <footer class="bottom-bar"><div id="quick-items"></div><nav class="navigation" aria-label="Chuyển khu vực"><button data-zone="farm">🌱<small>Nông trại</small></button><button data-zone="cafe">☕<small>Quán cà phê</small></button><button data-zone="town">🏮<small>Thị trấn</small></button><button id="world-nav">🌏<small>Bản đồ</small></button><button id="story-open">📜<small>Cốt truyện</small></button></nav></footer>
</div>
<div id="dialog" class="overlay" hidden><section class="dialog-card"><button id="dialog-close" class="close" aria-label="Đóng">✕</button><div class="dialog-badge">✦ Coffee World · Tu Tiên Cà Phê ✦</div><h1 id="dialog-title"></h1><div id="dialog-art"></div><h2 id="dialog-speaker"></h2><p id="dialog-text"></p><div id="path-choices" hidden><button data-path="balance">⚖️ Tu luyện & Kinh doanh</button><button data-path="cultivation">🔮 Chí tu luyện</button><button data-path="commerce">🪙 Chí kinh doanh</button></div><button id="dialog-next" class="primary">Tiếp tục</button></section></div>
<div id="drawer" class="overlay" hidden><section class="drawer-card"><button id="drawer-close" class="close">✕</button><h2 id="drawer-title"></h2><div id="drawer-body"></div></section></div>
`;
const el=(id:string)=>document.getElementById(id)!;
let timer=0, daily=false;
function toast(message:string){const node=el('toast');node.textContent=message;node.classList.add('visible');clearTimeout(timer);timer=window.setTimeout(()=>node.classList.remove('visible'),2300)}
function sync(){el('coins').textContent=state.coins.toLocaleString('vi-VN');el('level').textContent=String(state.level);persist(state);renderQuests();renderInventory()}
function renderQuests(){
 const done=state.harvested, served=state.served;
 el('quest-content').innerHTML=daily?
 `<div>🌱 Thu hoạch cà phê <small>(${Math.min(done,10)}/10)</small></div><div>☕ Phục vụ khách <small>(${Math.min(served,5)}/5)</small></div><div>🏮 Ghé thăm thị trấn <small>Khám phá NPC</small></div>`:
 zone==='farm'? `<div>🫘 Thu hoạch cà phê <small>Thu hoạch 10 cây (${Math.min(done,10)}/10)</small></div><div>🔥 Chế biến hạt <small>Rang 20 hạt (${Math.min(state.roasted,20)}/20)</small></div><div>🌿 Mở rộng nông trại <small>Nâng cấp để mở khóa</small></div>`:
 zone==='cafe'?`<div>☕ Phục vụ khách <small>Hoàn thành 15 đơn (${Math.min(served,15)}/15)</small></div><div>⚙️ Nâng cấp máy pha <small>Đạt cấp 2 (${Math.min(state.level,2)}/2)</small></div><div>⭐ Tăng danh tiếng <small>Phục vụ khách đúng món</small></div>`:
 `<div>🏮 Nói chuyện với thương nhân <small>Chạm vào NPC trên bản đồ</small></div><div>📦 Giao hàng cà phê <small>Đến bản đồ thế giới</small></div><div>🔮 Tu luyện linh khí <small>Gặp tiên sư trong thị trấn</small></div>`;
}
function renderInventory(){
 el('quick-items').innerHTML=(zone==='farm'?[`🫘 ${state.beans}`,`💧 Tưới`,`🪓 Trồng`,`🔥 ${state.roasted}`]:zone==='cafe'?[`☕ ${state.drinks}`,`🥛 ${state.milk}`,`🍫 ${state.chocolate}`,`📦 Nhập hàng`]:['🏮 NPC','🔮 Tu luyện','🪙 Giao thương','🗺️ Khám phá']).map((t,i)=>`<button data-slot="${i}">${t}</button>`).join('');
}
function drawer(title:string,html:string){el('drawer-title').textContent=title;el('drawer-body').innerHTML=html;el('drawer').hidden=false}
function showStory(){
 if(story.chapter==='complete'){drawer('Hành trình trùng sinh','Bạn đã nhận tiên duyên từ Ngũ Tiên và trở thành đệ tử của Linh Mộc. Hãy khám phá thị trấn, chăm sóc linh điền và xây dựng đế chế cà phê.');return}
 const chapter=STORY[story.chapter];
 el('dialog-title').textContent=chapter.title;el('dialog-speaker').textContent=chapter.speaker;el('dialog-text').textContent=chapter.text;
 el('dialog-art').textContent=story.chapter==='incident'?'🚑 🌙':story.chapter==='ascension'?'🧙‍♂️ ✨ 🧝‍♀️ ✨ 🧙‍♀️ ✨ 🧝‍♂️ ✨ 🧙‍♂️':'🌱 ☕ 🏮';
 el('dialog-next').textContent=chapter.button;
 el('path-choices').hidden=story.chapter!=='ascension';el('dialog').hidden=false;
}
function setZone(next:Zone){zone=next;el('zone-label').textContent=next==='farm'?'Nông trại':next==='cafe'?'Quán cà phê':'Thị trấn';document.querySelectorAll('[data-zone]').forEach(b=>b.classList.toggle('selected',(b as HTMLElement).dataset.zone===next));world.drawZone(next);sync()}
class World extends Phaser.Scene{
 hero!:Phaser.GameObjects.Container;target?:Phaser.Math.Vector2;pending?:Hotspot;hotspots:Hotspot[]=[];busy=false;mapOpen=false;
 constructor(){super('coffee-world')}
 create(){
  this.drawZone('farm');
  this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{
   if(this.busy||this.mapOpen||!el('dialog').hidden||!el('drawer').hidden)return;
   const pos=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
   const nearby=this.hotspots.filter(o=>Phaser.Math.Distance.Between(o.x,o.y,pos.x,pos.y)<95).sort((a,b)=>Phaser.Math.Distance.Between(a.x,a.y,pos.x,pos.y)-Phaser.Math.Distance.Between(b.x,b.y,pos.x,pos.y))[0];
   this.pending=nearby;
   this.target=new Phaser.Math.Vector2(Phaser.Math.Clamp(nearby?.x??pos.x,70,1530),Phaser.Math.Clamp(nearby?.y??pos.y,140,940));
  });
  this.scale.on('resize',()=>this.fitCamera());this.fitCamera();
 }
 drawZone(next:Zone){
  this.tweens.killAll();this.time.removeAllEvents();this.children.removeAll(true);this.hotspots=[];this.target=undefined;this.pending=undefined;this.busy=false;
  const g=this.add.graphics().setDepth(-200);
  const farm=next==='farm',cafe=next==='cafe';
  g.fillStyle(farm?0x83b970:cafe?0x9e704c:0x8fa58c);g.fillRect(0,0,1600,1000);
  // Isometric diamond tiles, consistent projection for all zones.
  for(let row=-5;row<18;row++)for(let col=-5;col<22;col++){
   const x=col*112+(row%2)*56,y=row*56;
   g.fillStyle((row+col)%3===0?(farm?0x9dc986:cafe?0xb88a62:0xb9b1a0):farm?0x92c37e:cafe?0xa87b57:0xa6a18d,.55);
   g.fillPoints([{x,y:y+56},{x:x+56,y:y+28},{x:x+112,y:y+56},{x:x+56,y:y+84}],true);
   g.lineStyle(1,0x463d2b,.10);g.strokePoints([{x,y:y+56},{x:x+56,y:y+28},{x:x+112,y:y+56},{x:x+56,y:y+84}],true);
  }
  if(farm)this.drawFarm(g);else if(cafe)this.drawCafe(g);else this.drawTown(g);
  this.hero=this.person(790,780,0x386f91,true);this.hero.setDepth(790);
  this.fitCamera();
  el('game').dataset.zone=next;renderQuests();renderInventory();
 }
 building(x:number,y:number,w:number,h:number,roof:number,wall:number){
  const g=this.add.graphics().setDepth(y+1);
  g.fillStyle(0x48392b,.3);g.fillEllipse(x+12,y+10,w*1.3,35);
  g.fillStyle(wall);g.fillRect(x-w/2,y-h,w,h);
  g.fillStyle(roof);g.fillPoints([{x:x-w*.65,y:y-h},{x,y:y-h-75},{x:x+w*.65,y:y-h},{x,y:y-h+16}],true);
  g.lineStyle(5,0x5a3e2c);g.strokeRect(x-w/2,y-h,w,h);
  g.fillStyle(0x6b432b);g.fillRect(x-25,y-70,50,70);
  g.fillStyle(0xe5b56c);g.fillRect(x-w*.38,y-h+30,36,45);g.fillRect(x+w*.18,y-h+30,36,45);
 }
 plantArt(x:number,y:number,ripe:boolean,index:number){
  const g=this.add.graphics().setDepth(y);
  g.fillStyle(0x735037);g.fillEllipse(x,y+20,98,42);
  g.fillStyle(0x416e38);g.fillEllipse(x,y-10,84,66);
  g.fillStyle(0x579447);g.fillEllipse(x-20,y-23,49,48);g.fillEllipse(x+19,y-28,53,45);
  if(ripe)for(let i=0;i<9;i++){g.fillStyle(i%3?0xc9452b:0xe97536);g.fillCircle(x+Math.sin(i*2.4)*31,y-17+Math.cos(i*1.9)*22,7)}
  this.hotspots.push({x,y,kind:'plot',index});
 }
 drawFarm(g:Phaser.GameObjects.Graphics){
  this.building(1170,380,280,230,0x4d6470,0xe4c38d);
  for(let i=0;i<12;i++){const x=225+(i%4)*210,y=325+Math.floor(i/4)*180;this.plantArt(x,y,state.plots[i].stage==='ripe',i)}
  for(let i=0;i<9;i++){g.lineStyle(8,0x8d6a42);g.lineBetween(90+i*142,145,90+i*142,185)}
  this.hotspots.push({x:1330,y:600,kind:'roaster'});
  this.add.text(1330,560,'🔥 Lò rang',{fontFamily:'sans-serif',fontSize:'27px',color:'#fff2ca',backgroundColor:'#6a4636',padding:{x:12,y:8}}).setOrigin(.5).setDepth(600);
  for(let i=0;i<16;i++){const x=(i*193+39)%1540+30,y=(i*317+55)%950+25;g.fillStyle(i%2?0xf8c1d0:0xf8e2a4,.75);g.fillCircle(x,y,3+i%3)}
 }
 drawCafe(g:Phaser.GameObjects.Graphics){
  this.building(1250,300,340,180,0x67442f,0xd6ae7e);
  g.fillStyle(0x704a35);g.fillRoundedRect(540,360,740,100,16);
  g.fillStyle(0xe3b57b);g.fillRoundedRect(540,353,740,24,10);
  for(let i=0;i<5;i++){const x=180+i*270;g.fillStyle(0x694631);g.fillEllipse(x,710,142,58);g.fillStyle(0xd6a56b);g.fillEllipse(x,702,132,45);this.person(x-40,755,0x8466a8)}
  this.add.text(900,310,'☕  QUẦY PHA CHẾ',{fontFamily:'sans-serif',fontSize:'30px',color:'#fff0c6',backgroundColor:'#6c402d',padding:{x:16,y:10}}).setOrigin(.5).setDepth(400);
  this.hotspots.push({x:900,y:450,kind:'counter'});
  if(state.orders.length===0)newOrder(state);
  state.orders.forEach((order,i)=>{const x=220+i*290;this.hotspots.push({x,y:780,kind:'customer',index:order.id});this.add.text(x,640,'☕ '+RECIPES[order.recipe].name,{fontSize:'23px',color:'#4e2d21',backgroundColor:'#fff0cf',padding:{x:8,y:6}}).setOrigin(.5).setDepth(900)});
 }
 drawTown(g:Phaser.GameObjects.Graphics){
  g.fillStyle(0xd7bd91);g.fillPoints([{x:650,y:0},{x:920,y:0},{x:1160,y:1000},{x:430,y:1000}],true);
  for(const [x,y] of [[230,330],[1250,370],[320,790],[1280,810]])this.building(x,y,230,160,0x58646a,0xd5b08a);
  for(let i=0;i<12;i++){const x=(i*223+150)%1550,y=(i*331+120)%900;g.fillStyle(0x438b65);g.fillCircle(x,y,28);g.fillStyle(0xeda7b8);g.fillCircle(x+12,y-8,16)}
  this.person(680,350,0x945f75);this.person(1060,530,0x967546);this.person(550,780,0x4c8371);
  this.hotspots.push({x:680,y:350,kind:'npc'},{x:1060,y:530,kind:'merchant'},{x:550,y:780,kind:'cultivate'});
  this.add.text(820,110,'🏮 THỊ TRẤN LINH MỘC',{fontSize:'33px',color:'#fff2d6',backgroundColor:'#754b35',padding:{x:20,y:10}}).setOrigin(.5);
 }
 person(x:number,y:number,robe:number,hero=false){
  const root=this.add.container(x,y).setDepth(y);
  const g=this.add.graphics();g.fillStyle(0x302b28,.22);g.fillEllipse(0,8,54,17);
  g.fillStyle(0x42362e);g.fillRect(-14,-8,11,28);g.fillRect(3,-8,11,28);
  g.fillStyle(robe);g.fillRoundedRect(-25,-60,50,60,12);
  g.fillStyle(0xffd5ac);g.fillCircle(0,-83,27);
  g.fillStyle(0x312e35);g.fillEllipse(0,-101,60,27);g.fillCircle(-20,-93,12);g.fillCircle(20,-93,12);
  g.fillStyle(0x202533);g.fillCircle(-9,-83,3);g.fillCircle(9,-83,3);
  if(hero){g.fillStyle(0xd9ac59);g.fillEllipse(0,-111,72,13);g.fillRoundedRect(-23,-136,46,28,9)}
  root.add(g);return root;
 }
 fitCamera(){
  if(!this.hero)return;
  const {width,height}=this.scale;
  const zoom=Math.min(width/(width>=height?1060:680),height/(width>=height?660:1040));
  const camera=this.cameras.main;camera.setBounds(0,0,1600,1000);camera.setZoom(Math.max(.2,zoom));camera.startFollow(this.hero,true,.08,.08);
 }
 update(_time:number,delta:number){
  if(zone==='farm')grow(state);
  if(zone==='cafe'&&state.orders.length===0){newOrder(state);this.drawZone('cafe');sync()}
  if(!this.target||this.busy||this.mapOpen)return;
  const dx=this.target.x-this.hero.x,dy=this.target.y-this.hero.y,d=Math.hypot(dx,dy),step=Math.min(d,delta*.24);
  if(d>50){this.hero.x+=dx/d*step;this.hero.y+=dy/d*step;this.hero.setDepth(this.hero.y);return}
  this.target=undefined;if(this.pending){const pending=this.pending;this.pending=undefined;this.interact(pending)}
 }
 interact(h:Hotspot){
  if(h.kind==='plot'){
   const p=state.plots[h.index!];let message='';
   if(p.stage==='empty')message=plant(state,h.index!)?'Đã gieo hạt cà phê':'Cần 3 xu';
   else if(p.stage==='seed')message=water(state,h.index!)?'Đã tưới, chờ cây phát triển':'Chưa thể tưới';
   else if(p.stage==='ripe')message=harvest(state,h.index!)?'+3 hạt cà phê':'Chưa thu hoạch được';
   else message='Cây đang phát triển';toast(message);this.drawZone('farm');
  }else if(h.kind==='roaster'){toast(roast(state)?'Đã rang 3 hạt cà phê':'Cần 3 hạt tươi')}
  else if(h.kind==='counter'){
   const order=state.orders[0];if(!order){toast('Chưa có đơn');return}
   if(!brew(state,order.recipe)){toast('Thiếu nguyên liệu — mở Túi đồ để nhập hàng');return}
   this.busy=true;toast('Đang pha '+RECIPES[order.recipe].name);
   this.time.delayedCall(RECIPES[order.recipe].brewMs,()=>{state.prepared.push(order.recipe);state.drinks=state.prepared.length;this.busy=false;toast('Đã pha xong! Chạm vào khách để phục vụ');sync()});
  }else if(h.kind==='customer'){
   const order=state.orders.find(o=>o.id===h.index);
   if(order&&serve(state,order)){toast('Phục vụ thành công! +'+RECIPES[order.recipe].price+' xu');this.drawZone('cafe')}else toast('Hãy pha đúng món tại quầy trước');
  }else if(h.kind==='npc')drawer('Sư phụ Linh Mộc','Đạo hữu hãy tu tâm dưỡng tính, chăm sóc linh điền và khám phá bí mật của từng hạt cà phê.');
  else if(h.kind==='merchant')drawer('Thương nhân','Giao thương mở ra những vùng đất mới. Hãy thu hoạch cà phê, rang hạt và mở Bản đồ thế giới.');
  else drawer('Tu luyện linh khí','Hấp thụ linh khí từ linh điền. Hệ thống cảnh giới và công pháp chuyên sâu sẽ mở rộng trong các chương tiếp theo.');
  sync();
 }
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:540,backgroundColor:'#8fbd85',scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true,powerPreference:'high-performance'},scene:[World]});
const world=game.scene.getScene('coffee-world') as World;
const worldMap=createWorldMap(state,sync,toast,open=>{world.mapOpen=open;if(open){world.target=undefined;world.pending=undefined}});
el('map-open').onclick=()=>worldMap.open();el('world-nav').onclick=()=>worldMap.open();
document.querySelectorAll<HTMLButtonElement>('[data-zone]').forEach(b=>b.onclick=()=>setZone(b.dataset.zone as Zone));
el('story-open').onclick=showStory;
el('dialog-close').onclick=()=>{el('dialog').hidden=true;story={...story,seen:true};saveStory(story)};
el('dialog-next').onclick=()=>{story=advance(story);el('dialog').hidden=true;if(story.chapter!=='complete')showStory();else{setZone('farm');toast('Chào mừng đến với Coffee World!')}};
document.querySelectorAll<HTMLButtonElement>('[data-path]').forEach(b=>b.onclick=()=>{story.path=b.dataset.path as Path;saveStory(story);document.querySelectorAll('[data-path]').forEach(x=>x.classList.toggle('selected',x===b));toast('Đã chọn con đường của bạn')});
el('drawer-close').onclick=()=>el('drawer').hidden=true;
el('quest-tab').onclick=()=>{daily=false;el('quest-tab').classList.add('active');el('daily-tab').classList.remove('active');renderQuests()};
el('daily-tab').onclick=()=>{daily=true;el('daily-tab').classList.add('active');el('quest-tab').classList.remove('active');renderQuests()};
document.querySelectorAll<HTMLButtonElement>('[data-ui]').forEach(b=>b.onclick=()=>{
 const id=b.dataset.ui;
 if(id==='bag')drawer('🎒 Túi đồ',`Hạt tươi: ${state.beans} · Hạt rang: ${state.roasted} · Sữa: ${state.milk} · Sô-cô-la: ${state.chocolate}<p><button id="restock">Nhập nguyên liệu · 20 xu</button></p>`);
 else if(id==='skills')drawer('📖 Kỹ năng','🌱 Linh điền · ☕ Pha chế · 🔮 Tu luyện. Nâng cấp kỹ năng qua nhiệm vụ và cấp độ.');
 else if(id==='workers')drawer('👥 Nhân viên','Tuyển và phân công nhân viên tại quán cà phê khi đạt cấp độ cao hơn.');
 else drawer('⚙️ Quản lý',`Cấp quán: ${state.level}<p><button id="upgrade">Nâng cấp quán · ${state.level*100} xu</button></p>`);
 const restockButton=document.getElementById('restock');if(restockButton)restockButton.onclick=()=>{toast(restock(state)?'Đã nhập hàng':'Không đủ xu');sync();el('drawer').hidden=true};
 const upgradeButton=document.getElementById('upgrade');if(upgradeButton)upgradeButton.onclick=()=>{toast(upgrade(state)?'Nâng cấp thành công':'Không đủ xu');sync();el('drawer').hidden=true};
});
el('quick-items').addEventListener('click',event=>{const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-slot]');if(!button)return;const i=Number(button.dataset.slot);if(zone==='farm'&&i===3)toast(roast(state)?'Đã rang 3 hạt':'Cần 3 hạt cà phê');else if(zone==='cafe'&&i===3)toast(restock(state)?'Đã nhập nguyên liệu':'Không đủ xu');else toast('Chạm vào vật thể trong bản đồ để tương tác');sync()});
window.setInterval(()=>{worldMap.refresh();if(zone==='farm'){grow(state);sync()}},2500);
sync();document.querySelector('[data-zone="farm"]')?.classList.add('selected');if(!story.seen&&story.chapter!=='complete')window.setTimeout(showStory,350);
