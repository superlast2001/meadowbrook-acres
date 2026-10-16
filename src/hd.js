// ===== HD environment art (v0.0.0.34): overrides lib primitives with smooth, gradient-lit drawing =====
const BS=2; // bake pixel density (2 canvas px per world px)
function lg(x0,y0,x1,y1,stops){const g=ctx.createLinearGradient(x0,y0,x1,y1);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g;}
function rg(x,y,r,stops){const g=ctx.createRadialGradient(x,y,0,x,y,r);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g;}
function rr(x,y,w,h,r,fill){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}}
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=v=>Math.max(0,Math.min(255,Math.round(f>0?v+(255-v)*f:v*(1+f))));return 'rgb('+m(r)+','+m(g)+','+m(b)+')';}
function text(t,x,y,c,sc=1){ctx.save();ctx.font='bold '+(6.4*sc)+'px "Trebuchet MS",Verdana,Arial,sans-serif';ctx.textBaseline='top';ctx.fillStyle=c;const w=textW(t,sc),mw=ctx.measureText(t).width;ctx.fillText(t,x+(w-mw)/2,y-0.4*sc);ctx.restore();}
function neon(t,x,y,c,glow,sc=2){ctx.save();ctx.shadowColor=glow;ctx.shadowBlur=4*sc;text(t,x,y,glow,sc);ctx.shadowBlur=1.5*sc;text(t,x,y,c,sc);ctx.restore();}
function sidewalk(x,y,w,h){ctx.fillStyle=lg(x,y,x,y+h,['#c4c8d2','#b2b6c2']);ctx.fillRect(x,y,w,h);let k=0;
 for(let j=0;j<h;j+=8)for(let i=0;i<w;i+=8){k=(i*7+j*13+x*3)%11;if(k<4){ctx.fillStyle='rgba(255,255,255,'+(0.03+k*0.015)+')';ctx.fillRect(x+i,y+j,8,8);}else if(k>8){ctx.fillStyle='rgba(0,0,0,0.035)';ctx.fillRect(x+i,y+j,8,8);}}
 ctx.fillStyle='rgba(70,74,90,.22)';for(let j=0;j<h;j+=8)ctx.fillRect(x,y+j,w,0.5);for(let i=0;i<w;i+=8)ctx.fillRect(x+i,y,0.5,h);
 ctx.fillStyle='rgba(255,255,255,.18)';for(let j=0.5;j<h;j+=8)ctx.fillRect(x,y+j,w,0.5);}
function tiles(x,y,w,h,a,b){ctx.fillStyle=a;ctx.fillRect(x,y,w,h);for(let j=0;j<h;j+=8)for(let i=0;i<w;i+=8){ctx.fillStyle=((i+j)/8)%2?a:b;ctx.fillRect(x+i,y+j,Math.min(8,w-i),Math.min(8,h-j));}
 ctx.fillStyle=lg(x,y,x+w,y+h,['rgba(255,255,255,.18)','rgba(255,255,255,0)','rgba(0,0,0,.08)']);ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(0,0,0,.12)';for(let j=0;j<h;j+=8)ctx.fillRect(x,y+j,w,0.5);for(let i=0;i<w;i+=8)ctx.fillRect(x+i,y,0.5,h);}
function carpet(x,y,w,h,a,b){ctx.fillStyle=a;ctx.fillRect(x,y,w,h);ctx.fillStyle=b;for(let j=0;j<h;j+=6)for(let i=(j/6%2)*3;i<w;i+=6){ctx.beginPath();ctx.arc(x+i+1.5,y+j+1.5,0.9,0,7);ctx.fill();}
 ctx.fillStyle=lg(x,y,x,y+h,['rgba(255,255,255,.05)','rgba(0,0,0,.15)']);ctx.fillRect(x,y,w,h);}
function wood(x,y,w,h,a='#9a6a3e',b='#86592f',l='#6e4524'){for(let j=0;j<h;j+=4){ctx.fillStyle=lg(x,y+j,x+w,y+j,[j/4%2?a:b,shade(j/4%2?a:b,-.08),j/4%2?a:b]);ctx.fillRect(x,y+j,w,4);ctx.fillStyle=l;ctx.fillRect(x,y+j+3.5,w,0.5);for(let i=(j*7)%22;i<w;i+=22)ctx.fillRect(x+i,y+j,0.5,3.5);}}
function danceTiles(x,y,w,h,seed=1){const C=['#ff4fa3','#4fd6ff','#ffe14f','#9b5cff','#4fff8a','#ff7a3d'];ctx.fillStyle='#0c0816';ctx.fillRect(x,y,w,h);
 for(let j=0;j<h;j+=10)for(let i=0;i<w;i+=10){const k=(i*7+j*13+seed*5)%C.length,lit=((i+j)/10+seed)%3==0;const tx=x+i+0.6,ty=y+j+0.6;
  if(lit){ctx.save();ctx.shadowColor=C[k];ctx.shadowBlur=6;rr(tx,ty,8.8,8.8,1.4,rg(tx+4.4,ty+4.4,7,['#ffffff',C[k],shade(C[k],-.35)]));ctx.restore();}
  else rr(tx,ty,8.8,8.8,1.4,lg(tx,ty,tx+8,ty+8,['#3a2c5c','#211936']));ctx.fillStyle='rgba(255,255,255,'+(lit?.45:.08)+')';ctx.fillRect(tx+1,ty+0.8,6.5,0.7);}
 ctx.fillStyle=lg(x,y,x+w,y+h,['rgba(255,255,255,.07)','rgba(255,255,255,0)','rgba(255,255,255,.05)']);ctx.fillRect(x,y,w,h);}
function plant(x,y){shadow(x,y,5);ctx.fillStyle=lg(x-4,y-6,x+4,y,['#c27a46','#7a4424']);ctx.beginPath();ctx.moveTo(x-4,y-6);ctx.lineTo(x+4,y-6);ctx.lineTo(x+3,y);ctx.lineTo(x-3,y);ctx.fill();ctx.fillStyle='#d8925a';ctx.fillRect(x-4.5,y-6.5,9,1.2);
 for(const [dx,dy,r,c] of [[-3,-11,3.6,'#2f7a34'],[3,-12,3.4,'#2f7a34'],[0,-15,3.8,'#3e9a40'],[-1,-10,3,'#4fb04a'],[2,-16,2.2,'#7ad66e']]){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x+dx,y+dy,r,r*0.8,0,0,7);ctx.fill();}}
function speaker(x,y,h=26){shadow(x+7,y+h,8);rr(x,y,14,h,2,lg(x,y,x+14,y,['#2c2c38','#14141c','#22222c']));ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=.5;rr(x+.5,y+.5,13,h-1,2);ctx.stroke();
 for(let j=0;j+11<=h-2;j+=12){const cx=x+7,cy=y+7+j;ctx.fillStyle=rg(cx-1,cy-1,5.5,['#6a6a7e','#26262e','#0a0a0e']);ctx.beginPath();ctx.arc(cx,cy,5,0,7);ctx.fill();ctx.fillStyle=rg(cx-.5,cy-.5,2,['#b0b0c4','#40404c']);ctx.beginPath();ctx.arc(cx,cy,1.8,0,7);ctx.fill();}}
function sofa(x,y,w,c='#7a2d5a',d='#5a1f42',l='#9c3f74'){shadow(x+w/2,y+15,w/2);rr(x,y,w,14,3,lg(x,y,x,y+14,[l,c,d]));rr(x+3,y+6,w-6,6,2,lg(x,y+6,x,y+12,[shade(l,.15),c]));
 rr(x-1,y+4,5,10,2,lg(x,y,x+5,y,[l,d]));rr(x+w-4,y+4,5,10,2,lg(x+w-4,y,x+w+1,y,[c,d]));ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x+4,y+1.2,w-8,0.8);}
function stool(x,y){shadow(x,y,3);ctx.fillStyle=lg(x,y-5,x+1,y,['#e0e4ec','#7a7e8a']);ctx.fillRect(x-.6,y-5,1.2,5);ctx.fillStyle='#8a8e9a';ctx.beginPath();ctx.ellipse(x,y-.5,2.6,.9,0,0,7);ctx.fill();
 ctx.fillStyle=rg(x-1,y-7.5,4,['#ff7a6a','#c0392b','#7a1e14']);ctx.beginPath();ctx.ellipse(x,y-6.5,3.8,1.9,0,0,7);ctx.fill();}
function discoBall(x,y){ctx.fillStyle='#999';ctx.fillRect(x,y-14,.6,9);ctx.fillStyle=rg(x-2,y-2,6,['#ffffff','#c8d0e0','#5a6278']);ctx.beginPath();ctx.arc(x+.3,y,5,0,7);ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.7)';for(let i=-4;i<=4;i+=1.6)for(let j=-4;j<=4;j+=1.6)if(i*i+j*j<18&&((i+j)*10|0)%3==0)ctx.fillRect(x+i,y+j,1,1);}
function pool(x,y,w,h){rr(x-2.5,y-2.5,w+5,h+5,4,'#eef2f6');ctx.strokeStyle='#c8d0d8';ctx.lineWidth=.6;ctx.stroke();rr(x,y,w,h,3,lg(x,y,x,y+h,['#7ae8f8','#2ab8d8','#1a8ab8']));
 ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=.6;for(let j=3;j<h;j+=5){ctx.beginPath();for(let i=2;i<w-2;i+=1)ctx.lineTo(x+i,y+j+Math.sin((i+j*3)/3)*0.7);ctx.stroke();}}
function palm(x,y){shadow(x,y,7);ctx.strokeStyle='#7a5a32';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+3,y-7,x,y-14);ctx.stroke();ctx.strokeStyle='#a07a48';ctx.lineWidth=.6;for(let i=1;i<14;i+=2){ctx.beginPath();ctx.moveTo(x-1,y-i);ctx.lineTo(x+1.5,y-i);ctx.stroke();}
 for(const a of [-2.8,-2.1,-1.4,-0.7,0,0.6]){ctx.save();ctx.translate(x,y-14);ctx.rotate(a);ctx.fillStyle=lg(0,0,11,0,['#2f8a4a','#4ab060','#2a6a3a']);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(6,-3.5,11,1.5);ctx.quadraticCurveTo(6,0.5,0,1);ctx.fill();ctx.restore();}}
function bigTree(x,y){shadow(x,y+1,12);rr(x-7,y-7,14,7,1.5,lg(x,y-7,x,y,['#9aa0ac','#5a5e6a']));ctx.fillStyle='#3a2a1a';ctx.fillRect(x-6,y-7,12,1.5);
 ctx.fillStyle=lg(x-1.5,0,x+1.5,0,['#5a3a1c','#8a5a30','#5a3a1c']);ctx.fillRect(x-1.5,y-17,3,11);
 for(const [dx,dy,r,c] of [[0,-24,12.5,'#1f4a24'],[-5,-23,8,'#2a5e2e'],[5,-22,8,'#275a2c'],[-2,-28,8,'#34793a'],[4,-29,6,'#3e8a40'],[-5,-30,4.5,'#56a84e'],[2,-33,3.5,'#6ac05a']]){ctx.fillStyle=rg(x+dx-r*.3,y+dy-r*.3,r*1.2,[shade(c,.12),c,shade(c,-.25)]);ctx.beginPath();ctx.arc(x+dx,y+dy,r,0,7);ctx.fill();}}
function bigLamp(x,y){shadow(x,y,4);ctx.fillStyle=lg(x-1,0,x+2,0,['#5a5a68','#2a2a34']);ctx.fillRect(x-.5,y-44,2.2,44);rr(x-2,y-2,5.5,2.5,1,'#3a3a44');
 rr(x-7,y-47,15,4,2,lg(0,y-47,0,y-43,['#5a5a68','#24242c']));ctx.fillStyle=rg(x+.5,y-42.5,7,['#ffffff','#fff2c0','rgba(255,240,190,0)']);ctx.fillRect(x-7,y-49,15,14);if(NIGHT)LIGHTS.push([x+1,y-20,42,'#ffe9a0'],[x+1,y-4,24,'#ffe9a0']);EMIT.push(['L',x,y]);}
function bigBench(x,y){shadow(x+15,y+3,15);rr(x,y-15,30,3,1,lg(0,y-15,0,y-12,['#c08050','#7a4a24']));rr(x,y-11.5,30,3,1,lg(0,y-11,0,y-8,['#b07444','#6a3a1c']));ctx.fillStyle='#2a2a30';ctx.fillRect(x+3,y-12,1.2,8);ctx.fillRect(x+25.8,y-12,1.2,8);for(let k=0;k<2;k++)rr(x,y-6+k*3.2,30,2.6,1,lg(0,y-6+k*3,0,y-3+k*3,['#c08050','#7a4a24']));ctx.fillStyle='#2a2a30';ctx.fillRect(x+2,y,1.5,5);ctx.fillRect(x+26.5,y,1.5,5);}
function bigVend(x,y,c){shadow(x+8,y,10);rr(x,y-40,17,40,2,lg(x,0,x+17,0,['#3a3e52','#1e2230']));rr(x+2,y-38,13,22,1,lg(0,y-38,0,y-16,[shade(c,.4),c,shade(c,-.3)]));
 for(let j=0;j<5;j++)for(let i=0;i<3;i++)rr(x+3.4+i*3.8,y-36.5+j*4,2.4,3,.6,['#ff6a6a','#ffe14f','#7affb0','#4ff0ff'][(i+j)%4]);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x+2,y-38,13,1);
 rr(x+3,y-10,10,4,1,'#0a0a10');E(x+11.5,y-17,1.5,1.5,'#7affb0');LIGHTS.push([x+8,y-18,20,c]);}
function busStop(x,y){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x,y-1,24,2);rr(x,y-15,24,2.5,1,'#4a5068');ctx.fillStyle='#4a5068';ctx.fillRect(x,y-13,1,13);ctx.fillRect(x+23,y-13,1,13);
 ctx.fillStyle='rgba(170,230,255,.35)';ctx.fillRect(x+1,y-12.5,22,10);rr(x+2,y-12,7,9,1,'#4ff0ff');ctx.fillStyle='#0a3040';ctx.font='bold 6px Verdana';ctx.textBaseline='top';ctx.fillText('T',x+3.6,y-10.5);rr(x+10,y-4,12,1.8,.8,'#a06a3a');}
function planter(x,y){rr(x-4.5,y-3.5,9,3.5,1,lg(0,y-3,0,y,['#9aa0ac','#5a5e6a']));for(const [dx,dy,r,c] of [[0,-8,5,'#24582a'],[-1.5,-9,3.5,'#3a8a3c'],[1,-10.5,2,'#62b85a']]){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x+dx,y+dy,r,0,7);ctx.fill();}}
// buildings: gradient facades, framed glass windows with reflections, scalloped awnings, vector neon signs
function bigB(x,base,w,fh,o={}){const rd=o.rd||24,y=base-fh-rd,face=o.face||pick(FACES);shadow(x+w/2,base+2,w/2+2);
 ctx.fillStyle=lg(x,y+rd,x,base,[shade(face,.12),face,shade(face,-.3)]);ctx.fillRect(x,y+rd,w,fh);
 ctx.fillStyle=lg(x,0,x+w,0,['rgba(255,255,255,.14)','rgba(0,0,0,0)','rgba(0,0,0,.28)']);ctx.fillRect(x,y+rd,w,fh);
 const roof=o.roof||pick(['#5a6070','#4a4e5a','#5a5068','#606878']);ctx.fillStyle=lg(x,y,x,y+rd,[shade(roof,.2),roof,shade(roof,-.2)]);ctx.fillRect(x,y,w,rd);
 ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x,y,w,1);ctx.fillStyle=lg(0,y+rd-4,0,y+rd,['rgba(0,0,0,0)','rgba(0,0,0,.45)']);ctx.fillRect(x,y+rd-4,w,4);ctx.fillStyle=shade(face,.25);ctx.fillRect(x,y+rd,w,1.2);
 for(let i=x+6;i+14<x+w;i+=26){shadow(i+7,y+15,8);rr(i,y+4,14,10,1.5,lg(i,0,i+14,0,['#dfe3ea','#a8acb6']));ctx.fillStyle='#5a5e6a';ctx.beginPath();ctx.arc(i+7,y+9,3.4,0,7);ctx.fill();ctx.strokeStyle='#8a8e9a';ctx.lineWidth=.4;for(let a=0;a<6;a++){ctx.beginPath();ctx.moveTo(i+7,y+9);ctx.lineTo(i+7+Math.cos(a)*3.2,y+9+Math.sin(a)*3.2);ctx.stroke();}}
 if(rnd()<.5){ctx.fillStyle='#8a8a94';ctx.fillRect(x+w-20,y-14,1.2,18);E(x+w-20.5,y-16,2,2,'#ff4040');}
 const shopH=o.noshop?0:56,win=pick(['#ffe7a0','#bff4ff','#ffb0f0','#d0ffd8']);
 for(let fy=y+rd+8;fy+16<base-shopH-4;fy+=24){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(x+2,fy+18,w-4,1.5);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(x+2,fy+19.5,w-4,.6);
  for(let i=x+8;i+10<=x+w-8;i+=16){rr(i-1.2,fy-1.2,12.4,16.4,1,'#20242e');const lit=rnd()<.55;
   if(lit&&NIGHT){ctx.fillStyle=lg(i,fy,i,fy+14,[shade(win,.3),win,shade(win,-.25)]);ctx.fillRect(i,fy,10,14);EMIT.push(['W',i,fy,win]);}
   else{ctx.fillStyle=lg(i,fy,i+10,fy+14,NIGHT?['#2a3048','#141828']:['#bfe2f6','#6a92b4','#4a6a8c']);ctx.fillRect(i,fy,10,14);ctx.fillStyle='rgba(255,255,255,'+(NIGHT?.08:.45)+')';ctx.beginPath();ctx.moveTo(i+1,fy+13);ctx.lineTo(i+6,fy);ctx.lineTo(i+8.5,fy);ctx.lineTo(i+3.5,fy+13);ctx.fill();}
   ctx.fillStyle='#20242e';ctx.fillRect(i,fy+6.6,10,.8);ctx.fillRect(i+4.6,fy,.8,14);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(i-1.2,fy+15.2,12.4,.6);}
  if(rnd()<.25){const ax=x+w-22;shadow(ax+6,fy+14,6);rr(ax,fy+4,12,9,1,lg(ax,0,ax+12,0,['#c8ccd4','#8a8e98']));ctx.fillStyle='#5a5e68';for(let k=0;k<4;k++)ctx.fillRect(ax+2,fy+6+k*1.8,8,.8);}}
 if(o.holo){const c=pick(NEONS),hy=y+rd+14;rr(x+10,hy,w-20,40,2,'#0a1220');ctx.save();ctx.globalAlpha=.9;rr(x+12,hy+2,w-24,36,1.5,lg(x,hy,x+w,hy+40,[shade(c,.4),c,shade(c,-.4)]));ctx.restore();ctx.fillStyle='rgba(255,255,255,.18)';for(let j=hy+3;j<hy+38;j+=2)ctx.fillRect(x+12,j,w-24,.5);
  ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='bold 9px "Trebuchet MS",Verdana';ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillText(pick(['NEON','LIVE','2077','SALE','SKY','VIBE']),x+w/2,hy+20);ctx.textAlign='left';EMIT.push(['H',x+12,hy+2,w-24,36,c]);LIGHTS.push([x+w/2,hy+20,w*0.6,c]);}
 if(shopH){const nc=o.neon||pick(NEONS);ctx.fillStyle=lg(0,base-shopH,0,base,['#2c2c38','#18181f']);ctx.fillRect(x+2,base-shopH,w-4,shopH);
  ctx.fillStyle=lg(0,base-44,0,base-4,NIGHT?['#fff0c8','#ffd28a']:['#cdeaf6','#8ab8d0']);ctx.fillRect(x+6,base-44,w-12,40);if(NIGHT)EMIT.push(['S',x+6,base-44,w-12,40]);for(let i=x+10;i<x+w-10;i+=7){ctx.fillStyle=['#e05050','#f0c040','#60c060','#4ff0ff','#ff6ad0'][(i/7|0)%5];rr(i,base-14,4,6,1);ctx.fill();}ctx.fillStyle='rgba(60,40,30,.6)';ctx.fillRect(x+6,base-8,w-12,1.2);
  ctx.fillStyle='rgba(255,255,255,.35)';for(let i=x+10;i<x+w-12;i+=20){ctx.beginPath();ctx.moveTo(i,base-5);ctx.lineTo(i+12,base-43);ctx.lineTo(i+15,base-43);ctx.lineTo(i+3,base-5);ctx.fill();}
  ctx.fillStyle='#1a1a22';for(let i=x+6;i<x+w-6;i+=20)ctx.fillRect(i,base-44,1.4,40);rr(x+w/2-9,base-48,18,48,1,'#101016');ctx.fillStyle=lg(0,base-45,0,base,['#ffe8b8','#c89050']);ctx.fillRect(x+w/2-7,base-45,14,45);ctx.fillStyle='#101016';ctx.fillRect(x+w/2-.4,base-45,.8,45);rr(x+w/2-3,base-24,1.2,5,.5,'#e0c060');rr(x+w/2+1.8,base-24,1.2,5,.5,'#e0c060');
  // scalloped awning
  for(let i=x;i<x+w;i+=8){ctx.fillStyle=lg(0,base-shopH,0,base-shopH+8,[shade(nc,.25),nc,shade(nc,-.25)]);ctx.fillRect(i,base-shopH,4,7);ctx.fillStyle=lg(0,base-shopH,0,base-shopH+8,['#ffffff','#e2e2e8']);ctx.fillRect(i+4,base-shopH,4,7);}
  for(let i=x;i<x+w;i+=4){ctx.fillStyle=(i-x)%8<4?shade(nc,-.15):'#d8d8e0';ctx.beginPath();ctx.arc(i+2,base-shopH+7,2,0,Math.PI);ctx.fill();}ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(x,base-shopH+9,w,2);
  if(o.sign){const tw=textW(o.sign,2);rr(x+w/2-tw/2-5,base-shopH-17,tw+10,15,2,lg(0,base-shopH-17,0,base-shopH-2,['#24242e','#0c0c12']));EMIT.push(['T2',o.sign,x+w/2-tw/2,base-shopH-12,nc]);neon(o.sign,x+w/2-tw/2,base-shopH-12,shade(nc,.5),nc,2);LIGHTS.push([x+w/2,base-shopH-9,30,nc]);}
  LIGHTS.push([x+w/2,base-10,w*0.55,nc]);}
 if(o.vneon){const sx=x+w-8,hh=Math.min(70,fh-60);rr(sx-1,y+rd+9,8,hh+2,2,'#14141c');ctx.save();ctx.shadowColor=o.vneon;ctx.shadowBlur=5;rr(sx+1,y+rd+11,4,hh-2,2,o.vneon);ctx.restore();EMIT.push(['V',sx+1,y+rd+11,4,hh-2,o.vneon]);LIGHTS.push([sx+3,y+rd+40,26,o.vneon]);}}
// night re-draw of emissive bits after the dark overlay
function drawEmit(e){const k=e[0];if(k=='T2'){neon(e[1],e[2],e[3],shade(e[4],.5),e[4],2);}else if(k=='T')text(e[1],e[2],e[3],e[4]);else if(k=='N4')neon(e[1],e[2],e[3],'#ffd1f0','#ff4fa3',4);
 else if(k=='W'){ctx.fillStyle=lg(e[1],e[2],e[1],e[2]+14,[shade(e[3],.3),e[3],shade(e[3],-.25)]);ctx.fillRect(e[1],e[2],10,14);ctx.fillStyle='rgba(20,20,30,.55)';ctx.fillRect(e[1],e[2]+6.6,10,.8);ctx.fillRect(e[1]+4.6,e[2],.8,14);}
 else if(k=='S'){ctx.fillStyle=lg(0,e[2],0,e[2]+e[4],['#fff0c8','#ffcf80']);ctx.fillRect(e[1],e[2],e[3],e[4]);}
 else if(k=='H'||k=='V'){ctx.save();ctx.shadowColor=e[5];ctx.shadowBlur=6;rr(e[1],e[2],e[3],e[4],2,e[5]);ctx.restore();if(k=='H'){ctx.fillStyle='rgba(255,255,255,.2)';for(let j=e[2]+1;j<e[2]+e[4];j+=2)ctx.fillRect(e[1],j,e[3],.5);}}
 else if(k=='L'){ctx.fillStyle=rg(e[1]+.5,e[2]-42.5,6,['#ffffff','#fff2c0','rgba(255,240,190,0)']);ctx.fillRect(e[1]-6,e[2]-48,13,12);}
 else if(k=='HOLO'){ctx.save();ctx.globalAlpha=.7;ctx.fillStyle=rg(e[1],e[2],20,['#ffffff','#bff4ff','rgba(80,220,255,0)']);ctx.beginPath();ctx.arc(e[1],e[2],20,0,7);ctx.fill();ctx.restore();}
 else if(k=='B'){ctx.save();ctx.shadowColor=e[3];ctx.shadowBlur=4;ctx.fillStyle=e[3];ctx.beginPath();ctx.arc(e[1],e[2],1.9,0,7);ctx.fill();ctx.restore();}
 else if(k=='RR'){ctx.save();ctx.strokeStyle=e[5];ctx.lineWidth=1;ctx.shadowColor=e[5];ctx.shadowBlur=6;rr(e[1],e[2],e[3],e[4],3);ctx.stroke();ctx.restore();}
 else if(k=='RR2'){ctx.save();ctx.shadowColor=e[5];ctx.shadowBlur=4;rr(e[1],e[2],e[3],e[4],1,e[5]);ctx.restore();}
 else if(k=='D'){ctx.fillStyle=lg(0,e[2],0,e[2]+e[4],['#ffb0e8','#ff4fd0','#b02a9a']);ctx.fillRect(e[1],e[2],e[3],e[4]);ctx.fillStyle='rgba(255,255,255,.25)';for(const dx of [e[1]+5,e[1]+e[3]/2+5]){ctx.beginPath();ctx.moveTo(dx,e[2]+e[4]-2);ctx.lineTo(dx+12,e[2]+2);ctx.lineTo(dx+18,e[2]+2);ctx.lineTo(dx+6,e[2]+e[4]-2);ctx.fill();}ctx.fillStyle='#120a18';ctx.fillRect(e[1]+e[3]/2-1.5,e[2],3,e[4]);}
 else if(typeof k=='number'){ctx.save();ctx.shadowColor=e[4];ctx.shadowBlur=3;R(...e);ctx.restore();}}
// subtle grain + vignette for depth
function finishGrain(w,h,a){sd=99;for(let i=0;i<w*h/60;i++){ctx.fillStyle=rnd()<.5?'rgba(255,255,255,'+a+')':'rgba(0,0,0,'+a+')';ctx.fillRect(rnd()*w,rnd()*h,.5,.5);}}
