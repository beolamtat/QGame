import {describe,it,expect,vi} from 'vitest';
import {load,grow,plant,water,harvest,roast,brew,serve,upgrade,restock,newOrder,RECIPES,type State} from '../src/game/Economy';
import {normalizeExpansion,unlock,buildBranch,sendShipment,claimShipment,collectIncome,upgradeBranch,type Wallet} from '../src/game/Expansion';
const fresh=():State=>({coins:120,beans:0,drinks:0,harvested:0,roasted:0,prepared:[],milk:3,chocolate:2,level:1,served:0,plots:Array.from({length:12},()=>({stage:'ripe',watered:true,readyAt:0})),orders:[],nextOrderId:1});
describe('farm-to-cup economy',()=>{
 it('harvests once, plants, waters and ripens on time',()=>{
  const s=fresh();expect(harvest(s,0)).toBe(true);expect(harvest(s,0)).toBe(false);expect(s.beans).toBe(3);
  expect(plant(s,0)).toBe(true);expect(s.coins).toBe(117);expect(water(s,0)).toBe(true);
  grow(s,s.plots[0].readyAt-1);expect(s.plots[0].stage).toBe('growing');
  grow(s,s.plots[0].readyAt);expect(s.plots[0].stage).toBe('ripe');
 });
 it('roasts and brews without duplicating ingredients',()=>{
  const s=fresh();s.beans=3;expect(roast(s)).toBe(true);expect(roast(s)).toBe(false);
  expect(brew(s,'espresso')).toBe(true);expect(s.roasted).toBe(1);expect(brew(s,'espresso')).toBe(false);
 });
 it('rejects a wrong drink and serves exactly once',()=>{
  const s=fresh();s.orders=[{id:1,recipe:'latte',expiresAt:Date.now()+10000}];s.prepared=['espresso'];s.drinks=1;
  expect(serve(s,s.orders[0])).toBe(false);expect(s.coins).toBe(120);
  s.prepared.push('latte');s.drinks=2;
  const order=s.orders[0];expect(serve(s,order)).toBe(true);expect(s.coins).toBe(160);expect(s.drinks).toBe(1);
  expect(serve(s,order)).toBe(false);expect(s.coins).toBe(160);
 });
 it('does not serve expired orders',()=>{
  const s=fresh();s.prepared=['espresso'];s.drinks=1;s.orders=[{id:1,recipe:'espresso',expiresAt:Date.now()-1}];
  expect(serve(s,s.orders[0])).toBe(false);expect(s.prepared).toEqual(['espresso']);
 });
 it('enforces upgrade and restock prices',()=>{
  const s=fresh();expect(upgrade(s)).toBe(true);expect(s.level).toBe(2);expect(s.coins).toBe(20);
  expect(upgrade(s)).toBe(false);expect(restock(s)).toBe(true);expect(restock(s)).toBe(false);
 });
 it('caps orders at four',()=>{const s=fresh();for(let i=0;i<4;i++)expect(newOrder(s)).not.toBeNull();expect(newOrder(s)).toBeNull()});
});
describe('world expansion',()=>{
 it('unlocks and builds only once',()=>{
  const e=normalizeExpansion(null),w:Wallet={coins:500,roasted:0};
  expect(unlock(e,w,'cn')).toBe(true);expect(unlock(e,w,'cn')).toBe(false);
  expect(buildBranch(e,w,'cn',0)).toBe(true);expect(buildBranch(e,w,'cn',0)).toBe(false);
  expect(w.coins).toBe(200);
 });
 it('blocks duplicate shipments and double claims',()=>{
  const e=normalizeExpansion(null),w:Wallet={coins:500,roasted:10};unlock(e,w,'cn');buildBranch(e,w,'cn',0);
  expect(sendShipment(e,w,'cn',100)).toBe(true);expect(sendShipment(e,w,'cn',100)).toBe(false);
  expect(w.roasted).toBe(5);expect(claimShipment(e,w,'cn',30099)).toBe(false);
  expect(claimShipment(e,w,'cn',30100)).toBe(true);expect(claimShipment(e,w,'cn',30100)).toBe(false);
  expect(w.coins).toBe(235);
 });
 it('caps offline income at ten minutes and prevents instant duplicate collection',()=>{
  const e=normalizeExpansion(null),w:Wallet={coins:0,roasted:0};
  expect(collectIncome(e,w,'vn',Date.now()+60_000*30)).toBe(100);
  expect(collectIncome(e,w,'vn',Date.now()+60_000*30)).toBe(0);
 });
 it('enforces max branch level 5',()=>{
  const e=normalizeExpansion(null),w:Wallet={coins:100000,roasted:0};
  for(let i=1;i<5;i++)expect(upgradeBranch(e,w,'vn')).toBe(true);
  expect(upgradeBranch(e,w,'vn')).toBe(false);
 });
 it('recovers starter branch from malformed save',()=>{
  const e=normalizeExpansion({unlocked:['cn'],branches:[{country:'cn',level:100,lastCollected:0}],shipments:[]});
  expect(e.branches.find(b=>b.country==='vn')).toBeDefined();
  expect(e.branches.find(b=>b.country==='cn')?.level).toBe(5);
 });
});
