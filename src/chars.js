// ===== Smooth vector characters (v0.0.0.35) =====
const OUT='rgba(25,12,30,.55)';
function hseed(s){let x=s*9301+49297;return ()=>{x=(x*16807)%2147483647;return x/2147483647;};}
const CSKIN=['#f6d2b4','#eab48e','#d09468','#a8704a','#7a4c30','#5a3622'],CHAIR=['#2a1a12','#5a3820','#8a5a30','#e6c470','#c8502a','#e8e8ec','#4ff0ff','#ff6ad0','#1c1c2a','#8a5ad0','#3a2a6a'];
const CTOP=['#e04050','#4060e0','#3aa060','#f0c040','#f4f4f8','#2a2a34','#ff4fd0','#38c8e0','#8a5ad0','#f07a30','#2a8a8a','#c0c8d8','#7a1e3a'],CBOT=['#24284a','#34343c','#5a4a3a','#18181e','#5a5a6a','#24466a','#3a2a4a','#e8e2d0'];
function lookFromSeed(s){const r=hseed(s),p=a=>a[Math.floor(r()*a.length)];const fem=r()<.5;return {fem,skin:p(CSKIN),hair:p(CHAIR),hs:fem?p(['long','bob','pony','bun','long','curly']):p(['short','short','mohawk','curly','buzz','pony']),
 top:p(CTOP),top2:p(CTOP),jacket:r()<.35,dress:fem&&r()<.3,bot:p(CBOT),shoe:p(['#1a1a20','#f4f4f8','#6a3a1a','#c0392b']),shades:r()<.2,glow:r()<.3?p(['#4ff0ff','#ff4fd0','#7affb0','#ffe14f']):null,h:29+r()*4,w:r()<.25?1.15:r()<.3?0.92:1};}
const LOOKS={farmer:{fem:false,skin:'#f2c8a0',hair:'#6a4020',hs:'short',top:'#f4f0e6',bot:'#3a62c8',overalls:'#3a62c8',shoe:'#6a3a1a',hat:'straw',h:31,w:1.05},
 mabel:{fem:true,skin:'#f0caa8',hair:'#dcdce4',hs:'bun',top:'#8a4ab0',dress:true,bot:'#8a4ab0',shoe:'#3a2a3a',hat:'sun',hatC:'#7a3aa0',h:29,w:1.05,old:true,shawl:'#e8d0f0'},
 pip:{fem:false,skin:'#e0a878',hair:'#8a4a20',hs:'short',top:'#3aa050',bot:'#7a5a3a',shorts:true,shoe:'#c0392b',hat:'cap',hatC:'#d0302a',h:23,w:.95,kid:true}};
function lgr(x0,y0,x1,y1,a){const g=ctx.createLinearGradient(x0,y0,x1,y1);a.forEach((c,i)=>g.addColorStop(i/(a.length-1),c));return g;}
function sh(c,f){return shade(c,f);}
function limb(x0,y0,x1,y1,w,c,c2){ctx.lineCap='round';ctx.strokeStyle=OUT;ctx.lineWidth=w+.8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle=lgr(x0-w,y0,x0+w,y0,[sh(c,.15),c,c2||sh(c,-.25)]);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();}
function blob(path,fill,stroke=true){ctx.beginPath();path();ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=OUT;ctx.lineWidth=.5;ctx.stroke();}}
// x=center feet, y=feet. dir: down/up/left/right. t=walk distance, moving bool
function human(x,y,L,dir,t,moving){const s=L.h/31,W=L.w||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 // shadow
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,.3,5.5*W,1.8,0,0,7);ctx.fill();
 const ph=moving?t*0.42:0,sw=moving?Math.sin(ph):0,bob=moving?-Math.abs(Math.cos(ph))*0.7:0;
 const side=dir=='left'||dir=='right';if(dir=='left')ctx.scale(-1,1);
 const hipY=-14+bob,shY=-24.5+bob,hw=3.4*W,sw2=(L.fem?4:4.6)*W;const pants=L.bot,skin=L.skin;
 const legC=L.shorts?skin:pants;
 // ---- legs
 if(side){const a=sw*3.2;
  limb(0,hipY,-a,-1.2,2.8,legC);limb(0,hipY,a,-1.2,2.8,legC);
  if(L.shorts){limb(0,hipY,-a*.45,hipY+5,3.2,pants);limb(0,hipY,a*.45,hipY+5,3.2,pants);}
  for(const fx of [-a,a]){blob(()=>ctx.ellipse(fx+1,-.6,2.2,1.1,0,0,7),L.shoe);}
 }else{const l1=moving?sw*1.4:0;
  for(const [lx,dl] of [[-1.7*W,l1],[1.7*W,-l1]]){limb(lx,hipY,lx,-1.4-Math.max(0,dl),2.9*W,legC);if(L.shorts)limb(lx,hipY,lx,hipY+5,3.4*W,pants);blob(()=>ctx.ellipse(lx,-.7-Math.max(0,dl),1.9*W,1.1,0,0,7),L.shoe);}}
 // ---- back arm (side view)
 const armSw=moving?-sw*2.6:0;const top=L.top;
 if(side)limb(0,shY+1.5,-armSw*0.9,shY+10,2.2,L.jacket?L.top2:top,sh(top,-.35));
 // ---- dress / torso
 const tW=sw2,wW=hw;
 if(L.dress){blob(()=>{ctx.moveTo(-tW*.85,shY+.5);ctx.lineTo(tW*.85,shY+.5);ctx.lineTo(wW+2.2,hipY+5);ctx.quadraticCurveTo(0,hipY+6.5,-wW-2.2,hipY+5);},lgr(0,shY,0,hipY+6,[sh(L.top,.2),L.top,sh(L.top,-.35)]));}
 else{blob(()=>{if(side){ctx.moveTo(-2.4*W,shY);ctx.quadraticCurveTo(3.4*W,shY,2.6*W,hipY+1);ctx.lineTo(-2.2*W,hipY+1);}else{ctx.moveTo(-tW,shY+.6);ctx.quadraticCurveTo(0,shY-.8,tW,shY+.6);ctx.lineTo(wW,hipY+1);ctx.lineTo(-wW,hipY+1);}},lgr(-tW,0,tW,0,[sh(top,.18),top,sh(top,-.3)]));
  if(L.jacket&&!side){blob(()=>{ctx.moveTo(-tW,shY+.6);ctx.lineTo(-1,shY+.2);ctx.lineTo(-1.2,hipY+1);ctx.lineTo(-wW,hipY+1);},lgr(-tW,0,0,0,[sh(L.top2,.15),sh(L.top2,-.2)]));blob(()=>{ctx.moveTo(tW,shY+.6);ctx.lineTo(1,shY+.2);ctx.lineTo(1.2,hipY+1);ctx.lineTo(wW,hipY+1);},lgr(0,0,tW,0,[sh(L.top2,0),sh(L.top2,-.35)]));}
  if(L.overalls){blob(()=>{if(side){ctx.moveTo(-1.8,shY+3.5);ctx.lineTo(2.4,shY+3.5);ctx.lineTo(2.6,hipY+1);ctx.lineTo(-2.2,hipY+1);}else{ctx.moveTo(-2.6,shY+3.2);ctx.lineTo(2.6,shY+3.2);ctx.lineTo(wW,hipY+1);ctx.lineTo(-wW,hipY+1);}},lgr(0,shY,0,hipY,[sh(L.overalls,.2),L.overalls,sh(L.overalls,-.3)]));
   if(!side){ctx.strokeStyle=L.overalls;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-2.2,shY+3.4);ctx.lineTo(-3,shY+.6);ctx.moveTo(2.2,shY+3.4);ctx.lineTo(3,shY+.6);ctx.stroke();ctx.fillStyle='#e0c060';ctx.beginPath();ctx.arc(-2.1,shY+3.6,.45,0,7);ctx.arc(2.1,shY+3.6,.45,0,7);ctx.fill();}}
  ctx.fillStyle=sh(L.bot,-.2);ctx.fillRect(side?-2.2:-wW,hipY+.4,side?4.8:wW*2,1);}
 if(L.shawl&&!side){blob(()=>{ctx.moveTo(-tW-.3,shY+.4);ctx.quadraticCurveTo(0,shY+6,tW+.3,shY+.4);ctx.quadraticCurveTo(0,shY-1.2,-tW-.3,shY+.4);},L.shawl);}
 if(L.glow&&!side){ctx.save();ctx.strokeStyle=L.glow;ctx.shadowColor=L.glow;ctx.shadowBlur=2;ctx.lineWidth=.5;ctx.beginPath();ctx.arc(0,shY+.5,2.2,0.2,Math.PI-.2);ctx.stroke();ctx.restore();}
 // ---- arms
 const armC=L.jacket?L.top2:(L.dress||L.overalls?(L.overalls?L.top:skin):top);
 if(side){limb(0,shY+1.5,armSw,shY+10,2.3,armC);blob(()=>ctx.arc(armSw,shY+10.6,1.15,0,7),skin);}
 else{const ay=moving?sw*0.8:0;for(const [ax,k] of [[-tW-.3,1],[tW+.3,-1]]){limb(ax,shY+1.2,ax-.6*Math.sign(ax)*-1+0,shY+10+ay*k,2.2*W,armC);blob(()=>ctx.arc(ax,shY+10.7+ay*k,1.15,0,7),skin);}}
 // ---- neck + head
 const hy=shY-4.4;ctx.fillStyle=sh(skin,-.15);ctx.fillRect(-.9,shY-1.6,1.8,2);
 const hr=L.kid?3.5:3.2;
 const hairBack=()=>{if(L.hs=='long'||L.hs=='curly'&&L.fem)blob(()=>{ctx.moveTo(-hr-.8,hy-1);ctx.quadraticCurveTo(-hr-1.4,hy+6,-hr+.4,hy+7.5);ctx.lineTo(hr-.4,hy+7.5);ctx.quadraticCurveTo(hr+1.4,hy+6,hr+.8,hy-1);},lgr(0,hy,0,hy+8,[sh(L.hair,.15),sh(L.hair,-.25)]));};
 if(dir!='up')hairBack();
 blob(()=>ctx.ellipse(side?.3:0,hy,hr*.92,hr*1.08,0,0,7),(()=>{const g=ctx.createRadialGradient(-1,hy-1.4,.4,0,hy,hr*1.3);g.addColorStop(0,sh(skin,.25));g.addColorStop(.6,skin);g.addColorStop(1,sh(skin,-.25));return g;})());
 if(side){blob(()=>{ctx.moveTo(hr*.85,hy-.2);ctx.lineTo(hr+.7,hy+.9);ctx.lineTo(hr*.8,hy+1.2);},skin,false);}
 // face
 if(dir=='down'){ctx.fillStyle='#1a1018';for(const ex of [-1.2,1.2]){ctx.beginPath();ctx.ellipse(ex,hy+.3,.42,.55,0,0,7);ctx.fill();}ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(-1.3,hy+.05,.2,.2);ctx.fillRect(1.1,hy+.05,.2,.2);
  ctx.strokeStyle=sh(L.hair,-.2);ctx.lineWidth=.3;ctx.beginPath();ctx.moveTo(-1.8,hy-.7);ctx.lineTo(-.7,hy-.8);ctx.moveTo(.7,hy-.8);ctx.lineTo(1.8,hy-.7);ctx.stroke();
  ctx.strokeStyle='#8a3a3a';ctx.lineWidth=.3;ctx.beginPath();ctx.arc(0,hy+1.3,.7,.2,Math.PI-.2);ctx.stroke();ctx.fillStyle='rgba(255,120,120,.25)';ctx.beginPath();ctx.arc(-1.9,hy+1,.6,0,7);ctx.arc(1.9,hy+1,.6,0,7);ctx.fill();
  if(L.shades){ctx.fillStyle='#14141c';ctx.fillRect(-2.3,hy-.2,1.9,1);ctx.fillRect(.4,hy-.2,1.9,1);ctx.fillRect(-.4,hy,.8,.3);}}
 else if(side){ctx.fillStyle='#1a1018';ctx.beginPath();ctx.ellipse(1.6,hy+.2,.35,.5,0,0,7);ctx.fill();if(L.shades){ctx.fillStyle='#14141c';ctx.fillRect(.8,hy-.2,2.2,1);}}
 // hair front/top
 const H=L.hair,hg=lgr(0,hy-hr,0,hy+2,[sh(H,.3),H,sh(H,-.3)]);
 if(dir=='up'){blob(()=>ctx.ellipse(0,hy,hr*1.02,hr*1.12,0,0,7),hg);if(L.hs=='long')blob(()=>{ctx.moveTo(-hr-.4,hy);ctx.lineTo(-hr+.2,hy+7.5);ctx.lineTo(hr-.2,hy+7.5);ctx.lineTo(hr+.4,hy);},hg);if(L.hs=='pony')blob(()=>ctx.ellipse(0,hy+4,1,2.6,0,0,7),hg);}
 else if(L.hs=='buzz'){blob(()=>{ctx.ellipse(side?.3:0,hy-.9,hr*.95,hr*.75,0,Math.PI,0);},hg);}
 else{blob(()=>{if(side){ctx.moveTo(-hr-.2,hy+1.5);ctx.quadraticCurveTo(-hr-.6,hy-hr-1.2,hr*.4,hy-hr-.6);ctx.quadraticCurveTo(hr+1,hy-hr,hr+.3,hy-1);ctx.quadraticCurveTo(hr*.2,hy-1.6,-1,hy-.4);ctx.lineTo(-1.2,hy+1.6);}
   else{ctx.moveTo(-hr-.4,hy+(L.hs=='bob'||L.hs=='long'?3:.6));ctx.quadraticCurveTo(-hr-.6,hy-hr-1.4,0,hy-hr-1);ctx.quadraticCurveTo(hr+.6,hy-hr-1.4,hr+.4,hy+(L.hs=='bob'||L.hs=='long'?3:.6));ctx.quadraticCurveTo(hr*.4,hy-2.2,0,hy-1.6);ctx.quadraticCurveTo(-hr*.5,hy-2.2,-hr-.4,hy+.6);}},hg);
  if(L.hs=='mohawk')blob(()=>ctx.ellipse(side?0:0,hy-hr-.6,.9,2,0,0,7),sh(H,.15));
  if(L.hs=='bun')blob(()=>ctx.arc(side?-2:0,hy-hr-.6,1.6,0,7),hg);
  if(L.hs=='pony'&&side)blob(()=>ctx.ellipse(-hr-.8,hy+1.6,1,2.6,.3,0,7),hg);
  if(L.hs=='curly')for(const [cx2,cy2] of [[-2.4,-2.4],[0,-3.4],[2.4,-2.4],[-3.1,-.4],[3.1,-.4]])blob(()=>ctx.arc(cx2,hy+cy2,1.3,0,7),hg,false);}
 // hats
 if(L.hat=='straw'){blob(()=>ctx.ellipse(0,hy-2.2,6,1.6,0,0,7),lgr(0,hy-4,0,hy,['#f6dc8a','#d0a850']));blob(()=>ctx.ellipse(0,hy-3.3,3.3,2,0,Math.PI,0),lgr(0,hy-6,0,hy-2,['#fae6a0','#d8b060']));ctx.fillStyle='#b04a3a';ctx.fillRect(-3.2,hy-3.5,6.4,.8);}
 else if(L.hat=='sun'){blob(()=>ctx.ellipse(0,hy-2.4,5.6,1.5,0,0,7),lgr(0,hy-4,0,hy,[sh(L.hatC,.3),L.hatC]));blob(()=>ctx.ellipse(0,hy-3.2,3,1.9,0,Math.PI,0),sh(L.hatC,.15));ctx.fillStyle='#f0c0e0';ctx.beginPath();ctx.arc(2.2,hy-3.3,.8,0,7);ctx.fill();}
 else if(L.hat=='cap'){blob(()=>ctx.ellipse(0,hy-2,hr+.3,2.2,0,Math.PI,0),lgr(0,hy-4,0,hy-1,[sh(L.hatC,.25),L.hatC]));if(dir!='up')blob(()=>ctx.ellipse(side?2.6:0,hy-1.9,side?2.6:3,.9,0,0,7),sh(L.hatC,-.2));}
 ctx.restore();}
function bustCanvas(L,size){const c=document.createElement('canvas');c.width=size;c.height=size;const old=ctx;ctx=c.getContext('2d');ctx.imageSmoothingEnabled=true;
 const g=ctx.createLinearGradient(0,0,0,size);g.addColorStop(0,'#3a2460');g.addColorStop(1,'#120a20');ctx.fillStyle=g;ctx.fillRect(0,0,size,size);
 const k=size/15;ctx.setTransform(k,0,0,k,0,0);human(7.5,5.6+28.9*L.h/31,L,'down',0,false);ctx=old;return c;}
