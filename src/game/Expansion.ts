export type CountryId='vn'|'cn'|'jp'|'br'|'fr'|'us';
export type Country={id:CountryId,name:string,flag:string,x:number,y:number,unlockCost:number,branchCost:number,shipmentReward:number,income:number};
export const COUNTRIES:Country[]=[
{id:'vn',name:'Việt Nam',flag:'🇻🇳',x:73,y:55,unlockCost:0,branchCost:0,shipmentReward:20,income:10},
{id:'cn',name:'Trung Quốc',flag:'🇨🇳',x:77,y:35,unlockCost:180,branchCost:120,shipmentReward:35,income:20},
{id:'jp',name:'Nhật Bản',flag:'🇯🇵',x:88,y:40,unlockCost:350,branchCost:200,shipmentReward:55,income:30},
{id:'br',name:'Brazil',flag:'🇧🇷',x:35,y:73,unlockCost:550,branchCost:300,shipmentReward:80,income:45},
{id:'fr',name:'Pháp',flag:'🇫🇷',x:49,y:31,unlockCost:750,branchCost:400,shipmentReward:110,income:60},
{id:'us',name:'Hoa Kỳ',flag:'🇺🇸',x:20,y:34,unlockCost:1000,branchCost:550,shipmentReward:150,income:85}
];
export type Branch={country:CountryId,level:number,lastCollected:number};
export type Shipment={country:CountryId,beans:number,arrivalAt:number,claimed:boolean};
export type Expansion={unlocked:CountryId[],branches:Branch[],shipments:Shipment[]};
export type Wallet={coins:number,roasted:number};
export const DELIVERY_MS=30000;
export const INCOME_INTERVAL_MS=60000;
export function normalizeExpansion(value:unknown):Expansion{
 const raw=value&&typeof value==='object'?value as Partial<Expansion>:{};
 const valid=(id:unknown):id is CountryId=>COUNTRIES.some(c=>c.id===id);
 const unlocked=Array.isArray(raw.unlocked)?raw.unlocked.filter(valid):[];
 const branches=Array.isArray(raw.branches)?raw.branches.filter(b=>b&&valid(b.country)&&Number.isFinite(b.level)&&Number.isFinite(b.lastCollected)).map(b=>({country:b.country,level:Math.max(1,Math.min(20,Math.floor(b.level))),lastCollected:b.lastCollected})):[];
 const shipments=Array.isArray(raw.shipments)?raw.shipments.filter(s=>s&&valid(s.country)&&Number.isFinite(s.beans)&&s.beans>0&&Number.isFinite(s.arrivalAt)).map(s=>({...s,claimed:!!s.claimed})):[];
 return {unlocked:Array.from(new Set<CountryId>(['vn',...unlocked])),branches:branches.length?branches:[{country:'vn',level:1,lastCollected:Date.now()}],shipments};
}
export function unlock(e:Expansion,w:Wallet,id:CountryId){const c=COUNTRIES.find(c=>c.id===id);if(!c||e.unlocked.includes(id)||w.coins<c.unlockCost)return false;w.coins-=c.unlockCost;e.unlocked.push(id);return true}
export function buildBranch(e:Expansion,w:Wallet,id:CountryId,now=Date.now()){const c=COUNTRIES.find(c=>c.id===id);if(!c||!e.unlocked.includes(id)||e.branches.some(b=>b.country===id)||w.coins<c.branchCost)return false;w.coins-=c.branchCost;e.branches.push({country:id,level:1,lastCollected:now});return true}
export function sendShipment(e:Expansion,w:Wallet,id:CountryId,now=Date.now()){if(id==='vn'||!e.branches.some(b=>b.country===id)||w.roasted<5||e.shipments.some(s=>s.country===id&&!s.claimed))return false;w.roasted-=5;e.shipments.push({country:id,beans:5,arrivalAt:now+DELIVERY_MS,claimed:false});return true}
export function claimShipment(e:Expansion,w:Wallet,id:CountryId,now=Date.now()){const s=e.shipments.find(s=>s.country===id&&!s.claimed&&s.arrivalAt<=now);const c=COUNTRIES.find(c=>c.id===id);if(!s||!c)return false;s.claimed=true;w.coins+=c.shipmentReward;return true}
export function collectIncome(e:Expansion,w:Wallet,id:CountryId,now=Date.now()){const b=e.branches.find(b=>b.country===id),c=COUNTRIES.find(c=>c.id===id);if(!b||!c)return 0;const ticks=Math.min(10,Math.max(0,Math.floor((now-b.lastCollected)/INCOME_INTERVAL_MS)));if(!ticks)return 0;const earned=ticks*c.income*b.level;w.coins+=earned;b.lastCollected+=ticks*INCOME_INTERVAL_MS;return earned}
export function upgradeBranch(e:Expansion,w:Wallet,id:CountryId){const b=e.branches.find(b=>b.country===id),c=COUNTRIES.find(c=>c.id===id);if(!b||!c||b.level>=5)return false;const cost=c.branchCost*(b.level+1);if(w.coins<cost)return false;w.coins-=cost;b.level++;return true}
