const PW=1280,PH=960;
function bakePlaza(night){const c=bakeCanvas(PW,PH);NIGHT=night;sd=777;
  sidewalk(0,0,PW,PH);
  // north road
  R(0,0,PW,30,'#353844');for(let i=0;i<PW;i+=24)R(i,14,12,2,'#d8dce4');
  // north building row base 300
  let x=0;const SIG=['NOODLE','ARCADE','BOBA','SUSHI','HOTEL','GEAR','TATTOO','KARAOKE'];let k=0;
  while(x<440){const w=Math.min(ri(72,120),440-x);bigB(x,300,w,ri(170,240),{sign:SIG[k++%8],vneon:rnd()<.5?pick(NEONS):null,holo:rnd()<.3});x+=w;}
  x=840;while(x<PW){const w=Math.min(ri(72,120),PW-x);bigB(x,300,w,ri(170,240),{sign:SIG[k++%8],vneon:rnd()<.5?pick(NEONS):null,holo:rnd()<.3});x+=w;}
  // ==== NEON BARN club 440-840, roof 52-80, facade 80-300
  const cx=440,cw=400;
  ctx.fillStyle=lg(0,52,0,80,['#5a4280','#3a2a5a','#241838']);ctx.fillRect(cx,52,cw,28);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(cx,52,cw,1);
  for(let i=cx+20;i<cx+cw-30;i+=60){shadow(i+10,73,11);rr(i,58,20,14,2,lg(i,0,i+20,0,['#e0e4ea','#9a9ea8']));ctx.fillStyle='#5a5e6a';ctx.beginPath();ctx.arc(i+10,65,4.5,0,7);ctx.fill();}
  ctx.fillStyle=lg(0,80,0,300,['#3a2858','#24183a','#160e24']);ctx.fillRect(cx,80,cw,220);
  for(let i=cx;i<cx+cw;i+=16){ctx.fillStyle=lg(i,0,i+16,0,['rgba(255,255,255,.07)','rgba(255,255,255,0)','rgba(0,0,0,.22)']);ctx.fillRect(i,80,16,220);}
  ctx.fillStyle=lg(cx,0,cx+cw,0,['rgba(255,255,255,.12)','rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,.3)']);ctx.fillRect(cx,80,cw,220);
  for(let i=cx+8;i<cx+cw-8;i+=10){ctx.save();ctx.shadowColor=NEONS[(i/10|0)%6];ctx.shadowBlur=4;ctx.fillStyle=NEONS[(i/10|0)%6];ctx.beginPath();ctx.arc(i+2.5,85.5,1.8,0,7);ctx.fill();ctx.restore();EMIT.push(['B',i+2.5,85.5,NEONS[(i/10|0)%6]]);}
  rr(cx+40,98,cw-80,56,4,lg(0,98,0,154,['#1a1024','#08040c']));ctx.strokeStyle='#ff4fa3';ctx.lineWidth=1;ctx.save();ctx.shadowColor='#ff4fa3';ctx.shadowBlur=6;rr(cx+42,100,cw-84,52,3);ctx.stroke();ctx.restore();
  neon('NEON BARN',cx+cw/2-textW('NEON BARN',4)/2,110,'#ffd1f0','#ff4fa3',4);EMIT.push(['N4','NEON BARN',cx+cw/2-textW('NEON BARN',4)/2,110]);EMIT.push(['RR',cx+42,100,cw-84,52,'#ff4fa3']);LIGHTS.push([cx+cw/2,126,190,'#ff4fa3']);
  for(const sx of [cx+16,cx+cw-24]){rr(sx-1,95,10,192,4,'#0e0a16');ctx.save();ctx.shadowColor='#4ff0ff';ctx.shadowBlur=8;rr(sx+1.5,97,5,188,2.5,lg(sx,0,sx+8,0,['#bff8ff','#4ff0ff','#1ab0c8']));ctx.restore();EMIT.push(['V',sx+1.5,97,5,188,'#4ff0ff']);LIGHTS.push([sx+4,190,40,'#4ff0ff']);}
  for(let i=cx+44;i<cx+cw-50;i+=32){const c2=(i/32|0)%2?'#ff4fd0':'#b07aff';rr(i,165,22,42,3,'#0c0812');ctx.save();ctx.shadowColor=c2;ctx.shadowBlur=6;rr(i+2,167,18,38,2,lg(0,167,0,205,[shade(c2,.45),c2,shade(c2,-.35)]));ctx.restore();ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.moveTo(i+3,204);ctx.lineTo(i+12,168);ctx.lineTo(i+16,168);ctx.lineTo(i+7,204);ctx.fill();EMIT.push(['V',i+2,167,18,38,c2]);}
  // entrance: glass double doors with warm interior glow
  rr(cx+152,238,96,62,3,'#0c0812');rr(cx+162,241,76,9,1.5,'#2a1a38');neon('ENTER',cx+200-textW('ENTER',1)/2,242,'#fff2c0','#ffb040',1);EMIT.push(['T','ENTER',cx+200-textW('ENTER',1)/2,242,'#fff2c0']);ctx.fillStyle=lg(0,252,0,300,['#ff9ae0','#ff4fd0','#a02a8a']);ctx.fillRect(cx+164,252,72,48);EMIT.push(['D',cx+164,252,72,48]);
  ctx.fillStyle='rgba(255,255,255,.28)';for(const dx of [cx+169,cx+205]){ctx.beginPath();ctx.moveTo(dx,298);ctx.lineTo(dx+12,254);ctx.lineTo(dx+18,254);ctx.lineTo(dx+6,298);ctx.fill();}
  ctx.fillStyle='#120a18';ctx.fillRect(cx+198.5,252,3,48);rr(cx+193,270,3,10,1.2,'#e0c060');rr(cx+204,270,3,10,1.2,'#e0c060');
  // canopy marquee
  shadow(cx+200,240,60);rr(cx+138,220,124,15,4,lg(0,202,0,220,['#ff6a5a','#c0392b','#7a1e14']));for(let i=cx+140;i<cx+260;i+=8){ctx.fillStyle='#a02a20';ctx.beginPath();ctx.arc(i+4,235,4,0,Math.PI);ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(cx+142,221.5,116,1);for(let i=cx+146;i<cx+258;i+=12){ctx.fillStyle=rg(i,227,3,['#ffffff','#fff2b0','rgba(255,220,120,0)']);ctx.beginPath();ctx.arc(i,227,3,0,7);ctx.fill();EMIT.push(['B',i,227,'#fff2b0']);}
  for(const px of [cx+144,cx+253]){ctx.fillStyle=lg(px,0,px+3,0,['#d8d8e0','#6a6a74']);ctx.fillRect(px,233,3,67);}LIGHTS.push([cx+200,262,70,'#ff4fd0']);
  for(const [sx] of [[cx+30],[cx+cw-30]]){rr(sx-6,40,12,12,2,lg(0,40,0,52,['#5a5a64','#24242a']));ctx.fillStyle=rg(sx,44,4,['#fff','#cfe','rgba(200,255,255,0)']);ctx.beginPath();ctx.arc(sx,44,3.5,0,7);ctx.fill();}
  // red carpet + rope line
  ctx.fillStyle=lg(0,300,0,360,['#a02030','#7a1424']);ctx.fillRect(cx+170,300,60,60);ctx.fillStyle='#e0b040';ctx.fillRect(cx+171,300,1.5,60);ctx.fillRect(cx+227.5,300,1.5,60);ctx.fillStyle='rgba(0,0,0,.08)';for(let j=300;j<360;j+=3)ctx.fillRect(cx+172,j,56,.6);
  for(let i=0;i<6;i++){const px=cx+250+i*24;shadow(px+1.5,342,4);ctx.fillStyle=lg(px,0,px+3,0,['#ffe68a','#b08a20']);ctx.fillRect(px,322,3,20);ctx.fillStyle=rg(px+1,320,3,['#fff4b0','#d0a020']);ctx.beginPath();ctx.arc(px+1.5,320.5,2.6,0,7);ctx.fill();rr(px-2,341,7,2,1,'#8a6a10');}
  for(let i=0;i<5;i++){const px=cx+252+i*24;ctx.strokeStyle='#a01e2a';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(px,325);ctx.quadraticCurveTo(px+11,334,px+22,325);ctx.stroke();ctx.strokeStyle='rgba(255,140,150,.5)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(px,324.5);ctx.quadraticCurveTo(px+11,333,px+22,324.5);ctx.stroke();}
  // ==== plaza
  const X0=160,Y0=360,X1=1120,Y1=760;ctx.fillStyle=lg(0,Y0,0,Y1,night?['#1e1a38','#141026']:['#a8aec4','#8a90a8']);ctx.fillRect(X0,Y0,X1-X0,Y1-Y0);for(let j=Y0;j<Y1;j+=16)for(let i=X0;i<X1;i+=16){const k=((i*7+j*3)/16)%5;ctx.fillStyle=k<1?'rgba(255,255,255,.06)':k>3.5?'rgba(0,0,0,.06)':'rgba(0,0,0,0)';ctx.fillRect(i,j,16,16);ctx.fillStyle=night?'rgba(255,79,208,.35)':'rgba(255,255,255,.35)';ctx.fillRect(i,j,16,.6);ctx.fillStyle=night?'rgba(79,240,255,.3)':'rgba(60,64,90,.25)';ctx.fillRect(i,j,.6,16);if(((i+j)/16)%7==0)rr(i+2,j+2,12,12,2,night?'rgba(176,122,255,.25)':'rgba(255,255,255,.18)');}
  for(const [yy,c2] of [[Y0,'#ff4fd0'],[Y1-2,'#4ff0ff']]){ctx.save();ctx.shadowColor=c2;ctx.shadowBlur=4;rr(X0,yy,X1-X0,2,1,c2);ctx.restore();EMIT.push(['RR2',X0,yy,X1-X0,2,c2]);}
  // fountain
  shadow(640,566,94);ctx.fillStyle=lg(0,516,0,604,['#9aa0b0','#5a6070','#3a404e']);ctx.beginPath();ctx.ellipse(640,560,90,44,0,0,7);ctx.fill();ctx.fillStyle=rg(620,548,90,[night?'#2a6aa8':'#5ac8f0','#1a5a9a','#0e2a50']);ctx.beginPath();ctx.ellipse(640,560,80,38,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=.8;for(let r2=20;r2<78;r2+=14){ctx.beginPath();ctx.ellipse(640,562,r2,r2*.47,0,0,7);ctx.stroke();}
  for(let i=0;i<40;i++)E(560+((i*37)%160),532+((i*23)%56),4,1,'#6ab0e8');ctx.fillStyle=lg(632,0,648,0,['#b0b6c4','#5a6070']);rr(632,500,16,60,3);ctx.fill();
  ctx.save();ctx.globalAlpha=.55;ctx.fillStyle='#4ff0ff';ctx.beginPath();ctx.moveTo(624,500);ctx.lineTo(656,500);ctx.lineTo(676,420);ctx.lineTo(604,420);ctx.fill();ctx.restore();EMIT.push(['HOLO',640,460]);LIGHTS.push([640,520,110,'#4ff0ff']);
  // stage
  shadow(285,482,90);rr(200,420,170,60,3,lg(0,420,0,480,['#4a4e62','#2a2e3e','#1a1c28']));ctx.save();ctx.shadowColor='#ff4fd0';ctx.shadowBlur=5;rr(200,420,170,3,1.5,'#ff4fd0');ctx.restore();EMIT.push(['RR2',200,420,170,3,'#ff4fd0']);for(const px of [208,358]){ctx.fillStyle=lg(px,0,px+4,0,['#8a8a96','#3a3a44']);ctx.fillRect(px,370,4,50);}rr(206,366,158,8,2,lg(0,366,0,374,['#5a5e70','#2a2e3e']));for(let i=216;i<360;i+=24)E(i,374,6,4,NEONS[(i/24|0)%6]);speaker(214,394,26);speaker(342,394,26);LIGHTS.push([285,440,90,'#ff4fd0']);
  // billboard pillars, benches, trees, vending, kiosks
  for(const [bx,by,c] of [[900,420,'#b07aff'],[180,640,'#ffe14f']]){shadow(bx+40,by+86,14);ctx.fillStyle=lg(bx+38,0,bx+42,0,['#8a8a96','#3a3a44']);ctx.fillRect(bx+38,by+44,4,40);rr(bx,by,80,44,3,'#0a1220');ctx.save();ctx.shadowColor=c;ctx.shadowBlur=6;rr(bx+3,by+3,74,38,2,lg(bx,by,bx+80,by+44,[shade(c,.4),c,shade(c,-.4)]));ctx.restore();EMIT.push(['H',bx+3,by+3,74,38,c]);ctx.fillStyle='rgba(255,255,255,.18)';for(let j=by+4;j<by+41;j+=2)ctx.fillRect(bx+3,j,74,.5);text('LIVE',bx+24,by+16,'#fff',2);EMIT.push(['T','LIVE',bx+24,by+16,'#fff']);LIGHTS.push([bx+40,by+22,60,c]);}
  for(const [bx,by] of [[480,700],[540,700],[740,700],[800,700],[950,600],[1000,600]])bigBench(bx,by);
  for(const [tx,ty] of [[176,380],[1104,380],[176,744],[1104,744],[420,600],[860,600],[640,744]])bigTree(tx,ty);
  for(const lx of [200,360,520,760,920,1080])bigLamp(lx,352);for(const lx of [300,640,980])bigLamp(lx,770);
  bigVend(1050,470,'#4ff0ff');bigVend(1070,470,'#ff4fd0');bigVend(1090,470,'#7affb0');
  for(let i=0;i<3;i++){const sx=980+i*44;if(sx>1080)break;}
  for(const [sx,c,t] of [[700,'#ffe14f','TACO'],[820,'#7affb0','JUICE']]){R(sx,640,60,26,'#5a4030');R(sx-4,628,68,12,c);for(let i=sx-4;i<sx+64;i+=8)R(i,628,4,12,'#fff');EMIT.push(['T2',t,sx+30-textW(t,2)/2,646,'#fff']);LIGHTS.push([sx+30,650,40,c]);}
  // roads west/east/south
  for(const rx of [60,1150]){R(rx,330,70,PH-330,'#353844');R(rx,330,2,PH-330,'#9aa0ac');R(rx+68,330,2,PH-330,'#9aa0ac');R(rx+34,330,2,PH-330,'#e0b030');for(let j=340;j<PH;j+=24){R(rx+16,j,2,12,'#d8dce4');R(rx+52,j,2,12,'#d8dce4');}}
  R(0,790,PW,70,'#353844');R(0,790,PW,2,'#9aa0ac');R(0,858,PW,2,'#9aa0ac');R(0,823,PW,2,'#e0b030');R(0,827,PW,2,'#e0b030');for(let i=0;i<PW;i+=24){R(i,806,12,2,'#d8dce4');R(i,842,12,2,'#d8dce4');}
  for(const zx of [130,1080]){for(let i=0;i<70;i+=6)R(zx+4,790+i+2,40,3,'#e8ecf4');}
  pcar(78,420,'#ff4fd0');pcar(1160,560,'#e8eef4');pcar(300,796,'#4ff0ff');pcar(900,834,'#ffe14f');pcar(560,834,'#b07aff');
  R(680,794,180,26,'#e8eef4');R(680,814,180,6,'#4ff0ff');for(let i=688;i<850;i+=20)E(i,798,14,10,'#ffe7a0');LIGHTS.push([770,806,80,'#4ff0ff']);
  // south row
  x=0;while(x<PW){const w=Math.min(ri(80,130),PW-x);bigB(x,1040,w,ri(150,200),{sign:pick(SIG),vneon:rnd()<.4?pick(NEONS):null});x+=w;}
  // v35 cafe + planters
  for(const [tx,ty,c] of [[980,600,'#ff4fa3'],[1050,630,'#4ff0ff'],[1120,598,'#ffe14f'],[1190,632,'#7affb0'],[420,560,'#b07aff'],[490,590,'#ff8a3a']]){shadow(tx,ty+4,9);ctx.fillStyle='#2a2a34';ctx.fillRect(tx-.8,ty-22,1.6,24);rr(tx-7,ty-9,14,3,1.5,lg(0,ty-9,0,ty-6,['#f4f0e8','#a8a0a0']));ctx.fillStyle='#3a3a44';ctx.fillRect(tx-.8,ty-6,1.6,8);for(const s of [-11,9])rr(tx+s,ty-5,3,6,1,'#6a4a3a');ctx.beginPath();ctx.moveTo(tx-16,ty-20);ctx.quadraticCurveTo(tx,ty-34,tx+16,ty-20);ctx.closePath();ctx.fillStyle=lg(tx-16,0,tx+16,0,[shade(c,.35),c,shade(c,-.35)]);ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';for(let i=-12;i<=12;i+=8){ctx.beginPath();ctx.moveTo(tx,ty-28);ctx.lineTo(tx+i,ty-20);ctx.lineTo(tx+i+2,ty-20);ctx.fill();}rr(tx-2.5,ty-12,2,3,.8,'#ffd860');EMIT.push(['B',tx-1.5,ty-11,'#ffd860']);LIGHTS.push([tx,ty-8,22,'#ffd28a']);}
  for(let i=0;i<10;i++){const px=120+i*112,py=i%2?330:900;if(px>540&&px<760&&py==330)continue;shadow(px+10,py+2,12);rr(px,py-10,20,11,2,lg(0,py-10,0,py,['#8a6a54','#4a3428']));for(let k=0;k<9;k++){ctx.fillStyle=['#ff6aa8','#ffe14f','#b07aff','#ff8a3a','#7affb0'][(k+i)%5];ctx.beginPath();ctx.arc(px+3+k*1.8,py-11-((k*7)%5),1.8,0,7);ctx.fill();}ctx.fillStyle='#3a8a4a';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(px+3+k*3.5,py-10,2.4,1.4,.5,0,7);ctx.fill();}}
  finishGrain(PW,PH,.035);
  if(night){ctx.fillStyle='rgba(12,10,40,0.42)';ctx.fillRect(0,0,PW,PH);
  for(const e of EMIT)drawEmit(e);
  ctx.globalCompositeOperation='lighter';for(const [lx,ly,r,c] of LIGHTS){const gg=ctx.createRadialGradient(lx,ly,0,lx,ly,r);gg.addColorStop(0,c+'66');gg.addColorStop(1,c+'00');ctx.fillStyle=gg;ctx.fillRect(lx-r,ly-r,2*r,2*r);}
  beam(cx+30,46,-0.5,'#4ff0ff');beam(cx+cw-30,46,0.5,'#ff4fd0');beam(cx+30,46,-0.5,'#4ff0ff');beam(cx+cw-30,46,0.5,'#ff4fd0');ctx.globalCompositeOperation='source-over';
  // wet-floor neon reflections + sparkles
  ctx.globalCompositeOperation='lighter';for(const [lx,ly,r,c] of LIGHTS){if(r<30)continue;const gg=ctx.createLinearGradient(0,ly,0,ly+r*1.4);gg.addColorStop(0,c+'40');gg.addColorStop(1,c+'00');ctx.fillStyle=gg;ctx.beginPath();ctx.ellipse(lx,ly+r*.7,r*.28,r*.75,0,0,7);ctx.fill();}
  sd=99;for(let i=0;i<260;i++){const x=Math.random()*PW,y=Math.random()*PH,c=['#ffffff','#ff9ae0','#9af6ff','#ffe9a0'][i%4];ctx.fillStyle=c+'aa';ctx.fillRect(x,y,.8,.8);}
  ctx.globalCompositeOperation='source-over';}
  // tram stop sign
  busStop(744,788);
  return c;}
