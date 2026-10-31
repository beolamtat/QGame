export type RecipeId='espresso'|'latte'|'mocha';
export type Plot={stage:'empty'|'seed'|'growing'|'ripe',watered:boolean,readyAt:number};
export type Order={id:number,recipe:RecipeId,expiresAt:number};
export type State={coins:number,beans:number,drinks:number,harvested:number,roasted:number,prepared:RecipeId[],milk:number,chocolate:number,level:number,served:number,plots:Plot[],orders:Order[],nextOrderId:number};
export const RECIPES:Record<RecipeId,{name:string,beans:number,milk:number,chocolate:number,price:number,brewMs:number}>={
 espresso:{name:'Espresso',beans:2,milk:0,chocolate:0,price:25,brewMs:1800},
 latte:{name:'Latte',beans:2,milk:1,chocolate:0,price:40,brewMs:2300},
 mocha:{name:'Mocha',beans:2,milk:1,chocolate:1,price:55,brewMs:2800}
};
const KEY='coffee-world-save-v03';
const initial=():State=>({coins:120,beans:0,drinks:0,harvested:0,roasted:0,prepared:[],milk:3,chocolate:2,level:1,served:0,plots:Array.from({length:12},()=>({stage:'ripe',watered:true,readyAt:0})),orders:[],nextOrderId:1});
export function load():State{const defaults=initial();try{const raw=JSON.parse(localStorage.getItem(KEY)||'null') as Partial<State>|null;if(!raw)return defaults;return {...defaults,...raw,drinks:Array.isArray(raw.prepared)?raw.prepared.filter((v:unknown)=>v==='espresso'||v==='latte'||v==='mocha').length:0,plots:Array.isArray(raw.plots)&&raw.plots.length===12?raw.plots:defaults.plots,orders:[],prepared:Array.isArray(raw.prepared)?raw.prepared.filter((v:unknown):v is RecipeId=>v==='espresso'||v==='latte'||v==='mocha'):[]}}catch{return defaults}}
export function persist(s:State){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{ /* Private mode and storage quota: keep playing in memory */ }}
export function grow(s:State,now=Date.now()){for(const p of s.plots){if(p.stage==='growing'&&p.watered&&now>=p.readyAt){p.stage='ripe';p.watered=false}}}
export function plant(s:State,index:number){const p=s.plots[index];if(!p||p.stage!=='empty'||s.coins<3)return false;s.coins-=3;p.stage='seed';p.watered=false;p.readyAt=0;return true}
export function water(s:State,index:number){const p=s.plots[index];if(!p||p.stage!=='seed')return false;p.stage='growing';p.watered=true;p.readyAt=Date.now()+12000;return true}
export function harvest(s:State,index:number){const p=s.plots[index];if(!p||p.stage!=='ripe')return false;p.stage='empty';p.watered=false;s.beans+=3;s.harvested++;return true}
export function roast(s:State){if(s.beans<3)return false;s.beans-=3;s.roasted+=3;return true}
export function brew(s:State,id:RecipeId){const r=RECIPES[id];if(s.roasted<r.beans||s.milk<r.milk||s.chocolate<r.chocolate)return false;s.roasted-=r.beans;s.milk-=r.milk;s.chocolate-=r.chocolate;return true}
export function serve(s:State,order:Order){if(!s.prepared.includes(order.recipe)||!s.orders.some(o=>o.id===order.id&&o.recipe===order.recipe)||Date.now()>order.expiresAt)return false;s.prepared.splice(s.prepared.indexOf(order.recipe),1);s.drinks=s.prepared.length;s.coins+=RECIPES[order.recipe].price+5*(s.level-1);s.served++;s.orders=s.orders.filter(o=>o.id!==order.id);return true}
export function upgrade(s:State){const cost=100*s.level;if(s.coins<cost)return false;s.coins-=cost;s.level++;return true}
export function restock(s:State){if(s.coins<20)return false;s.coins-=20;s.milk+=3;s.chocolate+=2;return true}
export function newOrder(s:State,now=Date.now()){if(s.orders.length>=4)return null;const ids:RecipeId[]=s.level<2?['espresso','latte']:['espresso','latte','mocha'];const recipe=ids[Math.floor(Math.random()*ids.length)];const order={id:s.nextOrderId++,recipe,expiresAt:now+90000};s.orders.push(order);return order}
