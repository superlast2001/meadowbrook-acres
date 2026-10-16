// ===== v0.0.0.39: native-res pixel-art interiors (1 art px = 1 world px, nearest-neighbour scaled) =====
let PX=null,_ps=1;
function prnd(){_ps=(_ps*16807)%2147483647;return (_ps-1)/2147483646;}
function hx(c,f){const n=parseInt(c.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=v=>Math.max(0,Math.min(255,Math.round(f>0?v+(255-v)*f:v*(1+f))));return '#'+[m(r),m(g),m(b)].map(v=>v.toString(16).padStart(2,'0')).join('');}
function ramp(c){return {o:hx(c,-.72),d:hx(c,-.35),m:c,l:hx(c,.25),h:hx(c,.55)};}
function pF(x,y,w,h,c){PX.fillStyle=c;PX.fillRect(x|0,y|0,w|0,h|0);}
function pD(x,y,c){PX.fillStyle=c;PX.fillRect(x|0,y|0,1,1);}
// outlined, shaded panel
function pan(x,y,w,h,c,o){const r=ramp(c);pF(x,y,w,h,o||r.o);pF(x+1,y+1,w-2,h-2,r.m);pF(x+1,y+1,w-2,1,r.l);pF(x+1,y+1,1,h-2,r.l);pF(x+1,y+h-2,w-2,1,r.d);pF(x+w-2,y+1,1,h-2,r.d);pD(x+1,y+1,r.h);}
// 3/4 block: footprint x,y,w,d(top depth) z(front height)
function blk3(x,y,w,d,z,top,front,o){const t=ramp(top),f=ramp(front||hx(top,-.25)),oc=o||t.o;pF(x,y-z,w,d+z,oc);pF(x+1,y-z+1,w-2,d-1,t.m);pF(x+1,y-z+1,w-2,1,t.h);pF(x+1,y-z+d-1,w-2,1,t.l);pF(x+1,y-z+d,w-2,z-1,f.m);pF(x+1,y-z+d,w-2,1,f.l);pF(x+1,y+d-2,w-2,1,f.d);
 PX.fillStyle='rgba(20,10,30,.28)';PX.fillRect(x+2,y+d,w-1,2);PX.fillRect(x+w,y-z+2,1,d+z-1);}
function grain(x,y,w,h,c){const r=ramp(c);for(let j=0;j<h;j+=2){let i=0;while(i<w){const L=3+prnd()*8|0;if(prnd()<.5)pF(x+i,y+j,Math.min(L,w-i),1,prnd()<.5?r.d:r.l);i+=L+2;}}}
function dith(x,y,w,h,c,a){PX.fillStyle=c;for(let j=0;j<h;j++)for(let i=(j&1);i<w;i+=2)if(!a||prnd()<a)PX.fillRect(x+i,y+j,1,1);}
function ptxt(t,x,y,c,o){PX.font='bold 7px monospace';PX.textBaseline='top';if(o){PX.fillStyle=o;for(const [a,b] of [[-1,0],[1,0],[0,-1],[0,1]])PX.fillText(t,x+a,y+b);}PX.fillStyle=c;PX.fillText(t,x,y);}
// ---- floor/walls ----
function tileFloor(x,y,w,h,a,b,s=16){for(let j=0;j<h;j+=s)for(let i=0;i<w;i+=s){const c=((i+j)/s)&1?a:b,r=ramp(c);pF(x+i,y+j,s,s,r.m);pF(x+i,y+j,s,1,r.h);pF(x+i,y+j,1,s,r.l);pF(x+i,y+j+s-1,s,1,r.d);pF(x+i+s-1,y+j,1,s,r.d);for(let k=0;k<3;k++)pD(x+i+2+prnd()*(s-4),y+j+2+prnd()*(s-4),r.l);pD(x+i+3,y+j+3,'#ffffff');}}
function woodFloor(x,y,w,h,c){const r=ramp(c);pF(x,y,w,h,r.m);for(let j=0;j<h;j+=6){pF(x,y+j,w,1,r.d);let off=(j*7)%40;for(let i=-off;i<w;i+=40){pF(x+Math.max(0,i),y+j,1,6,r.d);}grain(x,y+j+1,w,5,c);pF(x,y+j+1,w,1,r.l);}}
function wallBack(W,h,c,stripe){const r=ramp(c);pF(0,0,W,h,r.m);for(let i=0;i<W;i+=12){pF(i,0,6,h-6,stripe||r.l);}dith(0,0,W,h-6,r.d,.06);pF(0,0,W,3,r.h);pF(0,3,W,1,r.d);// crown
 pF(0,h-7,W,1,r.o);pF(0,h-6,W,5,'#f4ece0');pF(0,h-6,W,1,'#ffffff');pF(0,h-2,W,1,'#b8a890');pF(0,h-1,W,1,'#4a3020');PX.fillStyle='rgba(0,0,0,.18)';PX.fillRect(0,h,W,3);}
function sideWall(W,H,top,c){const r=ramp(c);for(const left of [1,0]){for(let k=0;k<10;k++){const x=left?k:W-1-k;pF(x,top,1,H-top,k<2?r.o:k<4?r.d:r.m);}}}
// ---- props ----
function plantP(x,y,big){const pot=ramp('#c8643a');const w=big?14:10,h=big?11:8;pF(x-w/2,y-h,w,h,pot.o);pF(x-w/2+1,y-h+1,w-2,h-2,pot.m);pF(x-w/2+1,y-h+1,w-2,2,pot.l);pF(x-w/2+1,y-2,w-2,1,pot.d);pF(x-w/2,y-h-2,w,2,pot.o);pF(x-w/2+1,y-h-2+0,w-2,1,pot.h);
 const L=['#1f6a34','#2f8f46','#48b85a','#7ade6a'];const n=big?26:14,R=big?13:8;for(let i=0;i<n;i++){const a=-Math.PI*(.05+.9*prnd()),rr=R*(.4+.6*prnd()),lx=x+Math.cos(a)*rr,ly=y-h-3+Math.sin(a)*rr*1.2;pF(lx-2,ly-1,4,3,L[0]);pF(lx-1,ly-1,3,2,L[1+(i%2)]);pD(lx,ly-1,L[3]);}}
function lampP(x,y,c){pF(x-4,y-1,8,2,'#3a2a20');pF(x,y-24,1,23,'#5a4a3a');const r=ramp(c);pF(x-6,y-33,13,9,r.o);pF(x-5,y-32,11,7,r.m);pF(x-5,y-32,11,2,r.h);pF(x-5,y-26,11,1,r.d);LIGHTS.push([x,y-28,34,c]);}
function rugP(x,y,w,h,c1,c2,c3){const a=ramp(c1);pF(x,y,w,h,a.o);pF(x+1,y+1,w-2,h-2,c2);pF(x+3,y+3,w-6,h-6,a.m);for(let i=x+5;i<x+w-5;i+=6){pF(i,y+5,3,3,c3);pF(i,y+h-8,3,3,c3);}for(let j=y+9;j<y+h-9;j+=6){pF(x+5,j,3,3,c3);pF(x+w-8,j,3,3,c3);}dith(x+9,y+9,w-18,h-18,a.l,.3);for(let i=x+1;i<x+w-1;i+=2){pD(i,y-1,c2);pD(i,y+h,c2);}}
function cushion(x,y,c){const r=ramp(c);pF(x,y,12,8,r.o);pF(x+1,y+1,10,6,r.m);pF(x+1,y+1,10,2,r.l);pF(x+2,y+1,3,1,r.h);pF(x+1,y+6,10,1,r.d);pD(x+6,y+4,r.d);}
function books(x,y,n){const C=['#d84a3a','#3a7ad8','#f0c040','#4ab86a','#9a5ad8','#f08ab0','#e07a2a'];for(let i=0;i<n;i++){const h=7+(i*5%4),c=C[(i*3+x)%7];pF(x+i*3,y-h,3,h,hx(c,-.6));pF(x+i*3,y-h+1,2,h-1,c);pD(x+i*3,y-h+2,hx(c,.5));}}
function frame(x,y,w,h,paint){pF(x,y,w,h,'#4a3020');pF(x+1,y+1,w-2,h-2,'#c89048');pF(x+2,y+2,w-4,h-4,'#2a1a10');paint(x+3,y+3,w-6,h-6);pD(x+1,y+1,'#ffe0a0');}
function windowP(x,y,w,h,night){pF(x,y,w,h,'#f4f4f4');pF(x+1,y+1,w-2,h-2,'#b8c0c8');const sx=x+3,sy=y+3,sw=w-6,sh=h-6;
 for(let j=0;j<sh;j++){const t=j/sh;pF(sx,sy+j,sw,1,night?(t<.5?'#1a1048':'#3a2068'):(t<.4?'#5ab8f0':t<.7?'#8ad4f8':'#c8ecff'));}
 // city skyline
 for(let i=0;i<sw;i+=5){const bh=6+((i*13)%9);pF(sx+i,sy+sh-bh,4,bh,night?'#20184a':'#7a98b8');pF(sx+i,sy+sh-bh,4,1,night?'#3a2a6a':'#a8c0d8');for(let k=sy+sh-bh+2;k<sy+sh-1;k+=3)pD(sx+i+1+(k%2),k,night?'#ffe14f':'#d8e8f8');}
 if(!night){pF(sx+sw-8,sy+3,4,4,'#fff6c0');}pF(x+(w>>1),y+1,1,h-2,'#f4f4f4');pF(x+1,y+(h>>1),w-2,1,'#f4f4f4');PX.fillStyle='rgba(255,255,255,.35)';for(let k=0;k<6;k++)PX.fillRect(sx+2+k,sy+2+k*2,1,3);}
function curtain(x,y,h,c){const r=ramp(c);pF(x,y,9,h,r.o);for(let i=1;i<8;i++)pF(x+i,y+1,1,h-2,i%3==0?r.d:i%3==1?r.m:r.l);pF(x,y+h-6,9,2,'#c89048');}
function tvP(x,y,w,h){pF(x,y,w,h,'#101018');pF(x+1,y+1,w-2,h-2,'#2a2a36');const sx=x+2,sy=y+2,sw=w-4,sh=h-5;for(let j=0;j<sh;j++)pF(sx,sy+j,sw,1,j<sh*.55?'#ff9a5a':'#3ab0e8');pF(sx,sy+(sh*.55|0),sw,1,'#ffe0a0');pF(sx+sw*.6,sy+3,6,6,'#fff2a0');for(let i=0;i<sw;i+=7)pF(sx+i,sy+sh-4,4,4,'#2a6a3a');PX.fillStyle='rgba(255,255,255,.25)';for(let k=0;k<8;k++)PX.fillRect(sx+1+k,sy+1+k,1,1);pF(x+(w>>1)-1,y+h-2,2,1,'#ff4f4f');}
function fishtankP(x,y,w,h){pF(x,y,w,h,'#2a3a48');pF(x+1,y+1,w-2,h-2,'#4ad0f0');for(let j=0;j<h-2;j++)pF(x+1,y+1+j,w-2,1,hx('#4ad0f0',-(j/h)*.5));pF(x+1,y+h-6,w-2,4,'#e8d090');dith(x+1,y+h-6,w-2,4,'#c8a860',.5);
 for(let i=x+3;i<x+w-3;i+=4){const ph=5+((i*7)%8);for(let k=0;k<ph;k++)pD(i+((k>>1)&1),y+h-6-k,k%2?'#3aa84a':'#5ad06a');}
 for(const [fx,fy,fc] of [[x+8,y+8,'#ff7a2a'],[x+w-12,y+13,'#ffe14f'],[x+w/2,y+6,'#ff4fa0']]){pF(fx,fy,4,3,fc);pD(fx+4,fy+1,fc);pD(fx-1,fy,fc);pD(fx-1,fy+2,fc);pD(fx+1,fy+1,'#202020');}
 for(let k=0;k<5;k++)pD(x+w-6+(k%2),y+4+k*3,'#e8ffff');pF(x+1,y+1,w-2,1,'#bff4ff');pF(x+2,y+2,1,h-6,'rgba(255,255,255,.6)');pF(x-1,y-2,w+2,3,'#2a2a36');pF(x,y-2,w,1,'#5a5a6a');LIGHTS.push([x+w/2,y+h/2,30,'#4ff0ff']);}
function tubP(x,y,w,h){pF(x,y,w,h,'#7a8a98');pF(x+1,y+1,w-2,h-2,'#f8fcff');pF(x+1,y+1,w-2,2,'#ffffff');pF(x+4,y+4,w-8,h-10,'#5ac8e8');for(let j=0;j<h-10;j+=3)for(let i=(j%2)*3;i<w-8;i+=6)pF(x+4+i,y+4+j,3,1,'#9ae8f8');
 for(let k=0;k<12;k++){const bx=x+6+prnd()*(w-14),by=y+5+prnd()*(h-14);pF(bx,by,3,3,'#ffffff');pD(bx+1,by+1,'#d8f0ff');}
 // rubber duck
 pF(x+w*.55,y+h*.35,6,4,'#ffd820');pF(x+w*.55+3,y+h*.35-3,4,4,'#ffd820');pD(x+w*.55+6,y+h*.35-2,'#ff7a20');pD(x+w*.55+4,y+h*.35-2,'#202020');pF(x+1,y+h-4,w-2,3,'#c8d4e0');pF(x+w-8,y-4,2,5,'#c0c8d0');pF(x+w-10,y-4,6,2,'#d8e0e8');}
function showerP(x,y,w,h){pF(x,y,w,h,'#c0d0dc');pF(x+1,y+1,w-2,h-2,'rgba(200,240,255,.55)');PX.fillStyle='rgba(255,255,255,.7)';for(let k=0;k<10;k++)PX.fillRect(x+3+k,y+3+k*2,1,4);pF(x+w-6,y+2,3,2,'#a0a8b0');for(let k=0;k<6;k++)pD(x+w-6+(k%3),y+6+k*3,'#bfefff');}
function toiletP(x,y){pF(x,y-14,12,8,'#8a9aa8');pF(x+1,y-13,10,6,'#ffffff');pF(x+1,y-6,12,8,'#8a9aa8');pF(x+2,y-5,10,6,'#f4f8fc');pF(x+4,y-4,6,3,'#c8e8f4');}
function sinkP(x,y){blk3(x,y,22,8,12,'#f4f4f8','#d0d4dc');pF(x+6,y-11,10,5,'#9ad0e8');pF(x+10,y-16,2,5,'#c0c8d0');pF(x+3,y-26,16,12,'#c8d0d8');pF(x+4,y-25,14,10,'#e8f8ff');pF(x+5,y-24,3,6,'#ffffff');}
function bedP(x,y,w,h){pF(x,y-6,w,h+6,'#5a3a20');grain(x+1,y-5,w-2,6,'#a0683a');pF(x+1,y-5,w-2,1,'#d09858');pF(x+2,y+1,w-4,h-3,'#f4f4f8');pF(x+3,y+3,(w-8)/2,9,'#ffffff');pF(x+3+(w-8)/2+2,y+3,(w-8)/2,9,'#ffffff');pF(x+3,y+11,w-6,1,'#c8c8d8');
 const q=ramp('#e86aa0');pF(x+2,y+15,w-4,h-17,q.o);pF(x+3,y+16,w-6,h-19,q.m);for(let j=y+18;j<y+h-4;j+=6)for(let i=x+5;i<x+w-6;i+=6){pF(i,j,3,3,q.l);pD(i,j,q.h);}pF(x+3,y+16,w-6,1,q.h);pF(x+3,y+h-4,w-6,1,q.d);
 pF(x,y+h-1,w,3,'#3a2414');PX.fillStyle='rgba(20,10,30,.28)';PX.fillRect(x+2,y+h+2,w,2);}
function sofaP(x,y,w,h,c){const r=ramp(c);pF(x,y,w,h,r.o);pF(x+1,y+1,w-2,10,r.d);pF(x+1,y+1,w-2,1,r.l);pF(x+1,y+11,w-2,h-14,r.m);pF(x+1,y+11,w-2,1,r.h);for(let i=x+w/3;i<x+w-4;i+=w/3)pF(i,y+12,1,h-16,r.d);pF(x+1,y+1,8,h-4,r.l);pF(x+w-9,y+1,8,h-4,r.l);pF(x+1,y+1,8,1,r.h);pF(x+w-9,y+1,8,1,r.h);pF(x+1,y+h-3,w-2,2,r.d);dith(x+10,y+13,w-20,h-18,r.l,.12);PX.fillStyle='rgba(20,10,30,.28)';PX.fillRect(x+2,y+h,w,2);}
function shelfP(x,y,w,h){pF(x,y,w,h,'#4a2a18');pF(x+1,y+1,w-2,h-2,'#8a5a30');grain(x+1,y+1,w-2,h-2,'#8a5a30');for(let j=y+12;j<y+h-2;j+=12){pF(x+1,j,w-2,2,'#c08848');pF(x+1,j+2,w-2,1,'#4a2a18');}let k=0;for(let j=y+12;j<y+h-2;j+=12){if(k%2==0)books(x+3,j,Math.floor((w-6)/3));else{pF(x+4,j-6,6,6,'#f0f0f0');pF(x+5,j-5,4,4,'#4ad0f0');pF(x+w-12,j-8,8,8,'#c8643a');pD(x+w-9,j-10,'#48b85a');pD(x+w-8,j-11,'#48b85a');}k++;}}
function acP(x,y){pF(x,y,40,12,'#9aa4ae');pF(x+1,y+1,38,10,'#f4f6f8');pF(x+1,y+1,38,1,'#ffffff');for(let i=x+3;i<x+37;i+=2)pD(i,y+8,'#b8c0c8');pD(x+34,y+3,'#4fd060');}
function surf(x,y,c1,c2){const h=44;for(let j=0;j<h;j++){const ww=Math.round(Math.sin(Math.PI*j/h)*5)+1;pF(x-ww,y+j,ww*2,1,j%9<4?c1:c2);pD(x-ww,y+j,hx(c1,-.6));pD(x+ww-1,y+j,hx(c1,-.6));}pF(x,y+3,1,h-6,'#ffffff');}
function fanP(x,y){pF(x-1,y-20,2,20,'#9aa4ae');pF(x-5,y-1,10,2,'#6a747e');pF(x-8,y-34,16,16,'#6a747e');pF(x-7,y-33,14,14,'#e8eef4');for(let i=0;i<14;i+=3)pF(x-7+i,y-33,1,14,'#9aa4ae');pD(x,y-26,'#4a5460');}
function tableRound(x,y,r){PX.fillStyle='rgba(20,10,30,.28)';PX.beginPath();PX.ellipse(x+2,y+3,r,r*.55,0,0,7);PX.fill();PX.fillStyle='#3a2010';PX.beginPath();PX.ellipse(x,y,r+1,r*.55+1,0,0,7);PX.fill();PX.fillStyle='#8a5a30';PX.beginPath();PX.ellipse(x,y-1,r,r*.55,0,0,7);PX.fill();grain(x-r+3,y-r*.4,2*r-6,r*.7,'#8a5a30');PX.fillStyle='#b07a40';PX.fillRect(x-r+4,y-r*.5,2*r-8,1);}
function clutter(x,y,kind){if(kind=='mag'){pF(x,y,8,6,'#e8e8f0');pF(x+1,y+1,6,2,'#ff4fa0');pF(x+1,y+4,4,1,'#3a3a4a');}else if(kind=='mug'){pF(x,y,4,4,'#ffffff');pD(x+4,y+1,'#ffffff');pF(x+1,y,2,1,'#6a3a1a');}else if(kind=='phone'){pF(x,y,4,6,'#202028');pF(x+1,y+1,2,4,'#4ad0f0');}else if(kind=='shoes'){pF(x,y,5,3,'#e84a3a');pF(x+6,y+1,5,3,'#e84a3a');pD(x+1,y,'#ffffff');pD(x+7,y+1,'#ffffff');}else if(kind=='pad'){pF(x,y,10,5,'#2a2a36');pD(x+2,y+2,'#ff4f4f');pD(x+7,y+2,'#4f9fff');}else if(kind=='towel'){pF(x,y,14,8,'#3ab8a0');for(let i=0;i<14;i+=3)pF(x+i,y,1,8,'#2a8a78');}else if(kind=='flowers'){pF(x+1,y,4,6,'#bfe8ff');for(const [a,b,c] of [[0,-3,'#ff6aa0'],[3,-4,'#ffe14f'],[5,-2,'#ff6aa0']])pF(x+a,y+b,2,2,c);}}
function beanbag(x,y,c){const r=ramp(c);pF(x-9,y-8,18,12,r.o);pF(x-8,y-7,16,10,r.m);pF(x-7,y-7,10,3,r.l);pD(x-5,y-6,r.h);pF(x-8,y+1,16,2,r.d);PX.fillStyle='rgba(20,10,30,.28)';PX.fillRect(x-8,y+4,18,2);}
function guitar(x,y){pF(x-1,y-30,2,18,'#5a3a20');pF(x-2,y-33,4,4,'#3a2010');pF(x-6,y-14,12,10,'#3a2010');pF(x-5,y-13,10,8,'#e07a2a');pF(x-7,y-6,14,8,'#3a2010');pF(x-6,y-5,12,6,'#e07a2a');pF(x-2,y-10,4,4,'#3a2010');pF(x-4,y-3,8,1,'#f0b060');}
function basket(x,y){pF(x,y-10,18,11,'#7a5a30');for(let i=x+1;i<x+17;i+=2)pF(i,y-9,1,9,'#c09050');pF(x+2,y-13,6,4,'#e86aa0');pF(x+8,y-12,7,3,'#4ab8e8');}
function doorMat(x,y,w){pF(x,y,w,8,'#6a4a2a');pF(x+1,y+1,w-2,6,'#a07a4a');for(let i=x+3;i<x+w-3;i+=3)pF(i,y+2,1,4,'#7a5a34');}
function pixCanvas(W,H){const c=document.createElement('canvas');c.width=W;c.height=H;PX=c.getContext('2d');PX.imageSmoothingEnabled=false;ctx=PX;LIGHTS=[];EMIT=[];c.pixel=1;return c;}
function pixNight(c,W,H,dark){ctx=PX;finishNight(c,W,H,dark);}
// ===== PENTHOUSE =====
function bakeHomePx(night){const W=480,H=320,c=pixCanvas(W,H);_ps=4242;NIGHT=night;
 tileFloor(0,44,300,H-44,'#f4f2ee','#e0dcd6');
 wallBack(W,44,'#f0a030','#f8b848');
 // windows + curtains, wall decor
 windowP(14,4,58,36,night);curtain(10,2,40,'#f4e8d0');curtain(68,2,40,'#f4e8d0');pF(8,1,72,2,'#8a5a30');
 frame(96,8,22,16,(x,y,w,h)=>{pF(x,y,w,h,'#5ab8f0');pF(x,y+h-4,w,4,'#f0d890');pF(x+w-6,y+2,3,3,'#fff6a0');});
 acP(160,6);
 surf(252,2,'#4ab8e8','#f8d048');surf(266,0,'#f86a3a','#f8d048');
 frame(236,10,10,14,(x,y,w,h)=>{pF(x,y,w,h,'#ff7ab0');pF(x+1,y+2,w-2,2,'#fff');});
 // clock
 pF(124,10,10,10,'#3a2a20');pF(125,11,8,8,'#ffffff');pF(128,12,1,4,'#202020');pF(128,15,3,1,'#202020');
 // shelf by bed
 shelfP(116,4,32,38);
 // bed + nightstand + lamp
 rugP(30,124,70,36,'#3a7ad8','#f8d048','#f86a3a');
 bedP(40,70,48,64);
 blk3(94,86,16,8,12,'#c08848','#7a4a24');pF(98,82,8,1,'#4a2a18');lampP(102,86,'#ffd08a');clutter(95,76,'phone');
 // TV stand + TV
 blk3(140,96,90,14,18,'#7a4a2a','#4a2a18');for(let i=146;i<226;i+=22){pF(i,96,18,12,'#2a1a10');pF(i+1,97,16,10,'#3a6ad8');pF(i+1,97,16,1,'#6a9af0');pF(i+8,101,2,2,'#c8c8d0');}
 tvP(150,48,70,42);pF(176,90,18,4,'#202028');clutter(146,86,'pad');books(208,94,5);plantP(236,104,1);
 // big plant by window
 plantP(88,60,1);
 // living area: rug, low table, cushions (like reference)
 rugP(112,132,170,96,'#2a8a6a','#f8f0d0','#f8d048');
 for(const [cx,cy,cc] of [[124,140,'#f86a3a'],[262,140,'#3a7ad8'],[124,206,'#f8d048'],[262,206,'#e86aa0'],[196,214,'#4ab86a']])cushion(cx,cy,cc);
 sofaP(130,170,120,36,'#3a6ad8');cushion(140,172,'#f8d048');cushion(226,172,'#f86a3a');
 tableRound(190,154,22);clutter(180,146,'mug');clutter(194,144,'mag');clutter(204,150,'flowers');clutter(178,152,'phone');
 // fishtank + tram terminal
 blk3(10,272,44,10,10,'#3a2a20','#2a1a10');fishtankP(12,226,40,36);
 blk3(16,212,30,8,22,'#2a2e3e','#14182a');pF(20,193,22,12,'#101828');pF(21,194,20,10,'#4ff0ff');ptxt('TRAM',21,195,'#102030');
 fanP(70,240);clutter(64,280,'shoes');clutter(100,250,'towel');plantP(150,300,0);plantP(284,60,0);
 // lower living area fill
 rugP(60,236,90,56,'#c84a3a','#f8e0b0','#2a8a6a');blk3(70,258,26,14,10,'#f4f4f8','#b8bcc8');clutter(74,248,'pad');clutter(86,248,'mug');
 beanbag(120,262,'#f8b030');beanbag(160,280,'#8a5ad8');lampP(56,234,'#ffe0a0');guitar(276,250);blk3(232,276,34,14,14,'#c08848','#7a4a24');books(236,262,8);clutter(250,252,'flowers');basket(196,286);clutter(110,300,'shoes');plantP(286,300,1);
 doorMat(220,H-12,60);pF(220,H-3,60,3,'#5a3a20');
 // bathroom: blue tile + glass wall
 tileFloor(300,44,180,H-44,'#9ad8f0','#7ac0e0',12);pF(296,44,5,H-44,'#d8f4ff');pF(296,44,1,H-44,'#8ab8d0');pF(300,44,1,H-44,'#ffffff');
 for(let j=60;j<H;j+=24)pF(297,j,3,2,'#a0c8e0');
 tubP(330,90,120,66);showerP(418,176,52,74);toiletP(324,250);sinkP(318,210);pF(360,180,30,12,'#3ab8a0');for(let i=360;i<390;i+=3)pF(i,180,1,12,'#2a8a78');
 for(const [bx,by,bc] of [[372,80,'#f86a3a'],[378,79,'#4ab86a'],[384,80,'#3a7ad8']]){pF(bx,by-6,4,7,hx(bc,-.5));pF(bx+1,by-5,2,5,bc);}
 plantP(468,300,0);plantP(312,72,0);clutter(440,270,'towel');
 sideWall(W,H,44,'#d88a28');
 if(night)pixNight(c,W,H,0.3);return c;}
// ===== CLUB =====
function bakeClubPx(open){const W=480,H=352,c=pixCanvas(W,H);_ps=777;NIGHT=open;
 woodFloor(0,48,W,H-48,'#5a3a5a');
 wallBack(W,48,'#4a2a6a','#5a3480');
 for(let i=4;i<W;i+=8){const col=NEONS[(i/8|0)%6];pF(i,4,4,2,col);}
 // back bar shelves
 pF(14,6,100,38,'#2a160c');pF(15,7,98,36,'#4a2a18');for(let r2=0;r2<2;r2++){pF(15,24+r2*13,98,2,'#c08848');for(let i=18;i<110;i+=5){const bc=['#e0392b','#f0b020','#3aba6a','#4ff0ff','#c07aff','#ff7ab0'][(i+r2*3)%6];const hh=7+(i%3);pF(i,24+r2*13-hh,4,hh,hx(bc,-.6));pF(i+1,24+r2*13-hh+1,2,hh-1,bc);pD(i+1,24+r2*13-hh+2,'#ffffff');pF(i+1,24+r2*13-hh-2,2,2,hx(bc,-.4));}}
 pF(30,8,40,6,'#101018');ptxt('COCKTAILS',31,8,'#ffe14f');
 // bar counter
 blk3(10,62,108,10,16,'#e8b070','#6a3a1a');for(let i=14;i<114;i+=10)pF(i,64,1,12,'#4a2410');for(let i=18;i<112;i+=16){pF(i,86,7,3,'#ff4fd0');pF(i+1,86,5,1,'#ff9ae0');pF(i+3,89,1,5,'#8a8a9a');pF(i+1,93,5,1,'#5a5a6a');}
 for(let i=22;i<108;i+=20){pF(i,54,3,6,'#bfefff');pF(i+6,55,4,5,'#ffb040');pD(i+7,55,'#ffffff');}
 // posters, sign
 frame(124,8,22,30,(x,y,w,h)=>{pF(x,y,w,h,'#ff4fa3');pF(x,y+h-8,w,8,'#6a1aa0');ptxt('DJ',x+3,y+3,'#fff');});frame(150,12,16,22,(x,y,w,h)=>{pF(x,y,w,h,'#4fd6ff');pF(x+3,y+3,w-6,w-6,'#ffe14f');});
 frame(320,8,22,30,(x,y,w,h)=>{pF(x,y,w,h,'#ffe14f');pF(x,y+h-9,w,9,'#e04a2a');ptxt('LIVE',x+1,y+h-9,'#fff');});frame(346,12,16,22,(x,y,w,h)=>{pF(x,y,w,h,'#7affb0');pF(x+2,y+h-7,w-4,4,'#1a8a6a');});
 pF(378,8,90,30,'#140a24');pF(379,9,88,28,'#1e1030');ptxt('NEON BARN',388,17,'#ffffff','#ff4fd0');LIGHTS.push([420,22,40,'#ff4fd0']);
 // speakers
 for(const sx of [170,296]){pF(sx,40,16,34,'#0a0a10');pF(sx+1,41,14,32,'#24242e');for(const yy of [46,60]){pF(sx+3,yy,10,10,'#101016');pF(sx+5,yy+2,6,6,'#3a3a4a');pD(sx+7,yy+4,'#8a8a9a');}pF(sx+1,41,14,1,'#4a4a5a');}
 // DJ booth
 blk3(196,58,88,12,22,'#3a3a4a','#16161e');pF(197,68,86,2,'#ff4fd0');for(const tx of [214,254]){pF(tx,40,16,10,'#101016');pF(tx+2,41,12,8,'#4a4a5a');pF(tx+5,43,6,4,'#1a1a22');pD(tx+7,44,'#ff4fd0');}for(let i=232;i<250;i+=3)pF(i,41,2,6,NEONS[(i/3|0)%6]);ptxt('DJ',235,56,'#ffd1f0','#7a1a5a');
 pF(239,48,1,38,'#8a8a9a');for(let j=0;j<8;j++)for(let i=0;i<8;i++)if((i-3.5)**2+(j-3.5)**2<14)pD(236+i,86+j,((i+j)&1)?'#ffffff':'#9aa4c0');
 // dance floor
 for(let j=0;j<12;j++)for(let i=0;i<18;i++){const x=150+i*10,y=100+j*10,col=NEONS[(i*3+j*5)%6],on=((i*7+j*3)%5==0)||(open&&(i+j*2)%4==0);pF(x,y,10,10,'#0c0816');pF(x+1,y+1,8,8,on?col:hx(col,-.78));pD(x+1,y+1,hx(col,-.55));if(on){pF(x+1,y+1,8,1,hx(col,.5));pD(x+2,y+2,'#ffffff');}}
 pF(149,99,182,1,'#c0c0d0');pF(149,220,182,1,'#c0c0d0');pF(149,99,1,122,'#c0c0d0');pF(330,99,1,122,'#c0c0d0');
 // VIP
 pF(352,56,120,150,'#3a1030');for(let j=56;j<206;j+=8)for(let i=352+((j/8)&1)*8;i<472;i+=16)pF(i,j,8,8,'#4a1a40');rugP(362,108,100,64,'#8a1a4a','#ffe14f','#ff7ab0');
 sofaP(358,58,108,24,'#c03a7a');sofaP(358,176,44,22,'#c03a7a');sofaP(422,176,44,22,'#c03a7a');
 blk3(392,132,40,10,10,'#2a2a36','#101018');pF(398,120,4,8,'#ffe14f');pF(406,121,6,6,'#bfefff');pF(416,122,8,4,'#ff4fd0');
 for(let j=60;j<206;j+=12){pF(346,j,5,8,'#5a4010');pF(347,j+1,3,6,'#e0c040');}for(let j=64;j<206;j+=12)for(let k=0;k<12;k++)pD(349+Math.round(Math.sin(k/12*Math.PI)*2),j+k,'#c01a4a');
 ptxt('VIP',402,90,'#fff2a0','#7a4a10');
 // lounge tables/stools
 for(const [tx,ty] of [[40,150],[96,200],[40,250]]){tableRound(tx,ty,11);pF(tx-2,ty-6,4,5,'#ff4fd0');pD(tx-1,ty-6,'#ffffff');for(const sx of [-20,14]){blk3(tx+sx,ty-2,7,5,6,'#4ff0ff','#1a6a8a');}}
 // arcade + jukebox
 blk3(18,300,22,10,36,'#4a2a8a','#1a0a3a');pF(21,268,16,12,'#101018');pF(22,269,14,10,'#4ff0ff');pF(24,272,3,3,'#ffe14f');pF(30,274,4,2,'#ff4fd0');pF(22,284,4,3,'#ff4f4f');pF(30,284,4,3,'#4f9fff');
 blk3(124,300,22,10,30,'#c07a3a','#5a2a10');for(let k=0;k<8;k++){pF(127+k*2,276-Math.round(Math.sin(k/7*Math.PI)*6),2,2,NEONS[k%6]);}pF(127,284,16,8,'#2a1a10');for(let i=128;i<142;i+=2)pF(i,285,1,6,'#ffb040');LIGHTS.push([134,282,30,'#ffb040']);
 plantP(132,60,1);plantP(156,334,0);plantP(330,334,0);plantP(344,232,1);plantP(470,236,0);
 // office
 pF(368,248,104,96,'#2a1a10');woodFloor(372,252,100,92,'#8a5a30');pF(368,248,104,4,'#6a4a2a');pF(368,248,4,96,'#6a4a2a');
 blk3(398,274,44,12,14,'#a0683a','#5a3018');pF(410,252,18,14,'#202028');pF(411,253,16,10,'#4ff0ff');pF(414,256,8,1,'#ffffff');pF(418,266,2,8,'#202028');
 blk3(450,310,16,8,16,'#6a6a7a','#3a3a4a');pF(455,298,6,4,'#ffe14f');shelfP(442,256,26,34);plantP(382,336,0);clutter(402,264,'mug');clutter(426,264,'mag');
 for(const [tx,ty] of [[190,262],[290,262],[240,300]]){blk3(tx-6,ty,12,6,16,'#c0c0d0','#4a4a5a');pF(tx-3,ty-20,3,5,'#4ff0ff');pD(tx+1,ty-19,'#ffe14f');for(const sx of [-14,10])blk3(tx+sx,ty+4,6,4,8,'#ff4fd0','#7a1a5a');}
 for(const x of [196,284]){pF(x,318,2,22,'#e0c040');pF(x-2,316,6,3,'#ffe14f');}for(let k=0;k<86;k++)pD(197+k,322+Math.round(Math.sin(k/86*Math.PI)*4),'#c01a4a');
 doorMat(200,H-12,80);pF(200,H-3,80,3,open?'#ff4fd0':'#6a2a6a');ptxt('EXIT',228,H-12,'#fff2c0','#3a1a2a');
 sideWall(W,H,48,'#3a1a5a');
 if(open){LIGHTS.push([240,160,140,'#ff4fd0'],[60,70,60,'#ffe14f'],[410,130,70,'#b07aff'],[240,60,60,'#4ff0ff']);pixNight(c,W,H,0.18);}
 return c;}
AREAS.club.bake=bakeClubPx;AREAS.home.bake=bakeHomePx;

AREAS.home.outer='#e8902a';AREAS.club.outer='#1a1026';
AREAS.home.solids.push([70,248,26,24],[232,262,34,28]);AREAS.club.solids.push([184,246,12,20],[284,246,12,20],[234,284,12,20]);
