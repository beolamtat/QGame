import Phaser from 'phaser';

/** Procedural illustrated environment pass. All shapes are editable placeholders,
 * intentionally separated from gameplay objects so final sprite atlases can replace them.
 * Designed for the same 1600x1000 world coordinates as the prototype.
 */
export function decorateWorld(scene:Phaser.Scene, zone:'farm'|'cafe'):void {
  const g=scene.add.graphics();
  if(zone==='farm'){
    // Broad paths and material variation rendered in one batched Graphics object.
    g.fillStyle(0x83ba77,.35).fillRoundedRect(55,180,570,665,38);
    g.fillStyle(0x7cb06c,.35).fillRoundedRect(935,180,520,665,38);
    g.fillStyle(0xf5e5ba,.75).fillRoundedRect(80,865,1390,64,22);
    g.lineStyle(4,0xc5a26f,.45).strokeRoundedRect(80,865,1390,64,22);
    // Curved paths and soft earth beds
    g.fillStyle(0xeed4a3).fillRoundedRect(705,0,185,1000,32);
    g.fillStyle(0xd8b780,.55).fillRoundedRect(720,0,12,1000,6);
    for(let i=0;i<12;i++){
      const x=110+i*115,y=105+(i%3)*5;
      g.fillStyle(0xf8e9c5,.35).fillEllipse(x,y,140,28);
    }
    // Hand-painted raised planting rows
    for(let row=0;row<5;row++){
      for(const x of [85,400,955]){
        const y=115+row*145;
        g.fillStyle(0x638e4b,.3).fillRoundedRect(x,y,310,100,25);
        g.fillStyle(0x785f3e,.75).fillRoundedRect(x+10,y+16,288,68,25);
        g.lineStyle(3,0xbca071,.7).strokeRoundedRect(x+10,y+16,288,68,25);
      }
    }
    // Decorative layered grass bands and warm edge lighting.
    g.fillStyle(0xc8e7a0,.18).fillRoundedRect(40,80,650,750,45);
    g.lineStyle(5,0xf6e9bd,.32).strokeRoundedRect(705,0,185,1000,32);
    // Flowering grass, pebbles
    for(let i=0;i<105;i++){
      const x=(i*137+43)%1570+10,y=(i*83+77)%920+35;
      if(x>700&&x<900)continue;
      const c=[0xe8d779,0xf8f0d4,0xe8a4b5,0x6db579][i%4];
      g.fillStyle(c,.8).fillCircle(x,y,i%5===0?4:2);
      g.lineStyle(2,0x589464,.65).lineBetween(x-5,y+5,x,y-4);
    }
    // Berry baskets, signage and warm lanterns around the workshop.
    for(const x of [1210,1505]){
      g.fillStyle(0xe7bf71,.7).fillCircle(x,190,16);
      g.lineStyle(3,0xffe2a1,.65).strokeCircle(x,190,20);
    }
    g.fillStyle(0x9d6c42).fillRoundedRect(1100,410,125,72,12);
    g.fillStyle(0xf1d9a2).fillRoundedRect(1112,421,101,49,8);
    g.lineStyle(3,0x7e503a,.7).strokeRoundedRect(1112,421,101,49,8);
    // Garden fence
    for(const x of [40,1570]){
      for(let y=80;y<940;y+=50){
        g.fillStyle(0xe8c792).fillRoundedRect(x,y,13,45,4);
        g.fillStyle(0xb78054).fillRect(x-5,y+13,25,7);
      }
    }
    // Pond with reeds
    g.fillStyle(0x6b9d7b,.4).fillEllipse(1240,740,420,220);
    g.fillStyle(0x74c8c5).fillEllipse(1240,730,382,184);
    g.lineStyle(5,0xd9ead3,.7).strokeEllipse(1240,730,338,147);
    for(let i=0;i<7;i++){
      const x=1130+i*32,y=703+(i%3)*19;
      g.lineStyle(3,0xf2fff0,.42).lineBetween(x,y,x+26,y-4);
    }
    for(let i=0;i<10;i++){
      const x=1060+i*34,y=805+Math.sin(i)*16;
      g.lineStyle(3,0x4e8c51).lineBetween(x,y,x+5,y-22);
    }
    // Workshop roof with fantasy curved eaves
    g.fillStyle(0x704a48).fillRoundedRect(1250,88,305,190,14);
    g.fillStyle(0xa9574e).fillTriangle(1220,125,1400,23,1590,125);
    g.lineStyle(9,0xf2cf8e).lineBetween(1220,127,1590,127);
    g.fillStyle(0xf8dcaa).fillRoundedRect(1300,174,198,74,8);
    g.fillStyle(0x68452e).fillRoundedRect(1380,185,55,64,5);
  } else {
    // Decorative floor tiles with warm illustrated palette
    g.fillStyle(0xe7c993).fillRect(0,0,1600,1000);
    for(let y=0;y<1000;y+=86)for(let x=0;x<1600;x+=86){
      g.fillStyle((x+y)%172===0?0xf0d8ac:0xdcb885,.7).fillRoundedRect(x+3,y+3,80,80,8);
      g.lineStyle(1,0xa17d57,.18).strokeRoundedRect(x+3,y+3,80,80,8);
    }
    // Upper wall, windows, hanging lanterns
    g.fillStyle(0x7e594c).fillRect(0,0,1600,170);
    g.fillStyle(0xf3d7aa).fillRect(0,160,1600,20);
    for(const x of [180,590,1000,1410]){
      g.fillStyle(0x4b6c68).fillRoundedRect(x-70,32,140,105,12);
      g.lineStyle(8,0xd9a16c).strokeRoundedRect(x-70,32,140,105,12);
      g.lineStyle(5,0xd9a16c).lineBetween(x,32,x,137);
      g.fillStyle(0xf8d77e).fillEllipse(x,155,30,15);
    }
    // Warm service counter and coffee machines
    g.fillStyle(0x4e3b36).fillRoundedRect(365,190,810,180,18);
    g.fillStyle(0xe3bd80).fillRoundedRect(348,175,844,42,12);
    for(const x of [530,710,890]){
      g.fillStyle(0x82958d).fillRoundedRect(x-34,124,68,64,9);
      g.fillStyle(0xd9d7c5).fillRoundedRect(x-23,130,46,25,4);
      g.fillStyle(0x4e4946).fillCircle(x,172,8);
    }
    // Espresso station backsplash, menu board and pendant lights.
    g.fillStyle(0x3f5045).fillRoundedRect(1225,190,260,175,14);
    g.lineStyle(6,0xe4b778,.9).strokeRoundedRect(1225,190,260,175,14);
    for(let i=0;i<4;i++){
      g.fillStyle(0xe7d4a5,.75).fillRoundedRect(1250,216+i*32,170-i*11,6,3);
    }
    for(const x of [330,800,1280]){
      g.lineStyle(4,0x665244,.8).lineBetween(x,0,x,75);
      g.fillStyle(0xf7d68a,.85).fillEllipse(x,86,74,34);
      g.fillStyle(0xffe6b3,.28).fillEllipse(x,103,105,40);
    }
    // Café seating with circular tables and chairs
    for(const x of [250,500,750,1000,1250]){
      g.fillStyle(0x6d4b40,.25).fillEllipse(x,692,160,40);
      for(const dx of [-85,85]){
        g.fillStyle(0x95654b).fillRoundedRect(x+dx-24,585,48,62,10);
        g.fillStyle(0xd49b68).fillRoundedRect(x+dx-20,589,40,38,9);
      }
      g.fillStyle(0x82563d).fillEllipse(x,640,135,83);
      g.fillStyle(0xe5bb80).fillEllipse(x,625,125,72);
      g.fillStyle(0xfff2d4).fillCircle(x+14,622,15);
      g.fillStyle(0x8b5d42).fillCircle(x+14,622,10);
    }
    // Potted plants are shared textured sprites from PropAtlas, not Graphics objects.
  }
  g.setDepth(-500);
}
