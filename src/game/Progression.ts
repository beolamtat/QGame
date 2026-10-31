export type Cultivation={qi:number,realm:number,practice:number,unlockedRecipes:string[],townVisits:number};
const KEY='coffee-world-cultivation-v1';
export const REALMS=['Phàm Nhân','Luyện Khí','Trúc Cơ','Kim Đan','Nguyên Anh','Hóa Thần'];
export function loadCultivation():Cultivation{
 const initial:Cultivation={qi:0,realm:0,practice:0,unlockedRecipes:['espresso','latte','mocha'],townVisits:0};
 try{const raw=JSON.parse(localStorage.getItem(KEY)||'null') as Partial<Cultivation>|null;
 if(!raw)return initial;return {...initial,...raw,qi:Math.max(0,Number(raw.qi)||0),realm:Math.min(5,Math.max(0,Number(raw.realm)||0))};
 }catch{return initial}
}
export function saveCultivation(c:Cultivation){try{localStorage.setItem(KEY,JSON.stringify(c))}catch{}}
export function practice(c:Cultivation){c.practice++;c.qi+=10;const need=(c.realm+1)*50;if(c.realm<REALMS.length-1&&c.qi>=need){c.qi-=need;c.realm++;saveCultivation(c);return 'Đột phá '+REALMS[c.realm]+'!'}saveCultivation(c);return 'Hấp thụ 10 linh khí'}
export type BrewStep='grind'|'dose'|'tamp'|'extract'|'finish';
export const BREW_STEPS:[BrewStep,string,string][]=[
 ['grind','Xay hạt','Xay hạt vừa đủ mịn để nước chiết xuất đều.'],
 ['dose','Định lượng','Đong đúng lượng cà phê cho một lần pha.'],
 ['tamp','Nén bột','Nén đều tay để dòng nước đi qua bột ổn định.'],
 ['extract','Chiết xuất','Quan sát dòng cà phê và thời gian chiết xuất.'],
 ['finish','Hoàn thành','Ghi nhớ hương vị, điều chỉnh ở lần pha tiếp theo.']
];
