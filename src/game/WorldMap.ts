import {COUNTRIES,normalizeExpansion,unlock,buildBranch,sendShipment,claimShipment,collectIncome,upgradeBranch,INCOME_INTERVAL_MS,type CountryId,type Expansion,type Wallet} from './Expansion';
const SAVE_KEY='coffee-world-expansion-v01';
export function createWorldMap(wallet:Wallet,onChange:()=>void,onNotice:(message:string)=>void){
 let expansion:Expansion;
 try{expansion=normalizeExpansion(JSON.parse(localStorage.getItem(SAVE_KEY)||'null'))}catch{expansion=normalizeExpansion(null)}
 const overlay=document.createElement('section');overlay.id='world-map';overlay.setAttribute('aria-label','Bản đồ thế giới Coffee World');
 overlay.innerHTML='<div class="world-shell"><header><div><strong>🌏 COFFEE WORLD</strong><small>Mở rộng đế chế cà phê</small></div><button type="button" id="map-close">✕ Đóng</button></header><div class="world-content"><div class="world-canvas" id="world-canvas"><div class="world-land land-americas"></div><div class="world-land land-europe"></div><div class="world-land land-africa"></div><div class="world-land land-asia"></div><div class="world-land land-australia"></div><div id="world-pins"></div></div><aside id="world-detail"></aside></div><footer>📦 Vận chuyển cần 5 hạt rang · 30 giây/chuyến · Thu nhập chi nhánh tích lũy mỗi phút (tối đa 10 phút)</footer></div>';
 document.body.append(overlay);
 let selected:CountryId='vn';
 let opened=false;
 const persist=()=>{localStorage.setItem(SAVE_KEY,JSON.stringify(expansion));onChange()};
 const detail=overlay.querySelector<HTMLElement>('#world-detail')!;
 const pins=overlay.querySelector<HTMLElement>('#world-pins')!;
 const canvas=overlay.querySelector<HTMLElement>('#world-canvas')!;
 const close=()=>{opened=false;overlay.classList.remove('visible')};
 overlay.querySelector<HTMLButtonElement>('#map-close')!.onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 function render(){
  const now=Date.now();
  pins.replaceChildren();
  for(const c of COUNTRIES){
   const button=document.createElement('button');button.type='button';button.className='world-pin'+(expansion.unlocked.includes(c.id)?' unlocked':' locked')+(selected===c.id?' selected':'');button.style.left=c.x+'%';button.style.top=c.y+'%';button.textContent=c.flag;button.title=c.name;button.setAttribute('aria-label',c.name);
   button.onclick=()=>{selected=c.id;render()};
   pins.append(button);
  }
  const c=COUNTRIES.find(c=>c.id===selected)!;
  const active=expansion.unlocked.includes(c.id);
  const branch=expansion.branches.find(b=>b.country===c.id);
  const shipment=expansion.shipments.find(s=>s.country===c.id&&!s.claimed);
  const seconds=shipment?Math.max(0,Math.ceil((shipment.arrivalAt-now)/1000)):0;
  const ticks=branch?Math.min(10,Math.max(0,Math.floor((now-branch.lastCollected)/INCOME_INTERVAL_MS))):0;
  detail.replaceChildren();
  const heading=document.createElement('h2');heading.textContent=c.flag+' '+c.name;detail.append(heading);
  const status=document.createElement('p');status.textContent=!active?'🔒 Chưa mở khóa':branch?'🏪 Chi nhánh cấp '+branch.level:'📍 Đã mở khóa';detail.append(status);
  const desc=document.createElement('p');desc.textContent='🪙 '+wallet.coins+' xu · 🔥 '+wallet.roasted+' hạt rang';detail.append(desc);
  const add=(label:string,fn:()=>void,disabled=false)=>{
   const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.onclick=()=>{fn();render()};detail.append(b);
  };
  if(!active)add('🔓 Mở khóa · '+c.unlockCost+' xu',()=>{if(unlock(expansion,wallet,c.id)){persist();onNotice('Đã mở khóa '+c.name)}else onNotice('Không đủ xu')},wallet.coins<c.unlockCost);
  else if(!branch)add('🏪 Xây chi nhánh · '+c.branchCost+' xu',()=>{if(buildBranch(expansion,wallet,c.id)){persist();onNotice('Đã xây chi nhánh '+c.name)}else onNotice('Không đủ xu')},wallet.coins<c.branchCost);
  else{
   const income=ticks*c.income*branch.level;
   add('💰 Thu nhập · '+income+' xu',()=>{const earned=collectIncome(expansion,wallet,c.id);if(earned){persist();onNotice('Nhận '+earned+' xu')}else onNotice('Chưa đến kỳ thu nhập')},income===0);
   if(branch.level<5)add('⬆ Nâng cấp · '+(c.branchCost*(branch.level+1))+' xu',()=>{if(upgradeBranch(expansion,wallet,c.id)){persist();onNotice('Nâng cấp thành công')}else onNotice('Không đủ xu')},wallet.coins<c.branchCost*(branch.level+1));
   if(c.id!=='vn'){
    if(shipment)add(seconds?'🚚 Đang vận chuyển · '+seconds+'s':'📦 Nhận hàng · +'+c.shipmentReward+' xu',()=>{if(!claimShipment(expansion,wallet,c.id))onNotice('Chưa giao tới');else{persist();onNotice('Đã nhận '+c.shipmentReward+' xu')}},seconds>0);
    else add('🚚 Gửi 5 hạt rang',()=>{if(sendShipment(expansion,wallet,c.id)){persist();onNotice('Xe vận chuyển đã xuất phát')}else onNotice('Cần 5 hạt rang')},wallet.roasted<5);
   }
  }
  const foot=document.createElement('small');foot.textContent='Thu nhập: '+c.income+' xu/phút/cấp · Thưởng giao hàng: '+c.shipmentReward+' xu';detail.append(foot);
 }
 return {open(){opened=true;overlay.classList.add('visible');render()},close,refresh(){if(opened)render()},getState(){return expansion}};
}
