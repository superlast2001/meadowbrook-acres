const PW=1280,PH=960;
function bakePlaza(night){const c=document.createElement('canvas');c.width=PW;c.height=PH;ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;LIGHTS=[];EMIT=[];NIGHT=night;sd=777;
  sidewalk(0,0,PW,PH);
  // north road
  R(0,0,PW,30,'#353844');for(let i=0;i<PW;i+=24)R(i,14,12,2,'#d8dce4');
  // north building row base 300
  let x=0;const SIG=['NOODLE','ARCADE','BOBA','SUSHI','HOTEL','GEAR','TATTOO','KARAOKE'];let k=0;
  while(x<440){const w=Math.min(ri(72,120),440-x);bigB(x,300,w,ri(170,240),{sign:SIG[k++%8],vneon:rnd()<.5?pick(NEONS):null,holo:rnd()<.3});x+=w;}
  x=840;while(x<PW){const w=Math.min(ri(72,120),PW-x);bigB(x,300,w,ri(170,240),{sign:SIG[k++%8],vneon:rnd()<.5?pick(NEONS):null,holo:rnd()<.3});x+=w;}
  // ==== NEON BARN club 440-840, roof 52-80, facade 80-300
  const cx=440,cw=400;R(cx,52,cw,28,'#3a2a5a');R(cx,52,cw,2,'#6a4a8a');for(let i=cx+20;i<cx+cw-30;i+=60){R(i,58,20,14,'#c8ccd4');R(i+3,61,14,8,'#7a7e8a');}
  R(cx,80,cw,220,'#24183a');for(let i=cx;i<cx+cw;i+=12)R(i,80,2,220,'#2e2048');R(cx,80,4,220,'#4a3a6a');R(cx+cw-4,80,4,220,'rgba(0,0,0,.3)');
  for(let i=cx+8;i<cx+cw-8;i+=10)E(i,84,5,3,NEONS[(i/10|0)%6]);
  R(cx+40,100,cw-80,52,'#0e0814');EMIT.push(['N4','NEON BARN',cx+cw/2-textW('NEON BARN',4)/2,110]);LIGHTS.push([cx+cw/2,126,190,'#ff4fa3']);
  for(const sx of [cx+16,cx+cw-24])E(sx,96,8,190,'#4ff0ff'),LIGHTS.push([sx+4,190,40,'#4ff0ff']);
  for(let j=0;j<3;j++)for(let i=cx+44;i<cx+cw-44;i+=28){const lit=(i+j)%3!=0;E(i,166+j*0?0:166,0,0,'#000');}
  for(let i=cx+44;i<cx+cw-50;i+=32){R(i,166,22,40,'#120a18');E(i+2,168,18,36,(i/32|0)%2?'#ff4fd0':'#b07aff');R(i+2,184,18,2,'#120a18');}
  // entrance
  R(cx+150,212,100,88,'#120a18');E(cx+160,226,80,74,'#ff4fd0');R(cx+198,226,4,74,'#120a18');for(let j=232;j<300;j+=10)R(cx+160,j,80,1,'rgba(0,0,0,.25)');
  R(cx+130,204,140,14,'#c0392b');R(cx+130,204,140,2,'#e8584a');for(let i=cx+130;i<cx+270;i+=8)R(i,218,4,4,'#c0392b');for(let i=cx+136;i<cx+270;i+=12)E(i,208,4,3,'#fff6c0');
  R(cx+136,218,3,82,'#888');R(cx+261,218,3,82,'#888');LIGHTS.push([cx+200,262,70,'#ff4fd0']);
  // spotlights on roof edge + beams
  for(const [sx,a,c] of [[cx+30,0.5,'#4ff0ff'],[cx+cw-30,-0.5,'#ff4fd0']]){R(sx-6,40,12,12,'#333');E(sx-3,42,6,4,'#fff');}
  // red carpet + rope line
  R(cx+170,300,60,60,'#8a1e2a');R(cx+172,300,2,60,'#c0392b');R(cx+226,300,2,60,'#c0392b');
  for(let i=0;i<6;i++){const px=cx+250+i*24;R(px,322,3,20,'#d0b040');R(px-1,320,5,3,'#ffe14f');}for(let i=0;i<5;i++){const px=cx+252+i*24;ctx.strokeStyle='#c0392b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,326);ctx.quadraticCurveTo(px+11,334,px+22,326);ctx.stroke();}
  // ==== plaza
  const X0=160,Y0=360,X1=1120,Y1=760;R(X0,Y0,X1-X0,Y1-Y0,'#1a1830');for(let j=Y0;j<Y1;j+=16)for(let i=X0;i<X1;i+=16){R(i,j,16,1,'#3a2a5a');R(i,j,1,16,'#2a3a5a');if(((i+j)/16)%7==0)E(i+1,j+1,15,15,'#2a1d4a');}
  for(let i=X0;i<X1;i+=4)E(i,Y0,2,2,'#ff4fd0'),E(i,Y1-2,2,2,'#4ff0ff');
  // fountain
  ctx.fillStyle='#5a6070';ctx.beginPath();ctx.ellipse(640,560,90,44,0,0,7);ctx.fill();ctx.fillStyle='#163a6a';ctx.beginPath();ctx.ellipse(640,560,80,38,0,0,7);ctx.fill();
  for(let i=0;i<40;i++)E(560+((i*37)%160),532+((i*23)%56),4,1,'#6ab0e8');R(632,500,16,60,'#5a6070');
  ctx.save();ctx.globalAlpha=.55;ctx.fillStyle='#4ff0ff';ctx.beginPath();ctx.moveTo(624,500);ctx.lineTo(656,500);ctx.lineTo(676,420);ctx.lineTo(604,420);ctx.fill();ctx.restore();EMIT.push(['HOLO',640,460]);LIGHTS.push([640,520,110,'#4ff0ff']);
  // stage
  R(200,420,170,60,'#2a2e3e');R(200,420,170,4,'#ff4fd0');R(208,370,4,50,'#555');R(358,370,4,50,'#555');R(206,366,158,8,'#3a3e50');for(let i=216;i<360;i+=24)E(i,374,6,4,NEONS[(i/24|0)%6]);speaker(214,394,26);speaker(342,394,26);LIGHTS.push([285,440,90,'#ff4fd0']);
  // billboard pillars, benches, trees, vending, kiosks
  for(const [bx,by,c] of [[900,420,'#b07aff'],[180,640,'#ffe14f']]){R(bx,by,80,44,'#101828');E(bx+3,by+3,74,38,c);text('LIVE',bx+24,by+16,'#fff',2);R(bx+38,by+44,4,40,'#555');LIGHTS.push([bx+40,by+22,60,c]);}
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
  if(night){ctx.fillStyle='rgba(12,10,40,0.62)';ctx.fillRect(0,0,PW,PH);
  for(const e of EMIT){if(e[0]=='T2')text(e[1],e[2],e[3],e[4],2);else if(e[0]=='N4')neon(e[1],e[2],e[3],'#ffd1f0','#ff4fa3',4);else if(e[0]=='HOLO'){ctx.save();ctx.globalAlpha=.6;ctx.fillStyle='#bff4ff';ctx.beginPath();ctx.arc(e[1],e[2],18,0,7);ctx.fill();ctx.restore();text('?',e[1]-4,e[2]-8,'#fff',3);}else if(e[0]=='T')text(e[1],e[2],e[3],e[4]);else R(...e);}
  ctx.globalCompositeOperation='lighter';for(const [lx,ly,r,c] of LIGHTS){const gg=ctx.createRadialGradient(lx,ly,0,lx,ly,r);gg.addColorStop(0,c+'66');gg.addColorStop(1,c+'00');ctx.fillStyle=gg;ctx.fillRect(lx-r,ly-r,2*r,2*r);}
  beam(cx+30,46,-0.5,'#4ff0ff');beam(cx+cw-30,46,0.5,'#ff4fd0');beam(cx+30,46,-0.5,'#4ff0ff');beam(cx+cw-30,46,0.5,'#ff4fd0');ctx.globalCompositeOperation='source-over';}
  // tram stop sign
  busStop(744,788);
  return c;}
