/** v0.6.8 binary WebP review assets.
 * Art review is opt-in (?art=webp) until final quality approval.
 * Dimensions and sizes are enforced in E2E and unit tests.
 */
export const REVIEW_ART_PARAM='webp';
export const WEBP_ASSETS=[
 {key:'coffee-hero-v062',url:'/assets/hero-v068.webp',width:960,height:56,frames:24,frameWidth:40,bytes:238},
 {key:'coffee-props-v063',url:'/assets/props-v068.webp',width:288,height:56,frames:6,frameWidth:48,bytes:468},
 {key:'coffee-environment-farm-v065',url:'/assets/farm-v068.webp',width:800,height:500,frames:1,frameWidth:800,bytes:1090},
 {key:'coffee-environment-cafe-v065',url:'/assets/cafe-v068.webp',width:800,height:500,frames:1,frameWidth:800,bytes:400}
] as const;
export const WEBP_TOTAL_BYTES=WEBP_ASSETS.reduce((sum,asset)=>sum+asset.bytes,0);
export const REVIEW_ART_ENABLED=new URLSearchParams(window.location.search).get('art')===REVIEW_ART_PARAM;

/** v0.6.9 native-resolution art review; not enabled for normal gameplay until visual sign-off. */
export const ART_V069_ENABLED=new URLSearchParams(window.location.search).get('art')==='v069';
export const WEBP_V069_ASSETS=[
 {key:'coffee-hero-v062',url:'/assets/hero-v069.webp',width:1920,height:112,frames:24,frameWidth:80},
 {key:'coffee-props-v063',url:'/assets/props-v069.webp',width:576,height:112,frames:6,frameWidth:96},
 {key:'coffee-environment-farm-v065',url:'/assets/farm-v069.webp',width:1600,height:1000,frames:1,frameWidth:1600},
 {key:'coffee-environment-cafe-v065',url:'/assets/cafe-v069.webp',width:1600,height:1000,frames:1,frameWidth:1600}
] as const;
