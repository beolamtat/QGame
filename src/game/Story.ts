export type Chapter='incident'|'ascension'|'mentor'|'complete';
export type Path='balance'|'cultivation'|'commerce';
export type Story={chapter:Chapter,path:Path,seen:boolean};
const KEY='coffee-world-redesign-story-v1';
export function loadStory():Story{
 try{const value=JSON.parse(localStorage.getItem(KEY)||'null') as Partial<Story>|null;
  if(value&&['incident','ascension','mentor','complete'].includes(value.chapter||''))return {chapter:value.chapter!,path:value.path||'balance',seen:!!value.seen};
 }catch{}
 return {chapter:'incident',path:'balance',seen:false};
}
export function saveStory(story:Story){try{localStorage.setItem(KEY,JSON.stringify(story))}catch{}}
export const STORY={
 incident:{title:'Chương 1 · Phàm Giới',speaker:'Người dẫn chuyện',text:'Một ngày bình thường, một sự cố bất ngờ xảy ra trên đường. Khi tỉnh lại, bạn thấy mình đang đứng giữa biển mây…',button:'Tiếp tục luân hồi'},
 ascension:{title:'Chương 2 · Ngũ Tiên Hội',speaker:'Ngọc Thần',text:'Nhân duyên chưa dứt. Năm vị tiên nhân trao cho bạn cơ hội trùng sinh, tu luyện và khai sáng con đường cà phê.',button:'Nhận tiên duyên'},
 mentor:{title:'Chương 3 · Bái Sư',speaker:'Sư phụ Linh Mộc',text:'Một hạt cà phê cũng mang linh khí của đất trời. Hãy bắt đầu từ mảnh linh điền này, rồi tạo nên một đế chế của riêng con.',button:'Bắt đầu hành trình'}
} as const;
export function advance(story:Story):Story{
 const chapter=story.chapter==='incident'?'ascension':story.chapter==='ascension'?'mentor':'complete';
 const next={...story,chapter,seen:chapter==='complete'};saveStory(next);return next;
}
