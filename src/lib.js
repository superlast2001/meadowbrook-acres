const S=3;
let ctx;
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
const P=(x,y,c)=>R(x,y,1,1,c);
function spr(k,x,y,opt={}){ // x=center, y=feet
  const s=SPR[k];if(!s)return;const d=opt.dir||'down',f=opt.f||0;
  if(k=='ares_side'){const fw=s.width/9,fh=s.height,hh=33,ww=fw*hh/fh;ctx.save();ctx.translate(x,0);if(d=='left')ctx.scale(-1,1);ctx.drawImage(s,f*fw,0,fw,fh,-ww/2,y-hh,ww,hh);ctx.restore();return;}
  const meta={farmer_sheet:24,mabel_sheet:23,pip_sheet:19,rzel_world:32,ares_world:33}[k];
  const row={down:0,up:1,left:2,right:3}[d],fw=s.width/4,fh=s.height/4,hh=meta,ww=fw*hh/fh;
  if(opt.filter)ctx.filter=opt.filter;
  ctx.drawImage(s,f*fw,row*fh,fw,fh,x-ww/2,y-hh,ww,hh);ctx.filter='none';
}
function shadow(x,y,w){ctx.fillStyle='rgba(0,0,0,0.28)';ctx.beginPath();ctx.ellipse(x,y,w,w*0.35,0,0,7);ctx.fill();}
const GUEST=['hue-rotate(110deg)','hue-rotate(200deg) saturate(1.3)','hue-rotate(290deg)','hue-rotate(40deg) brightness(1.1)','hue-rotate(160deg) brightness(.9)'];
const GPAL=[[[214,64,120],[150,40,90],[250,120,170],[90,20,60]],[[60,170,90],[34,110,60],[120,220,140],[20,70,40]],[[150,80,210],[100,50,150],[200,140,250],[60,30,100]],[[230,140,40],[170,90,20],[255,200,110],[110,60,10]],[[40,40,50],[24,24,30],[90,90,110],[10,10,14]]];
const HATC=[[[60,40,70],[100,70,120],[40,24,50]],[[230,230,240],[255,255,255],[170,170,190]],[[200,40,60],[240,90,110],[130,20,40]],[[40,150,200],[100,200,240],[20,90,140]],[[240,200,60],[255,235,140],[180,140,30]]];
const GCACHE={};
function guestSheet(i){i%=GPAL.length;if(GCACHE[i])return GCACHE[i];const s=SPR.farmer_sheet,c=document.createElement('canvas');c.width=s.width;c.height=s.height;const g=c.getContext('2d');g.drawImage(s,0,0);const d=g.getImageData(0,0,c.width,c.height),a=d.data;
  const over=[[66,118,208],[40,72,150],[120,170,240],[28,50,105]],hat=[[226,184,92],[250,222,140],[170,124,52]];
  const near=(r,gg,b,c)=>Math.abs(r-c[0])+Math.abs(gg-c[1])+Math.abs(b-c[2])<24;
  for(let p=0;p<a.length;p+=4){if(!a[p+3])continue;const r=a[p],gg=a[p+1],b=a[p+2];
    for(let k=0;k<4;k++)if(near(r,gg,b,over[k])){[a[p],a[p+1],a[p+2]]=GPAL[i][k];break;}
    for(let k=0;k<3;k++)if(near(r,gg,b,hat[k])){[a[p],a[p+1],a[p+2]]=HATC[i][k];break;}}
  g.putImageData(d,0,0);return GCACHE[i]=c;}
function guest(i,x,y,d='down',f=0){shadow(x,y,5);const s=guestSheet(i),row={down:0,up:1,left:2,right:3}[d];ctx.drawImage(s,f*48,row*72,48,72,x-8,y-24,16,24);}
function who(k,x,y,d='down',f=0){shadow(x,y,k=='ares_world'||k=='rzel_world'?8:5);spr(k,x,y,{dir:d,f});}
// tiny 3x5 pixel font
const F={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','$':'011110010011110','+':'000010111010000','0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110',' ':'000000000000000','!':'010010010000010','.':'000000000000010',':':'000010000010000','-':'000000111000000','/':'001001010100100','?':'110001010000010','♥':'000101111111010',"'":'010010000000000','&':'010101010101011'};
function text(t,x,y,c,sc=1){t=t.toUpperCase();for(const ch of t){const g=F[ch]||F[' '];for(let i=0;i<15;i++)if(g[i]=='1')R(x+(i%3)*sc,y+Math.floor(i/3)*sc,sc,sc,c);x+=4*sc;}}
function textW(t,sc=1){return t.length*4*sc-sc;}
function neon(t,x,y,c,glow,sc=2){ctx.save();ctx.shadowColor=glow;ctx.shadowBlur=6;text(t,x,y,c,sc);ctx.restore();text(t,x,y,c,sc);}
// ---------- materials ----------
function brick(x,y,w,h,a='#6b3a3a',b='#552c2e',m='#3a1e22'){R(x,y,w,h,m);for(let j=0;j<h;j+=4)for(let i=-(j/4%2)*4;i<w;i+=8){const bx=Math.max(x,x+i),bw=Math.min(7,x+i+7-bx,x+w-bx);if(bw>0)R(bx,y+j,bw,3,((i+j)/4)%3?a:b);}}
function wood(x,y,w,h,a='#9a6a3e',b='#86592f',l='#6e4524'){for(let j=0;j<h;j+=4){R(x,y+j,w,4,j/4%2?a:b);R(x,y+j+3,w,1,l);for(let i=(j*7)%16;i<w;i+=16)R(x+i,y+j,1,3,l);}}
function carpet(x,y,w,h,a,b){R(x,y,w,h,a);for(let j=0;j<h;j+=4)for(let i=(j/4%2)*4;i<w;i+=8)R(x+i,y+j,2,2,b);}
function tiles(x,y,w,h,a,b){for(let j=0;j<h;j+=8)for(let i=0;i<w;i+=8)R(x+i,y+j,Math.min(8,w-i),Math.min(8,h-j),((i+j)/8)%2?a:b);}
function danceTiles(x,y,w,h,seed=1){const C=['#ff4fa3','#4fd6ff','#ffe14f','#9b5cff','#4fff8a','#ff7a3d'];for(let j=0;j<h;j+=10)for(let i=0;i<w;i+=10){const k=(i*7+j*13+seed*5)%C.length,lit=((i+j)/10+seed)%3==0;R(x+i,y+j,10,10,'#1c1430');R(x+i+1,y+j+1,8,8,lit?C[k]:'#2c2148');if(lit){R(x+i+1,y+j+1,8,1,'rgba(255,255,255,.5)');}}}
function wallTop(x,y,w,h,c1='#3b2a4a',c2='#2a1d36'){R(x,y,w,h,c1);R(x,y+h-2,w,2,c2);}
function plant(x,y){R(x-3,y-5,6,5,'#8a4f2a');R(x-3,y-5,6,1,'#b06a3a');R(x-5,y-14,10,9,'#3e8a3a');R(x-3,y-17,6,4,'#56b04e');P(x-4,y-12,'#7ad66e');P(x+2,y-15,'#7ad66e');}
function speaker(x,y,h=26){R(x,y,14,h,'#1a1a22');R(x+1,y+1,12,h-2,'#2a2a36');for(let j=0;j<h-6;j+=11){R(x+3,y+3+j,8,8,'#111');R(x+5,y+5+j,4,4,'#4a4a5a');P(x+6,y+6+j,'#8a8aa0');}}
function lamp(x,y){R(x,y-34,2,34,'#2c2c34');R(x-3,y-38,8,4,'#2c2c34');ctx.save();ctx.globalAlpha=.25;ctx.fillStyle='#ffe9a0';ctx.beginPath();ctx.moveTo(x-2,y-34);ctx.lineTo(x-14,y);ctx.lineTo(x+16,y);ctx.lineTo(x+4,y-34);ctx.fill();ctx.restore();R(x-2,y-34,6,2,'#ffe9a0');}
function bubble(x,y,t,c='#2a1a10',bg='#fff6dc'){const w=textW(t)+6;R(x-w/2,y-9,w,9,'#2a1a10');R(x-w/2+1,y-8,w-2,7,bg);R(x-1,y,2,2,'#2a1a10');text(t,x-w/2+3,y-7,c);}
function coin(x,y){R(x-2,y-2,5,5,'#a8741a');R(x-2,y-2,4,4,'#f2c13a');P(x-1,y-1,'#fff1a0');}
function beam(x,y,ang,c){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=c;ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(2,0);ctx.lineTo(18,120);ctx.lineTo(-18,120);ctx.fill();ctx.restore();}
function discoBall(x,y){R(x,y-14,1,10,'#888');ctx.fillStyle='#cfd6e6';ctx.beginPath();ctx.arc(x+.5,y,5,0,7);ctx.fill();for(let i=-4;i<5;i+=2)for(let j=-4;j<5;j+=2)if(i*i+j*j<20)P(x+i,y+j,(i+j)%4?'#8a92a8':'#ffffff');}
function stool(x,y){R(x-3,y-7,7,2,'#c0392b');R(x-3,y-7,7,1,'#e8584a');R(x,y-5,1,5,'#888');R(x-2,y-1,5,1,'#666');}
function sofa(x,y,w,c='#7a2d5a',d='#5a1f42',l='#9c3f74'){R(x,y,w,14,d);R(x+1,y+1,w-2,6,c);R(x+1,y+1,w-2,1,l);R(x,y+7,4,7,c);R(x+w-4,y+7,4,7,c);R(x+4,y+8,w-8,5,l);}
function grass(x,y,w,h){R(x,y,w,h,'#5aa046');for(let j=0;j<h;j+=6)for(let i=(j*5)%12;i<w;i+=12){P(x+i,y+j,'#6cb856');P(x+i+5,y+j+3,'#4a8a3a');}}
function road(x,y,w,h,c='#9a8a6a',e='#7a6a4e'){R(x,y,w,h,c);for(let i=0;i<w;i+=9)for(let j=0;j<h;j+=7)P(x+i+(j%3),y+j,e);}
function asphalt(x,y,w,h){R(x,y,w,h,'#3a3a46');R(x,y,w,1,'#55556a');R(x,y+h-1,w,1,'#2a2a34');for(let i=4;i<w;i+=14)R(x+i,y+h/2,7,1,'#d8c860');}
function tree(x,y){shadow(x,y,7);R(x-1,y-6,3,6,'#6a4024');ctx.fillStyle='#2f6e30';ctx.beginPath();ctx.arc(x,y-12,8,0,7);ctx.fill();ctx.fillStyle='#3e8a3a';ctx.beginPath();ctx.arc(x-2,y-14,6,0,7);ctx.fill();P(x-4,y-16,'#7ad66e');P(x+1,y-18,'#7ad66e');}
function flowers(x,y,n=6){for(let i=0;i<n;i++)P(x+(i*7)%18,y+(i*5)%9,['#ff7ab6','#fff','#ffe14f'][i%3]);}
function house(x,y,w,h,roof,wall,opt={}){ // x,y top-left of roof; door centred at bottom
  const rh=Math.round(h*0.55);shadow(x+w/2,y+h+1,w/2);
  R(x,y+rh,w,h-rh,wall);for(let j=y+rh+3;j<y+h;j+=4)R(x,j,w,1,'rgba(0,0,0,.12)');
  R(x-2,y,w+4,rh,roof);for(let j=0;j<rh;j+=3)R(x-2,y+j,w+4,1,j%6?'rgba(0,0,0,.18)':'rgba(255,255,255,.12)');R(x-2,y+rh-2,w+4,2,'rgba(0,0,0,.35)');
  const dx=x+w/2-4;R(dx,y+h-11,8,11,'#4a2c18');R(dx+1,y+h-10,6,10,'#6e4524');P(dx+5,y+h-5,'#f2c13a');
  const win=opt.night?'#ffd77a':'#a8d8f0';for(const wx of [x+5,x+w-13]){R(wx,y+rh+4,8,7,'#3a2414');R(wx+1,y+rh+5,6,5,win);R(wx+4,y+rh+5,1,5,'#3a2414');}
  if(opt.night)LIGHTS.push([x+9,y+rh+8,14,'#ffcc66'],[x+w-9,y+rh+8,14,'#ffcc66']);
  return {door:[x+w/2,y+h]};
}
let LIGHTS=[],LABELS=[];
function label(t,x,y){LABELS.push([t,x,y]);}
function drawLabels(){for(const [t,x,y] of LABELS){const w=textW(t)+6;R(x-w/2-1,y-1,w+2,9,'#1a0f08');R(x-w/2,y,w,7,'#f2d8a0');text(t,x-w/2+3,y+1,'#3b2414');}}
function lampPost(x,y,night){R(x,y-16,1,16,'#2c2c34');R(x-2,y-18,5,2,'#2c2c34');R(x-1,y-16,3,1,night?'#fff2b0':'#ccc');if(night)LIGHTS.push([x,y-14,22,'#ffe9a0']);}
function fountain(x,y){ctx.fillStyle='#8a8a96';ctx.beginPath();ctx.ellipse(x,y,16,8,0,0,7);ctx.fill();ctx.fillStyle='#4fa8e0';ctx.beginPath();ctx.ellipse(x,y,13,6,0,0,7);ctx.fill();R(x-2,y-10,4,10,'#a0a0ac');R(x-1,y-13,2,3,'#bff4ff');P(x-3,y-6,'#bff4ff');P(x+3,y-7,'#bff4ff');}
function pond(x,y,w,h){ctx.fillStyle='#3a7a3a';ctx.beginPath();ctx.ellipse(x,y,w/2+3,h/2+3,0,0,7);ctx.fill();ctx.fillStyle='#3a8ac8';ctx.beginPath();ctx.ellipse(x,y,w/2,h/2,0,0,7);ctx.fill();ctx.fillStyle='#5aaae0';ctx.beginPath();ctx.ellipse(x-6,y-3,w/3,h/4,0,0,7);ctx.fill();for(const [a,b] of [[-14,4],[10,-4],[18,6]]){R(x+a,y+b,5,3,'#4aa04a');P(x+a+2,y+b,'#ff9ad0');}}
function bench(x,y){R(x,y,14,3,'#8a5a30');R(x,y-3,14,2,'#a06a3a');R(x+1,y+3,1,2,'#333');R(x+12,y+3,1,2,'#333');}
function rock(x,y,ore){shadow(x,y+1,5);R(x-5,y-6,10,7,'#6a6a74');R(x-4,y-7,8,2,'#8a8a96');R(x-5,y-1,10,1,'#4a4a52');P(x-2,y-5,'#a8a8b4');if(ore){P(x-2,y-3,ore);P(x+2,y-4,ore);P(x,y-2,ore);P(x+3,y-2,ore);}}
function stump(x,y){R(x-4,y-4,8,4,'#7a4a24');R(x-4,y-5,8,2,'#c09060');P(x,y-4,'#8a5a30');}
function shell(x,y){R(x-2,y-2,5,3,'#f2c8b0');P(x-1,y-2,'#fff');R(x-2,y,5,1,'#c89078');}
function drift(x,y){R(x-6,y-1,12,2,'#a0866a');R(x-6,y-2,4,1,'#c0a888');P(x+5,y-3,'#a0866a');}
function forage(x,y,k){if(k==0){R(x-1,y-3,3,3,'#e8e0d0');R(x-2,y-5,5,2,'#c0392b');P(x-1,y-5,'#fff');}else if(k==1){R(x-3,y-4,6,4,'#3e8a3a');P(x-2,y-4,'#8a3ad0');P(x+1,y-3,'#8a3ad0');P(x,y-5,'#8a3ad0');}else{R(x,y-6,1,6,'#3e8a3a');R(x-2,y-7,5,2,'#ffe14f');}}
function pineTree(x,y){shadow(x,y,6);R(x-1,y-4,3,4,'#5a3420');for(let i=0;i<3;i++){ctx.fillStyle=i%2?'#2a6a3a':'#1f5a30';ctx.beginPath();ctx.moveTo(x,y-22+i*5);ctx.lineTo(x-7+i,y-8+i*2);ctx.lineTo(x+7-i,y-8+i*2);ctx.fill();}P(x-2,y-14,'#5aa060');}
function cliff(x,y,w,h){R(x,y,w,h,'#7a6a5a');for(let j=0;j<h;j+=5)R(x,y+j,w,1,'#5a4a3e');for(let i=0;i<w;i+=11)R(x+i,y,1,h,'#6a5a4c');R(x,y,w,2,'#9a8a72');R(x,y+h,w,2,'rgba(0,0,0,.3)');}
function water(x,y,w,h,c='#3a8ac8'){R(x,y,w,h,c);for(let j=2;j<h;j+=6)for(let i=(j*3)%14;i<w;i+=14)R(x+i,y+j,4,1,'#6ab0e8');}
function sand(x,y,w,h){R(x,y,w,h,'#e8d39a');for(let j=0;j<h;j+=5)for(let i=(j*7)%10;i<w;i+=10)P(x+i,y+j,'#d4bc80');}
function axeIcon(x,y){R(x,y-9,8,8,'rgba(255,255,255,.85)');R(x+4,y-8,1,6,'#7a4a24');R(x+1,y-8,3,3,'#9aa0aa');}
function pickIcon(x,y){R(x,y-9,8,8,'rgba(255,255,255,.85)');R(x+4,y-7,1,5,'#7a4a24');R(x+1,y-8,6,1,'#9aa0aa');P(x+1,y-7,'#9aa0aa');P(x+6,y-7,'#9aa0aa');}
function zoneLabel(t,x,y){const w=textW(t,2)+10;R(x-w/2,y,w,16,'#1a0f08');R(x-w/2+1,y+1,w-2,14,'#f2d8a0');text(t,x-w/2+5,y+4,'#3b2414',2);}
function hoverLane(x,y,w,h,night){R(x,y,w,h,'#2a2e3e');R(x,y,w,1,'#4a5068');R(x,y+h-1,w,1,'#1a1e2a');const c=night?'#4ff0ff':'#3ab0c8';if(w>h){for(let i=2;i<w;i+=10)R(x+i,y+(h>>1),5,1,c);}else{for(let j=2;j<h;j+=10)R(x+(w>>1),y+j,1,5,c);}if(night)for(let i=0;i<(w>h?w:h);i+=40)LIGHTS.push(w>h?[x+i,y+h/2,10,'#4ff0ff']:[x+w/2,y+i,10,'#4ff0ff']);}
function walk(x,y,w,h){R(x,y,w,h,'#b8bcc8');for(let j=0;j<h;j+=8)for(let i=(j/8%2)*8;i<w;i+=16)R(x+i,y+j,8,8,'#c8ccd8');}
function tower(x,y,w,h,face,win,night,opt={}){ // footprint: roof at (x,y,w,8), front face height h below
  shadow(x+w/2,y+8+h+1,w/2+2);R(x,y+8,w,h,face);R(x,y+8,2,h,'rgba(255,255,255,.18)');R(x+w-2,y+8,2,h,'rgba(0,0,0,.25)');
  R(x,y,w,8,opt.roof||'#5a6070');R(x+1,y+1,w-2,1,'rgba(255,255,255,.3)');if(opt.pad){ctx.strokeStyle='#ffe14f';ctx.lineWidth=.6;ctx.strokeRect(x+w/2-3,y+1.5,6,5);}
  for(let j=y+12;j<y+8+h-10;j+=6)for(let i=x+3;i<x+w-4;i+=5){const lit=night?((i*7+j*3)%5<3):((i+j)%4==0);R(i,j,3,3,lit?(night?win:'#cfeaff'):(night?'#1a1e30':'#6a8aa8'));}
  R(x+w/2-4,y+8+h-9,8,9,'#1a1e2a');R(x+w/2-3,y+8+h-8,6,8,night?'#4ff0ff':'#8ad0e0');
  if(opt.neon){R(x+2,y+8+h-14,w-4,2,opt.neon);if(night)LIGHTS.push([x+w/2,y+8+h-13,w*0.6,opt.neon]);}
  if(night)LIGHTS.push([x+w/2,y+8+h/2,w*0.55,'#7aa0ff']);
}
function palm(x,y){shadow(x,y,6);for(let i=0;i<12;i++)P(x+Math.round(Math.sin(i/4)),y-i,'#8a6a3a');ctx.fillStyle='#2f8a4a';for(const a of [-2.6,-1.9,-1.2,-0.5,0.2]){ctx.save();ctx.translate(x,y-12);ctx.rotate(a);ctx.fillRect(0,-1,9,2);ctx.restore();}P(x,y-13,'#6a4a2a');}
function pool(x,y,w,h){R(x-2,y-2,w+4,h+4,'#e8eef4');R(x,y,w,h,'#3ad0e8');for(let j=2;j<h;j+=5)for(let i=(j*3)%10;i<w;i+=10)R(x+i,y+j,4,1,'#9af0ff');}
function holoFountain(x,y,night){ctx.fillStyle='#5a6070';ctx.beginPath();ctx.ellipse(x,y,20,9,0,0,7);ctx.fill();ctx.fillStyle=night?'#1a3a5a':'#3a8ac8';ctx.beginPath();ctx.ellipse(x,y,17,7,0,0,7);ctx.fill();
  ctx.save();ctx.globalAlpha=night?.8:.55;ctx.fillStyle='#7af4ff';ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x,y-24);ctx.lineTo(x+4,y);ctx.fill();ctx.beginPath();ctx.ellipse(x,y-24,7,3,0,0,7);ctx.strokeStyle='#ff7af0';ctx.lineWidth=1;ctx.stroke();ctx.restore();if(night)LIGHTS.push([x,y-12,30,'#4ff0ff']);}
function neonFloor(x,y,w,h,night){R(x,y,w,h,night?'#1a1830':'#9aa0b8');for(let j=0;j<h;j+=12)for(let i=0;i<w;i+=12){R(x+i,y+j,12,1,night?'#ff4fd0':'#c0c4d8');R(x+i,y+j,1,12,night?'#4ff0ff':'#c0c4d8');}}
function dome(x,y,r,night){ctx.save();ctx.fillStyle=night?'rgba(80,220,140,.25)':'rgba(170,230,255,.35)';ctx.beginPath();ctx.ellipse(x,y,r,r*0.62,0,0,7);ctx.fill();ctx.strokeStyle=night?'#7affb0':'#e8f8ff';ctx.lineWidth=1;ctx.stroke();for(let k=-2;k<=2;k++){ctx.beginPath();ctx.ellipse(x,y,Math.abs(k)*r/3+0.1,r*0.62,0,0,7);ctx.globalAlpha=.35;ctx.stroke();}ctx.restore();if(night)LIGHTS.push([x,y,r,'#5aff9a']);}
function hovercar(x,y,c){shadow(x+5,y+5,5);R(x,y,11,5,c);R(x+2,y-2,7,3,'#bff4ff');R(x,y+4,11,1,'rgba(0,0,0,.3)');P(x+10,y+2,'#fff6a0');}
function scrap(x,y){R(x-7,y-5,14,5,'#6a5a4a');R(x-5,y-8,6,3,'#8a7a6a');R(x+1,y-9,5,4,'#4a6a8a');P(x-3,y-7,'#c08a4a');P(x+3,y-8,'#d0d0e0');R(x-7,y-1,14,1,'#3a3028');}
function crane(x,y){R(x,y-40,3,40,'#e0a020');for(let j=y-40;j<y;j+=4)P(x+1,j,'#8a6010');R(x-14,y-42,34,3,'#e0a020');R(x+16,y-39,1,14,'#555');R(x+14,y-25,5,4,'#555');}
function boat(x,y,c){R(x,y,18,5,'#f2f2f2');R(x+2,y+5,14,2,c);R(x+6,y-4,6,4,'#bff4ff');}
function stage(x,y,w,night){R(x,y,w,10,'#2a2e3e');R(x,y,w,2,night?'#ff4fd0':'#8a90a8');R(x+4,y-14,2,14,'#555');R(x+w-6,y-14,2,14,'#555');R(x+4,y-16,w-8,3,'#3a3e50');if(night){LIGHTS.push([x+w/2,y+4,24,'#ff4fd0']);}}
function cliffs(night){const c1=night?'#2a2440':'#7a6a8a',c2=night?'#1e1a30':'#5a4e6a';ctx.fillStyle=c2;ctx.beginPath();ctx.moveTo(0,22);for(let x=0;x<=600;x+=20)ctx.lineTo(x,8+((x*37)%14));ctx.lineTo(600,22);ctx.fill();ctx.fillStyle=c1;ctx.beginPath();ctx.moveTo(0,22);for(let x=0;x<=600;x+=14)ctx.lineTo(x,14+((x*23)%9));ctx.lineTo(600,22);ctx.fill();R(0,20,600,3,night?'#14102a':'#4a4058');}
// Dense futuristic city v2. 600x450 world px, S=3.
let sd=1;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,ri=(a,b)=>a+Math.floor(rnd()*(b-a+1)),pick=a=>a[Math.floor(rnd()*a.length)];
let EMIT=[],NIGHT=false;
const E=(x,y,w,h,c)=>{R(x,y,w,h,c);if(NIGHT)EMIT.push([x,y,w,h,c]);};
const NEONS=['#ff4fd0','#4ff0ff','#ffe14f','#7affb0','#ff7a3d','#b07aff'];
const FACES=['#4a5a7a','#3a4a6a','#5a4a7a','#2a3a5a','#6a7a8a','#7a5a5a','#4a6a6a','#8a7a6a','#5a6a8a','#6a4a6a','#3a5a5a','#a08a7a'];
function roadH(x,y,w,h){R(x,y,w,h,'#353844');R(x,y,w,1,'#9aa0ac');R(x,y+h-1,w,1,'#9aa0ac');const m=y+(h>>1);R(x,m-1,w,1,'#e0b030');R(x,m,w,1,'#e0b030');for(let i=x+2;i<x+w;i+=10){R(i,y+4,5,1,'#d8dce4');R(i,y+h-5,5,1,'#d8dce4');}if(NIGHT)for(let i=x+5;i<x+w;i+=30)LIGHTS.push([i,m,9,'#4ff0ff']);}
function roadV(x,y,w,h){R(x,y,w,h,'#353844');R(x,y,1,h,'#9aa0ac');R(x+w-1,y,1,h,'#9aa0ac');const m=x+(w>>1);R(m-1,y,1,h,'#e0b030');R(m,y,1,h,'#e0b030');for(let j=y+2;j<y+h;j+=10){R(x+4,j,1,5,'#d8dce4');R(x+w-5,j,1,5,'#d8dce4');}}
function crossH(x,y,w){for(let i=0;i<w;i+=3)R(x+i,y,2,1,'#eef');}
function zebra(x,y,w,h,vert){R(x,y,w,h,'#353844');if(vert)for(let j=1;j<h;j+=3)R(x+1,y+j,w-2,2,'#e8ecf4');else for(let i=1;i<w;i+=3)R(x+i,y+1,2,h-2,'#e8ecf4');}
function sidewalk(x,y,w,h){R(x,y,w,h,'#b4b8c4');for(let j=0;j<h;j+=5)for(let i=(j/5%2)*5;i<w;i+=10)R(x+i,y+j,5,5,'#c2c6d2');}
function tlight(x,y){R(x,y-12,1,12,'#2a2a30');R(x-1,y-16,3,6,'#1a1a20');E(x,y-15,1,1,'#ff4040');E(x,y-12,1,1,'#40ff70');}
function slamp(x,y){R(x,y-16,1,16,'#3a3a44');R(x-1,y-17,4,1,'#3a3a44');E(x+1,y-16,2,1,'#fff2c0');if(NIGHT)LIGHTS.push([x+2,y-6,16,'#ffe9a0']);}
function planter(x,y){R(x-4,y-3,8,3,'#6a6e7a');R(x-4,y-3,8,1,'#8a8e9a');ctx.fillStyle='#2f6e30';ctx.beginPath();ctx.arc(x,y-8,5,0,7);ctx.fill();ctx.fillStyle='#46943e';ctx.beginPath();ctx.arc(x-1,y-9,3,0,7);ctx.fill();}
function vend(x,y,c){R(x,y-10,6,10,'#2a2e3e');E(x+1,y-9,4,4,c);R(x+1,y-4,4,2,'#111');}
function hcar(x,y,c,v){shadow(x+(v?3:6),y+(v?6:4),5);if(v){R(x,y,6,11,c);R(x+1,y+2,4,4,'#bff4ff');E(x+1,y+10,1,1,'#ff4040');E(x+4,y+10,1,1,'#ff4040');}else{R(x,y,12,6,c);R(x+3,y+1,5,3,'#bff4ff');R(x,y+5,12,1,'rgba(0,0,0,.3)');E(x+11,y+1,1,2,'#fff6a0');E(x,y+1,1,2,'#ff4040');}}
function hbike(x,y,c){R(x,y,7,3,c);R(x+2,y-3,3,3,'#222');E(x+6,y+1,1,1,'#fff6a0');}
function tram(x,y){shadow(x+30,y+8,30);R(x,y,60,9,'#e8eef4');R(x,y+7,60,2,'#4ff0ff');for(let i=x+3;i<x+57;i+=7)E(i,y+2,5,3,NIGHT?'#ffe7a0':'#5a7a9a');R(x,y,60,1,'#fff');}
function busStop(x,y){R(x,y-14,22,2,'#4a5068');R(x,y-12,1,12,'#4a5068');R(x+21,y-12,1,12,'#4a5068');R(x+1,y-12,20,10,'rgba(170,230,255,.45)');E(x+2,y-11,6,8,'#4ff0ff');R(x+10,y-4,10,2,'#8a5a30');text('T',x+4,y-10,'#123',1);}
// building: x,y = roof top-left, w, rd roof depth, fh facade height; base = y+rd+fh
function bld(x,y,w,rd,fh,o={}){const face=o.face||pick(FACES),base=y+rd+fh;shadow(x+w/2,base+1,w/2);
  R(x,y+rd,w,fh,face);R(x,y+rd,1,fh,'rgba(255,255,255,.2)');R(x+w-2,y+rd,2,fh,'rgba(0,0,0,.25)');
  const roof=o.roof||pick(['#5a6070','#6a6e7a','#4a4e5a','#707888','#5a5068']);R(x,y,w,rd,roof);R(x,y,w,1,'rgba(255,255,255,.35)');R(x,y+rd-1,w,1,'rgba(0,0,0,.3)');
  // roof details
  const rk=o.rk!=null?o.rk:ri(0,5);
  if(rk==0&&w>12){R(x+2,y+2,w-4,rd-3,'#3e8a3a');for(let i=x+3;i<x+w-3;i+=3)P(i,y+2+(i%2),'#6ac05a');}
  else if(rk==1){for(let i=x+2;i+5<x+w;i+=7){R(i,y+2,5,4,'#c8ccd4');R(i+1,y+3,3,2,'#7a7e8a');}}
  else if(rk==2&&w>10){ctx.fillStyle='#8a6a4a';ctx.beginPath();ctx.ellipse(x+w-6,y+rd/2,3,2,0,0,7);ctx.fill();R(x+3,y+2,4,3,'#c8ccd4');}
  else if(rk==3){R(x+w/2,y-8,1,9,'#888');E(x+w/2,y-9,1,1,'#ff4040');R(x+2,y+2,4,3,'#c8ccd4');}
  else if(rk==4&&w>14){ctx.strokeStyle='#ffe14f';ctx.lineWidth=.6;ctx.beginPath();ctx.arc(x+w/2,y+rd/2,Math.min(w,rd)/2-1.5,0,7);ctx.stroke();}
  else{R(x+2,y+2,w-4,2,'#8a8e9a');}
  // windows
  const shopH=o.noshop?0:12,wt=o.wt!=null?o.wt:ri(0,3),win=pick(['#ffe7a0','#bff4ff','#ffb0f0','#d0ffd8']);
  const wy0=y+rd+3,wy1=base-shopH-2;
  if(wt==3){for(let j=wy0;j<wy1;j+=4){R(x+2,j,w-4,2,'#8ab8d8');if(NIGHT&&rnd()<.6)E(x+2+ri(0,w-8),j,ri(3,6),2,win);}}
  else{const ww=wt==1?2:3,gx=wt==2?6:5,gy=wt==2?7:5;for(let j=wy0;j+3<=wy1;j+=gy)for(let i=x+2;i+ww<=x+w-2;i+=gx){if(NIGHT&&rnd()<.55)E(i,j,ww,3,win);else R(i,j,ww,3,NIGHT?'#1a1e30':(rnd()<.2?'#cfeaff':'#6a8aa8'));}}
  if(rnd()<.35&&fh>20)for(let k=0;k<2;k++)R(x+w-6,wy0+4+k*9,4,3,'#9a9ea8'); // AC units
  // street-level shop
  if(shopH){R(x+1,base-shopH,w-2,shopH,'#2a2a34');const nc=o.neon||pick(NEONS);E(x+2,base-9,w-4,6,NIGHT?'#ffe7c0':'#8ad0e0');R(x+w/2-2,base-8,4,8,'#14141c');
    for(let i=x;i<x+w;i+=4)R(i,base-shopH,2,3,nc),R(i+2,base-shopH,2,3,'#f2f2f2');
    if(o.sign){const tw=textW(o.sign);R(x+w/2-tw/2-2,base-shopH-8,tw+4,7,'#14141c');(NIGHT?(()=>{if(NIGHT)LIGHTS.push([x+w/2,base-shopH-4,14,nc]);EMIT.push(['T',o.sign,x+w/2-tw/2,base-shopH-7,nc]);}):()=>{})();text(o.sign,x+w/2-tw/2,base-shopH-7,nc);}
    if(NIGHT)LIGHTS.push([x+w/2,base-4,w*0.5,nc]);}
  // vertical neon sign / holo billboard
  if(o.vneon||(!o.plain&&rnd()<.3&&fh>26)){const c=o.vneon||pick(NEONS),sx=rnd()<.5?x-1:x+w-3;E(sx,y+rd+4,3,Math.min(18,fh-16),c);if(NIGHT)LIGHTS.push([sx+1,y+rd+12,12,c]);}
  if(o.holo){const c=pick(NEONS);R(x+3,y+rd+5,w-6,12,'#101828');E(x+4,y+rd+6,w-8,10,c+'');for(let i=x+5;i<x+w-5;i+=4)R(i,y+rd+8,2,6,'rgba(255,255,255,.35)');if(NIGHT)LIGHTS.push([x+w/2,y+rd+11,w*0.7,c]);}
  return base;}
function row(x0,x1,base,hmin,hmax,o={}){let x=x0;while(x<x1-8){let w=ri(o.wmin||16,o.wmax||34);if(x1-x-w<12)w=x1-x;const fh=ri(hmin,hmax);bld(x,base-fh-8,w,8,fh,Object.assign({},o,{holo:o.holoP&&rnd()<o.holoP}));x+=w;}}
// pedestrians: procedural, varied
const SKIN=['#f2c8a0','#e0a878','#c08058','#8a5a3a','#5a3a24','#f8dcc0'],HAIR=['#2a1a10','#5a3a1a','#e8c860','#c84a2a','#f0f0f0','#4ff0ff','#ff4fd0','#1a1a2a','#9a5ad0'];
const TOP=['#e04050','#4060e0','#40b060','#f0c040','#f0f0f0','#2a2a34','#ff4fd0','#4ff0ff','#8a5ad0','#f07a30','#3a8a8a'],BOT=['#2a2e4a','#3a3a40','#5a4a3a','#1a1a20','#6a6a7a','#2a4a6a'];
function ped(x,y,s){sd=s*7919+13;const sk=pick(SKIN),hr=pick(HAIR),tp=pick(TOP),bt=pick(BOT),wide=ri(0,2),tall=ri(0,3),hs=ri(0,4),dress=rnd()<.2,dir=ri(0,2);
  const bw=6+wide,h=18+tall;shadow(x,y,4+wide/2);const l=x-(bw>>1),O='#1a1018';
  // legs
  const ly=y-6;R(l+1,ly,2,6,bt);R(l+bw-3,ly,2,6,bt);R(l+1,y-1,2,1,O);R(l+bw-3,y-1,2,1,O);
  // torso
  const ty=y-6-(7+tall);R(l,ty,bw,7+tall,tp);if(dress)R(l-1,ly-2,bw+2,4,tp);R(l,ty,1,7+tall,'rgba(0,0,0,.25)');R(l-1,ty+1,1,5,tp);R(l+bw,ty+1,1,5,tp);R(l-1,ty+6,1,1,sk);R(l+bw,ty+6,1,1,sk);
  // head
  const hx=x-3,hy=ty-6;R(hx,hy,6,6,sk);if(dir!=1){P(hx+1+(dir==2?1:0),hy+3,O);P(hx+4+(dir==2?1:0)-(dir==0?0:0),hy+3,O);}
  if(dir==1)R(hx,hy,6,5,hr);
  if(hs==0)R(hx,hy-1,6,2,hr);else if(hs==1){R(hx-1,hy-1,8,2,hr);R(hx-1,hy,1,6,hr);R(hx+6,hy,1,6,hr);}else if(hs==2){R(hx+1,hy-3,4,3,hr);}else if(hs==3){R(hx-1,hy-2,8,2,pick(TOP));R(hx-2,hy-1,10,1,'#222');}else{R(hx,hy-1,6,2,hr);R(hx+5,hy,2,7,hr);}
  if(rnd()<.2)R(hx+1,hy+2,4,1,'#1a1a2a'); // shades
}
function crowd(x0,y0,x1,y1,n,seed){const L=[];sd=seed;for(let i=0;i<n;i++)L.push([ri(x0,x1),ri(y0,y1),seed*100+i]);return L;}
function bigB(x,base,w,fh,o={}){const rd=o.rd||24,y=base-fh-rd,face=o.face||pick(FACES);shadow(x+w/2,base+2,w/2);
  R(x,y+rd,w,fh,face);R(x,y+rd,2,fh,'rgba(255,255,255,.18)');R(x+w-4,y+rd,4,fh,'rgba(0,0,0,.28)');
  R(x,y,w,rd,o.roof||pick(['#5a6070','#4a4e5a','#5a5068','#606878']));R(x,y,w,2,'rgba(255,255,255,.3)');R(x,y+rd-2,w,2,'rgba(0,0,0,.35)');
  for(let i=x+6;i+14<x+w;i+=26){R(i,y+5,14,10,'#c8ccd4');R(i+2,y+7,10,6,'#7a7e8a');R(i+3,y+8,8,1,'#5a5e6a');}
  if(rnd()<.5){R(x+w-20,y-14,2,18,'#888');E(x+w-20,y-16,2,2,'#ff4040');}
  const shopH=o.noshop?0:40,win=pick(['#ffe7a0','#bff4ff','#ffb0f0','#d0ffd8']);
  for(let fy=y+rd+8;fy+16<base-shopH-4;fy+=24){R(x+2,fy+18,w-4,2,'rgba(0,0,0,.25)');for(let i=x+8;i+10<=x+w-8;i+=16){R(i-1,fy-1,12,16,'#2a2e3a');if(rnd()<.55)E(i,fy,10,14,win);else R(i,fy,10,14,'#1a1e30');R(i,fy+7,10,1,'#2a2e3a');}
    if(rnd()<.25){const ax=x+w-22;R(ax,fy+4,12,9,'#9a9ea8');R(ax+2,fy+6,8,5,'#6a6e78');}}
  if(o.holo){const c=pick(NEONS),hy=y+rd+14;R(x+10,hy,w-20,40,'#101828');E(x+12,hy+2,w-24,36,c);for(let i=x+14;i<x+w-14;i+=8)R(i,hy+6,4,28,'rgba(255,255,255,.3)');LIGHTS.push([x+w/2,hy+20,w*0.6,c]);}
  if(shopH){const nc=o.neon||pick(NEONS);R(x+2,base-shopH,w-4,shopH,'#22222c');E(x+8,base-30,w-16,26,'#ffe7c0');for(let i=x+8;i<x+w-8;i+=20)R(i,base-30,2,26,'#22222c');
    R(x+w/2-8,base-30,16,30,'#14141c');E(x+w/2-6,base-28,12,28,'#ffd090');
    for(let i=x;i<x+w;i+=8){R(i,base-shopH,4,8,nc);R(i+4,base-shopH,4,8,'#f2f2f2');}R(x,base-shopH+8,w,2,'rgba(0,0,0,.35)');
    if(o.sign){const tw=textW(o.sign,2);R(x+w/2-tw/2-4,base-shopH-16,tw+8,14,'#14141c');EMIT.push(['T2',o.sign,x+w/2-tw/2,base-shopH-12,nc]);text(o.sign,x+w/2-tw/2,base-shopH-12,nc,2);LIGHTS.push([x+w/2,base-shopH-9,30,nc]);}
    LIGHTS.push([x+w/2,base-10,w*0.55,nc]);}
  if(o.vneon){const sx=x+w-8;E(sx,y+rd+10,6,Math.min(70,fh-60),o.vneon);LIGHTS.push([sx+3,y+rd+40,26,o.vneon]);}}
function bigLamp(x,y){shadow(x,y,4);R(x,y-44,2,44,'#3a3a44');R(x-6,y-46,14,3,'#3a3a44');E(x-4,y-43,10,2,'#fff2c0');LIGHTS.push([x+1,y-20,40,'#ffe9a0'],[x+1,y-6,22,'#ffe9a0']);}
function bigTree(x,y){shadow(x,y,10);R(x-6,y-6,12,6,'#6a6e7a');R(x-6,y-6,12,2,'#8a8e9a');R(x-1,y-16,3,10,'#6a4024');ctx.fillStyle='#24582a';ctx.beginPath();ctx.arc(x,y-24,12,0,7);ctx.fill();ctx.fillStyle='#2f6e30';ctx.beginPath();ctx.arc(x-3,y-27,8,0,7);ctx.fill();P(x-5,y-30,'#56b04e');P(x+3,y-26,'#56b04e');}
function bigBench(x,y){R(x,y-6,30,3,'#a06a3a');R(x,y-2,30,4,'#8a5a30');R(x+2,y+2,2,4,'#333');R(x+26,y+2,2,4,'#333');}
function bigVend(x,y,c){shadow(x+8,y,8);R(x,y-28,16,28,'#2a2e3e');E(x+2,y-26,12,12,c);for(let j=0;j<3;j++)R(x+3+j*4,y-23,2,6,'rgba(255,255,255,.5)');R(x+3,y-10,10,4,'#111');LIGHTS.push([x+8,y-18,18,c]);}
function pcar(x,y,c){shadow(x+18,y+12,16);R(x,y,36,14,c);R(x+8,y+2,18,8,'#bff4ff');R(x,y+12,36,2,'rgba(0,0,0,.35)');E(x+34,y+3,2,3,'#fff6a0');E(x,y+3,2,3,'#ff4040');LIGHTS.push([x+44,y+6,14,'#fff6a0']);}
