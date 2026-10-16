// ===== v0.0.0.38: detailed 3/4 rooms, hotspot tags, reference-style HUD =====
function isoFloor(x,y,w,h,a,b,line){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle=a;ctx.fillRect(x,y,w,h);const TW=32,TH=16;
 for(let j=-1;j*TH/2<h+TH;j++)for(let i=-1;i*TW<w+TW;i++){const cx=x+i*TW+(j%2?TW/2:0),cy=y+j*TH/2;ctx.beginPath();ctx.moveTo(cx,cy-TH/2);ctx.lineTo(cx+TW/2,cy);ctx.lineTo(cx,cy+TH/2);ctx.lineTo(cx-TW/2,cy);ctx.closePath();ctx.fillStyle=((i+j)&1)?a:b;ctx.fill();ctx.strokeStyle=line;ctx.lineWidth=.5;ctx.stroke();}
 ctx.fillStyle=lg(0,y,0,y+40,['rgba(0,0,0,.22)','rgba(0,0,0,0)']);ctx.fillRect(x,y,w,40);ctx.restore();}
// 3/4 block: footprint x,y,w,d ; height z drawn upward
function blk(x,y,w,d,z,top,front,r=1.5){shadow(x+w/2,y+d+1,w*.55);rr(x,y-z+d,w,z,r,lg(0,y-z+d,0,y+d,[front,shade(front,-.35)]));rr(x,y-z,w,d,r,lg(x,y-z,x+w,y-z+d,[shade(top,.25),top]));ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x+1,y-z+.4,w-2,.6);}
function plant(x,y,s=1){shadow(x,y,6*s);rr(x-5*s,y-9*s,10*s,9*s,2,lg(0,y-9*s,0,y,['#e88a5a','#a04a2a']));const L=['#2fae5a','#48d070','#1f8a44','#6ae890'];for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.33;ctx.fillStyle=L[i%4];ctx.beginPath();ctx.ellipse(x+Math.cos(a)*7*s,y-12*s+Math.sin(a)*7*s,3*s,6.5*s,a+Math.PI/2,0,7);ctx.fill();}}
function poster(x,y,w,h,c1,c2,t){rr(x-1,y-1,w+2,h+2,1,'#f4f0e6');rr(x,y,w,h,1,lg(x,y,x+w,y+h,[c1,c2]));if(t)text(t,x+2,y+h-8,'#fff',.8);ctx.fillStyle='rgba(255,255,255,.25)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*.5,y);ctx.lineTo(x,y+h*.6);ctx.fill();}
function rug(x,y,w,h,c1,c2){ctx.save();ctx.translate(x+w/2,y+h/2);ctx.fillStyle=c1;ctx.beginPath();ctx.ellipse(0,0,w/2,h/2,0,0,7);ctx.fill();ctx.strokeStyle=c2;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,w/2-4,h/2-3,0,0,7);ctx.stroke();ctx.restore();}
function lamp(x,y,c){shadow(x,y,5);ctx.fillStyle='#3a3440';ctx.fillRect(x-.6,y-26,1.2,26);rr(x-6,y-34,12,9,3,lg(0,y-34,0,y-25,[shade(c,.5),c]));LIGHTS.push([x,y-28,40,c]);}
function sideWalls(W,H,wall,trim){// angled side walls for depth
 for(const [x0,x1] of [[0,14],[W,W-14]]){ctx.fillStyle=lg(x0,0,x1,0,[shade(wall,-.45),shade(wall,-.15)]);ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,52);ctx.lineTo(x1,H);ctx.lineTo(x0,H);ctx.fill();ctx.strokeStyle=trim;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,52);ctx.lineTo(x1,H);ctx.stroke();}}
function backWall(W,top,bot,trim){ctx.fillStyle=lg(0,0,0,52,[top,bot]);ctx.fillRect(0,0,W,52);for(let i=0;i<W;i+=20){ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(i,0,10,46);}ctx.fillStyle=trim;ctx.fillRect(0,46,W,3);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,49,W,3);}
function bakeClubIso(open){const W=480,H=352,c=bakeCanvas(W,H);NIGHT=open;sd=91;
 isoFloor(0,50,W,H-50,'#2a1e3e','#3a2a56','rgba(255,120,220,.18)');
 backWall(W,'#5a2a78','#2a1440','#ff4fd0');
 // wall decor: posters, neon signs, windows
 poster(124,10,22,30,'#ff4fa3','#6a1aa0','DJ');poster(150,14,18,24,'#4fd6ff','#1a4aa0');poster(322,10,22,30,'#ffe14f','#e04a2a','LIVE');poster(348,14,18,24,'#7affb0','#1a8a6a');
 rr(380,8,80,32,3,'#140a24');neon('NEON BARN',386,18,'#fff','#ff4fd0',1.3);
 for(let i=0;i<W;i+=10)E(i+2,3,5,2,NEONS[(i/10|0)%6]);
 // bar with bottle shelves (3/4)
 rr(14,6,100,38,2,lg(0,6,0,44,['#5a3424','#2a160c']));for(let r2=0;r2<2;r2++){ctx.fillStyle='#b07a40';ctx.fillRect(16,22+r2*12,96,1.5);for(let i=19;i<110;i+=5){const bc=['#e0392b','#f0b020','#3aba6a','#4ff0ff','#c07aff','#ff7ab0'][(i+r2*3)%6];rr(i,13+r2*12,3.4,9,1.2,lg(i,0,i+3.4,0,[shade(bc,.4),bc,shade(bc,-.4)]));ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(i+.6,15+r2*12,.6,5);}}
 blk(10,64,108,18,14,'#e8b880','#7a4422',2);for(let i=18;i<112;i+=14){shadow(i+3,92,4);rr(i,84,6,3,1.5,'#ff4fd0');ctx.fillStyle='#888';ctx.fillRect(i+2.5,87,1,5);}
 for(let i=24;i<110;i+=22){rr(i,56,4,6,1,'rgba(200,240,255,.8)');rr(i+7,57,4,5,1,'#ffb040');}
 // DJ booth
 speaker(170,40,30);speaker(296,40,30);
 blk(196,56,88,22,22,'#3a3a4a','#14141c',3);ctx.save();ctx.shadowColor='#ff4fd0';ctx.shadowBlur=6;rr(196,74,88,2.5,1,'#ff4fd0');ctx.restore();
 for(const tx of [220,260]){ctx.fillStyle=rg(tx,44,8,['#6a6a7a','#1a1a22']);ctx.beginPath();ctx.ellipse(tx,44,8,4.5,0,0,7);ctx.fill();ctx.strokeStyle='#4ff0ff';ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(tx,44,5.5,3,0,0,7);ctx.stroke();}
 for(let i=232;i<249;i+=3)rr(i,40,2,7,.5,NEONS[(i/3|0)%6]);neon('DJ',234,62,'#ffd1f0','#ff4fd0',1.2);
 // disco ball glow + dance floor
 danceTiles(150,100,180,120,open?1:0);ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.strokeRect(150,100,180,120);
 ctx.fillStyle=rg(240,92,7,['#ffffff','#b0b8d0','#5a6080']);ctx.beginPath();ctx.arc(240,92,6,0,7);ctx.fill();ctx.fillStyle='#aaa';ctx.fillRect(239.5,52,1,34);
 // VIP lounge: rope, sofas, table
 R(352,56,120,150,'rgba(120,20,70,.45)');rug(362,110,100,60,'#6a1a4a','#ffe14f');
 blk(358,62,108,14,16,'#c03a7a','#6a1440',4);for(let i=362;i<462;i+=18)rr(i,52,14,8,3,'#e05a9a');
 blk(392,128,40,14,10,'#2a2a36','#101018',3);rr(398,112,6,6,1,'#ffe14f');rr(412,113,8,4,1,'#4ff0ff');
 blk(358,178,40,16,12,'#c03a7a','#6a1440',4);blk(426,178,40,16,12,'#c03a7a','#6a1440',4);
 for(let j=60;j<206;j+=12){rr(347,j,4,8,1.5,'#e0c040');}ctx.strokeStyle='#c01a4a';ctx.lineWidth=1.5;ctx.beginPath();for(let j=64;j<206;j+=12){ctx.moveTo(349,j);ctx.quadraticCurveTo(352,j+6,349,j+12);}ctx.stroke();
 neon('VIP',398,86,'#fff2a0','#ffb040',1.6);
 // lounge left: tables, arcade, jukebox, plants
 for(const [tx,ty] of [[40,150],[96,200],[40,250]]){blk(tx-10,ty,20,12,10,'#f0f0f6','#8a8aa0',6);rr(tx-3,ty-14,6,6,1,'#ff4fd0');for(const sx of [-16,14])blk(tx+sx-3,ty+2,8,8,6,'#4ff0ff','#1a6a8a',3);}
 blk(18,300,22,14,34,'#4a2a8a','#1a0a3a',2);rr(21,270,16,12,1,'#4ff0ff');rr(21,284,16,3,1,'#ffe14f');text('ARC',21,290,'#fff',.7);
 blk(124,300,20,14,30,'#c07a3a','#5a2a10',5);ctx.fillStyle=rg(134,282,8,['#ffe14f','#ff4fd0','rgba(0,0,0,0)']);ctx.beginPath();ctx.arc(134,282,7,0,7);ctx.fill();
 plant(132,58);plant(150,330);plant(330,330);plant(344,226);
 // office (3/4 room with desk + monitor + safe)
 R(368,248,104,96,'#2a2420');isoFloor(372,252,100,92,'#4a3a30','#3e3028','rgba(0,0,0,.2)');R(368,248,104,4,'#7a5a3a');R(368,248,4,96,'#7a5a3a');
 blk(398,272,44,14,14,'#a0683a','#5a3018',2);rr(410,248,18,12,1,'#20202a');rr(411.5,249.5,15,9,1,'#4ff0ff');rr(450,300,16,18,1,'#6a6a7a');rr(454,304,8,6,3,'#ffe14f');plant(380,336,.8);
 // exit mat
 rr(200,H-12,80,10,2,open?'#ff4fd0':'#6a2a6a');text('EXIT',228,H-11,'#fff2c0');
 sideWalls(W,H,'#5a2a78','#ff4fd0');
 finishGrain(W,H,.03);if(open){LIGHTS.push([240,160,140,'#ff4fd0'],[60,70,60,'#ffe14f'],[410,130,70,'#b07aff'],[240,60,60,'#4ff0ff'],[134,282,40,'#ffb040']);finishNight(c,W,H,0.18);}else{ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,W,H);}
 return c;}
function bakeHomeIso(night){const W=480,H=320,c=bakeCanvas(W,H);NIGHT=night;sd=44;
 isoFloor(0,44,W,H-44,'#f6f6fa','#e2e6ee','rgba(150,160,180,.35)');
 backWall(W,'#ffd6a0','#f0b070','#ffffff');
 // window with city view
 rr(12,6,70,36,2,'#ffffff');rr(15,9,64,30,1,lg(0,9,0,39,night?['#1a1040','#4a2a80']:['#7ad0ff','#d0f0ff']));for(let i=18;i<76;i+=9){ctx.fillStyle=night?'#2a1a50':'#a0b8d0';ctx.fillRect(i,24-(i%5)*2,6,15+(i%5)*2);if(night){ctx.fillStyle='#ffe14f';ctx.fillRect(i+2,28,1,1);}}ctx.fillStyle='#fff';ctx.fillRect(46,9,1.5,30);
 rr(90,4,30,40,2,lg(0,4,0,44,['#4fd0a0','#2a8a6a']));// curtain
 poster(250,10,24,18,'#ff7ab0','#ffd14f');poster(280,12,16,16,'#4fd6ff','#7a4aff');
 // TV wall unit (desk area 140-230,70-120)
 blk(140,92,90,24,16,'#f4f0e6','#b0a890',2);rr(150,48,70,40,2,'#14141c');rr(153,51,64,34,1,lg(153,51,217,85,['#4ff0ff','#7a4aff','#ff4fd0']));ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.moveTo(153,51);ctx.lineTo(185,51);ctx.lineTo(153,72);ctx.fill();
 rr(144,78,8,14,1,'#2a2a36');rr(218,78,8,14,1,'#2a2a36');plant(236,100,.9);
 // bed
 blk(40,72,50,62,12,'#ffffff','#c8c8d8',3);rr(42,62,46,12,3,lg(0,62,0,74,['#9a7ae8','#5a3ab0']));rr(44,70,18,9,4,'#ffffff');rr(66,70,18,9,4,'#ffffff');rr(42,92,46,30,3,lg(42,0,88,0,['#ffb0d0','#ff7ab0']));ctx.fillStyle='rgba(255,255,255,.4)';for(let i=46;i<86;i+=8)ctx.fillRect(i,94,1,26);
 blk(94,92,16,14,12,'#c08a50','#7a4a24',2);lamp(102,92,'#ffe0a0');
 // sofa + rug + coffee table
 rug(118,150,150,80,'#7ac8f0','#ffffff');
 blk(130,178,120,30,14,'#4a6aaa','#2a3a6a',5);rr(130,160,120,14,5,lg(0,160,0,174,['#6a8ad0','#3a5a9a']));for(const px of [140,166,192,218])rr(px,172,22,10,4,'#8aaae8');rr(150,168,14,10,4,'#ffd14f');rr(214,168,14,10,4,'#ff7ab0');
 blk(165,140,50,16,8,'#ffffff','#b8bcc8',4);rr(175,134,8,5,1,'#ff4fd0');rr(195,135,10,3,1,'#4fd0a0');
 // fishtank on left
 blk(12,256,40,24,16,'#20202a','#14141c',1);rr(12,224,40,34,2,'rgba(160,230,255,.85)');ctx.fillStyle=lg(0,226,0,256,['#7ae8ff','#2a8ad0']);ctx.fillRect(14,228,36,28);for(const [fx,fy,fc] of [[22,236,'#ff7a3d'],[36,244,'#ffe14f'],[30,232,'#ff4fd0']]){ctx.fillStyle=fc;ctx.beginPath();ctx.ellipse(fx,fy,3,1.6,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(fx+2.5,fy);ctx.lineTo(fx+5,fy-2);ctx.lineTo(fx+5,fy+2);ctx.fill();}ctx.fillStyle='#2fae5a';for(let i=16;i<48;i+=6){ctx.fillRect(i,248-(i%4)*2,1.5,8+(i%4)*2);}ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(15,226,2,30);LIGHTS.push([32,240,30,'#4ff0ff']);
 // tram terminal
 blk(16,214,30,8,24,'#2a2e3e','#14182a',2);rr(19,194,24,14,1,'#4ff0ff');text('TRAM',20,198,'#14182a',.7);
 // bathroom (glass partition + tub + shower + toilet)
 isoFloor(300,44,180,H-44,'#d8f0f8','#bfe2f0','rgba(255,255,255,.7)');ctx.fillStyle='rgba(200,240,255,.55)';ctx.fillRect(296,44,4,H-44);
 blk(330,96,120,60,14,'#ffffff','#c8d4e0',14);rr(338,88,104,44,12,lg(0,88,0,132,['#bff4ff','#4ac8e8']));for(let i=0;i<10;i++){ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(348+i*10,96+(i%3)*3,3+(i%2),0,7);ctx.fill();}ctx.fillStyle='#c0c8d0';ctx.fillRect(436,80,3,10);
 rr(420,190,46,60,3,'rgba(190,240,255,.5)');ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.strokeRect(420,190,46,60);ctx.fillStyle='#c0c8d0';ctx.fillRect(440,192,6,3);
 blk(320,226,20,16,12,'#ffffff','#c8d0d8',6);plant(470,300,.8);plant(312,80,.8);rr(330,180,28,6,2,'#ff7ab0');
 rr(220,H-10,60,8,2,'#a07a54');text('DOOR',238,H-9,'#fff');
 sideWalls(W,H,'#ffd6a0','#ffffff');
 if(night)finishNight(c,W,H,0.28);return c;}
AREAS.club.bake=bakeClubIso;AREAS.home.bake=bakeHomeIso;
AREAS.home.solids.push([12,224,40,58],[94,80,16,26]);
AREAS.home.acts.push({r:[140,60,90,60],a:'tv',label:'Watch TV',tag:'TV',msg:'Neon News: "Club scene booming downtown!"'},{r:[10,220,46,62],a:'fish',label:'Feed the fish',tag:'FISHTANK',msg:'The fish do a happy little loop.'},{r:[326,84,128,80],a:'bath',label:'Take a bath',tag:'BATHROOM',msg:'A bubbly soak. You feel refreshed!'});
AREAS.club.acts.push({r:[352,60,120,40],a:'vip',label:'VIP lounge',tag:'VIP',msg:'Plush seats, gold rope. Big spenders love it.'},{r:[14,296,30,20],a:'arcade',label:'Play arcade',tag:'ARCADE',msg:'High score! The machine plays a victory jingle.'});
AREAS.club.solids.push([18,286,22,28],[124,288,20,26]);
const TAGS={office:'OFFICE',djbooth:'DJ BOOTH',bar:'BAR',bed:'BED',tram:'TRAM',rzelshop:'RZEL SHOP',supply:'SUPPLY',hire:'HIRE',craft:'WORKBENCH'};
function drawTags(cx,cy){X.setTransform(DPR,0,0,DPR,0,0);X.textBaseline='middle';X.textAlign='center';const pr=nearAct();
 for(const a of AREA.acts){const t=a.tag||TAGS[a.a];if(!t)continue;const sx=(a.r[0]+a.r[2]/2-cx)*K/DPR,sy=(a.r[1]-cy)*K/DPR-6;if(sx<-60||sx>cssW+60||sy<-20||sy>canH+20)continue;
  X.font='bold 11px "Trebuchet MS",Verdana,sans-serif';const w=X.measureText(t).width+18,on=pr===a;
  X.fillStyle='rgba(0,0,0,.35)';rrX(sx-w/2+1,sy-11+2,w,18,9);X.fill();X.fillStyle=on?'#ffe14f':'#2a2430';rrX(sx-w/2,sy-11,w,18,9);X.fill();X.strokeStyle=on?'#fff':'#ffe14f';X.lineWidth=1.2;X.stroke();
  X.fillStyle=on?'#2a2430':'#ffffff';X.fillText(t,sx,sy-2);X.fillStyle='#ffe14f';X.font='7px sans-serif';X.fillText('\u2605\u2605\u2605',sx,sy+11);
  X.fillStyle=on?'#ffe14f':'#2a2430';X.beginPath();X.moveTo(sx-4,sy+7);X.lineTo(sx+4,sy+7);X.lineTo(sx,sy+12);X.fill();}
 X.textAlign='left';X.textBaseline='alphabetic';}
function rrX(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
function totalHearts(){let n=0;for(const id in NPCDEF)n+=heartsOf(id);return n;}
function topM(){if(!window._sai){const d=document.createElement('div');d.style.cssText='position:fixed;top:0;height:env(safe-area-inset-top,0px);width:1px;visibility:hidden';document.body.appendChild(d);window._sai=d;}const e=window._sai.offsetHeight||0;const v=Math.max(e,TOUCH&&cssH>cssW?28:0);document.documentElement.style.setProperty('--tm',v+'px');return v;}
function drawHUD(){const sm=cssW<500;const TM=topM();X.save();X.translate(0,TM);
 // top-left: time bar + money/heart counter (reference style)
 const x=6,y=6,w=sm?150:176;X.fillStyle='rgba(0,0,0,.75)';rrX(x,y,w,46,6);X.fill();X.strokeStyle='#ffe14f';X.lineWidth=1.5;X.stroke();
 X.font='bold 9px "Trebuchet MS",sans-serif';X.fillStyle='#ffe14f';X.fillText(((isNight()?'NIGHT ':'DAY ')+G.day+'  \u2022  '+fmtT(G.time)).toUpperCase(),x+8,y+12);
 const fr=((G.time%1440)/1440);X.fillStyle='#3a3020';X.fillRect(x+8,y+16,w-16,4);X.fillStyle=lg2(x+8,w-16);X.fillRect(x+8,y+16,(w-16)*fr,4);
 X.fillStyle='#ff4f6a';X.font='bold 15px sans-serif';X.fillText('\u2665',x+8,y+38);X.fillStyle='#fff';X.font='bold 14px "Courier New",monospace';X.fillText(String(Math.max(0,G.gold|0)).padStart(8,'0'),x+24,y+38);
 X.font='bold 10px sans-serif';X.fillStyle='#ffb0c8';X.textAlign='right';X.fillText('\u2665'+totalHearts(),x+w-8,y+38);X.textAlign='left';
 // area tag (top centre, like "GYM")
 X.font='bold 11px "Trebuchet MS",sans-serif';const an=AREA.name.toUpperCase(),aw=X.measureText(an).width+20,ax=sm?x:cssW/2-aw/2,ay=sm?58:10;X.fillStyle='rgba(30,26,36,.85)';rrX(ax,ay,aw,18,9);X.fill();X.fillStyle='#fff';X.fillText(an,ax+10,ay+13);X.fillStyle='#ffe14f';X.font='7px sans-serif';X.fillText('\u2605\u2605\u2605',ax+aw/2-9,ay+24);
 X.font='bold 11px sans-serif';X.fillStyle='#ffe14f';X.textAlign='right';X.fillText('\u2605'+G.fans+' fans',cssW-8,sm?58+12:62);X.textAlign='left';
 if(G.club.open&&G.night){const N=G.night,inc=N.inc.door+N.inc.bar+N.inc.dance+N.inc.vip;const w2=sm?150:190,x2=cssW-w2-6,y2=sm?76:70;X.fillStyle='rgba(0,0,0,.75)';rrX(x2,y2,w2,60,6);X.fill();X.strokeStyle='#ff4fd0';X.stroke();X.font='bold 11px monospace';X.fillStyle='#fff';
  X.fillText('OPEN  in:'+GUESTS.length+' queue:'+QUEUE,x2+8,y2+15);X.fillText('Hype',x2+8,y2+30);X.fillStyle='#3a2a5a';X.fillRect(x2+44,y2+23,w2-56,7);X.fillStyle='#ff4fd0';X.fillRect(x2+44,y2+23,(w2-56)*N.hype/100,7);
  X.fillStyle='#fff';X.fillText('Clean',x2+8,y2+44);X.fillStyle='#3a2a5a';X.fillRect(x2+44,y2+37,w2-56,7);X.fillStyle='#4fd060';X.fillRect(x2+44,y2+37,(w2-56)*G.club.clean/100,7);X.fillStyle='#fff';X.fillText('Tonight +'+inc+'g',x2+8,y2+56);}
 X.restore();const n=nearNPC();const tb=$('talkBtn');if(tb){const show=!!n&&!UI&&!dlgOpen;tb.classList.toggle('show',show);if(show)tb.dataset.n=NPCDEF[n].name;}
 const pr=n?null:prompt();if(pr&&!UI){X.font='bold 13px "Trebuchet MS",sans-serif';const t=(TOUCH?'USE: ':'E: ')+pr,tw=X.measureText(t).width+20;X.fillStyle='rgba(0,0,0,.72)';rrX(cssW/2-tw/2,canH-40,tw,28,14);X.fill();X.strokeStyle='#ffe14f';X.stroke();X.fillStyle='#fff';X.fillText(t,cssW/2-tw/2+10,canH-21);}
 X.font='bold 12px monospace';MSG.forEach(m=>{m.d-=1/60;});MSG=MSG.filter(m=>m.d>0);let yy=canH-50;const maxw=cssW-24;for(let i=MSG.length-1;i>=0;i--){const m=MSG[i];const lines=[];let l='';for(const w of m.t.split(' ')){const t2=l?l+' '+w:w;if(X.measureText(t2).width>maxw&&l){lines.push(l);l=w;}else l=t2;}lines.push(l);const bh=lines.length*15+6;yy-=bh+4;const tw=Math.min(cssW-12,Math.max(...lines.map(q=>X.measureText(q).width))+14);X.globalAlpha=Math.min(1,m.d*2);X.fillStyle='rgba(20,16,30,.85)';X.fillRect(6,yy,tw,bh);X.fillStyle='#ffe9b0';lines.forEach((q,k)=>X.fillText(q,13,yy+15+k*15));X.globalAlpha=1;}}
function lg2(x,w){const g=X.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#ffe14f');g.addColorStop(1,'#ff7a3d');return g;}
(function(){const s=document.createElement('style');s.textContent=`
#hudR{position:fixed;z-index:6;top:calc(6px + var(--tm,0px));right:6px;display:flex;gap:4px}
#noteBtn{height:34px;padding:0 14px 0 18px;font:900 15px "Trebuchet MS",sans-serif;letter-spacing:1px;color:#fff;background:linear-gradient(#3aa8f0,#1a6ac8);border:2px solid #0a2a5a;clip-path:polygon(10px 0,100% 0,100% 100%,0 100%);border-radius:0 4px 4px 0;text-shadow:0 1px 0 #0a2a5a}
#gearBtn{width:34px;height:34px;font-size:20px;color:#fff;background:linear-gradient(#3aa8f0,#1a6ac8);border:2px solid #0a2a5a;border-radius:4px;padding:0;line-height:1}
#talkBtn{display:none;position:fixed;z-index:6;right:10px;top:calc(var(--ch) - 64px);height:50px;min-width:120px;padding:0 18px;font:900 20px "Trebuchet MS",sans-serif;letter-spacing:1px;color:#fff;background:linear-gradient(#7af06a,#2aa83a);border:3px solid #0a4a14;border-radius:12px;box-shadow:0 4px 0 #0a4a14,0 0 14px rgba(120,255,120,.5);text-shadow:0 2px 0 #0a4a14;animation:tpulse 1s infinite alternate}
#talkBtn.show{display:block}#talkBtn:after{content:attr(data-n);display:block;font:700 10px sans-serif;letter-spacing:0;margin-top:-3px}
body:not(.touch) #talkBtn{top:auto;bottom:16px}
@keyframes tpulse{to{transform:translateY(-2px)}}
`;document.head.appendChild(s);
 const r=document.createElement('div');r.id='hudR';r.innerHTML='<button id="noteBtn" type="button">NOTE</button><button id="gearBtn" type="button">\u2699</button>';document.body.appendChild(r);
 const t=document.createElement('button');t.id='talkBtn';t.type='button';t.textContent='TALK';document.body.appendChild(t);
 const tap=(el,f)=>{el.addEventListener('touchstart',e=>{e.preventDefault();f();},{passive:false});el.addEventListener('click',f);};
 tap($('noteBtn'),()=>{if(!dlgOpen)openPanel('social');});tap($('gearBtn'),()=>{if(!dlgOpen)openPanel('menu');});tap(t,()=>{const n=nearNPC();if(n&&!dlgOpen&&!UI)openTalk(n);});})();
