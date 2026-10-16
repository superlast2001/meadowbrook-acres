// ===== VN conversation layer (v0.0.0.36) =====
const VNDEF={
 ares:{img:'ares',h:'min(62vh,calc(100vh - 120px))',aspect:640/793,head:[.62,.15],tint:'#ff4a6a',
  zones:[['hand',.08,.12,.30,.30],['hand',.78,.34,.97,.48],['head',.48,.02,.76,.27],['arm',0,.13,.24,.55],['arm',.70,.20,1,.58],['torso',.22,.20,.72,.66]],
  blush:[[.585,.20],[.71,.175]],
  react:{
   arm:{m:'smug',a:'flex',l:[["Go on, admire the merch. Free of charge... this once.","Careful, boss. These guns are registered."],["Again? You're keeping count, aren't you.","Flex for the crowd, flex for you. Mostly for you."],["Yeah, yeah, I'll carry you home if the club runs late. Show-off privileges."]]},
   head:{m:'happy',a:'bounce',l:[["Hey! Hands off the hair, it took me nine seconds.","Pat me again and I start charging cover."],["Heh. Okay, that one I didn't hate.","You're lucky I like you."],["Keep that up and I'll actually smile on shift."]]},
   torso:{m:'surprised',a:'hop',l:[["Whoa, ticklish! Not a word to the regulars.","Personal space, boss. It's a bouncer thing."],["You poke like a rookie. Cute."],["Fine. You found my weak spot. It's you."]]},
   hand:{m:'blush',a:'bounce',l:[["High five? ...Okay. Nice.","Grip's not bad. Ever thought about door duty?"],["You want to hold the sword? Get in line."],["Hand's yours whenever you need it. Don't make it weird."]]}}},
 rzel:{img:'rzel',px:1,h:'min(70vh,calc(100vh - 110px))',aspect:48/96,head:[.47,.09],tint:'#38e8ff',
  zones:[['hand',0,.5,.16,.66],['hand',.78,.56,1,.7],['head',.22,0,.75,.22],['arm',0,.22,.28,.5],['arm',.68,.22,1,.55],['torso',.25,.2,.7,.7]],
  blush:[[.36,.13],[.6,.13]],
  react:{
   arm:{m:'blush',a:'flex',l:[["Th-that's the chrome arm! It's sensitive to... compliments.","Hey! Careful, it's still under warranty."],["You like the arm? I tuned the servos myself."],["Okay, okay, I'll flex. Just for you. Don't tell the crowd."]]},
   head:{m:'smile',a:'bounce',l:[["Ha! Don't scuff the mask, it's vintage.","Did you just pat my helmet? Bold."],["Heh... that's kinda nice, actually."],["Keep doing that and I'll play your favourite song all night."]]},
   torso:{m:'smile',a:'hop',l:[["Pfft, haha! Stop, I'm ticklish!","Hey! No poking the DJ mid-set!"],["You're such a dork. I love it."],["Ha... you always find a way to make me laugh."]]},
   hand:{m:'blush',a:'bounce',l:[["Oh! A handshake? Sure, partner.","Your hand's warm... wait, mine's the cold one."],["Wanna hold hands? ...I mean, for balance."],["Don't let go yet. Just one more song."]]}}}
};
const VN={id:null,pages:[],pi:0,choices:false,typing:0,full:'',mood:'normal'};
function vnPages(t){const s=String(t).match(/[^.!?]+[.!?]+["']?\s*|[^.!?]+$/g)||[t];const out=[];let cur='';
 for(const x of s){if(cur&&(cur+x).length>150){out.push(cur.trim());cur=x;}else cur+=x;}if(cur.trim())out.push(cur.trim());return out;}
function vnTier(id){const h=heartsOf(id);return h>=6?2:h>=3?1:0;}
function vnMood(m){return {happy:'happy',smile:'happy',blush:'blush',mad:'mad',serious:'serious',surprised:'surprised',smug:'smug'}[m]||'normal';}
function vnEnsure(){const d=$('dlg');if(d.dataset.vn)return d;d.dataset.vn=1;d.className='vn';
 d.innerHTML='<div class="vbg"></div><div class="vpw"><div class="vpi"><img class="vp" alt=""><div class="vfx"></div></div></div><div class="vbox"><div class="vname"><b></b><span class="hs"></span></div><div class="tx"></div><div class="ch"></div><div class="vnext">\u25BC</div></div>';
 d.querySelector('.vpi').addEventListener('click',vnTapPortrait);
 d.querySelector('.vbox').addEventListener('click',e=>{if(e.target.closest('button'))return;vnAdvance();});
 d.querySelector('.vbg').addEventListener('click',()=>vnAdvance());
 new ResizeObserver(vnLayout).observe(d.querySelector('.vbox'));addEventListener('resize',vnLayout);
 return d;}
function vnLayout(){const d=$('dlg');if(!d||!d.classList.contains('show'))return;const bh=d.querySelector('.vbox').offsetHeight,pw=d.querySelector('.vpw');if(pw.classList.contains('bust'))return;const ph=pw.offsetHeight;pw.style.bottom=Math.max(0,Math.min(bh-ph*0.22,innerHeight-ph-8))+'px';}
function dialog(id,t,mood,choices){dlgOpen=true;const d=vnEnsure();const def=VNDEF[id];const same=VN.id==id&&d.classList.contains('show');
 VN.id=id;VN.pages=vnPages(t);VN.pi=0;VN.choices=!!choices;VN.mood=vnMood(mood);d.dataset.id=id;
 const pw=d.querySelector('.vpw'),img=d.querySelector('.vp');
 if(def){img.src=VNART[def.img];pw.style.setProperty('--asp',def.aspect);pw.classList.remove('bust');pw.style.height=def.h||'';img.style.imageRendering=def.px?'pixelated':'auto';}
 else{img.src=bustCanvas(LOOKS[id],512).toDataURL();pw.style.setProperty('--asp',1);pw.classList.add('bust');pw.style.height='';}
 d.querySelector('.vname b').textContent=NPCDEF[id].name;
 d.querySelector('.hs').innerHTML='\u2665'.repeat(heartsOf(id))+'<i>'+'\u2665'.repeat(Math.max(0,heartCap(id)-heartsOf(id)))+'</i>';
 d.querySelector('.vname').style.setProperty('--tint',def?def.tint:'#ff5ab4');
 vnExpr(VN.mood);d.classList.add('show');requestAnimationFrame(vnLayout);
 if(!same){pw.classList.remove('in');void pw.offsetWidth;pw.classList.add('in');}
 vnShowPage();}
function vnChoicesHTML(){const id=VN.id;return VN.choices?'<button data-g="talk">Talk</button><button data-g="gift">Gift</button>'+(id=='rzel'&&!isNight()?'<button data-g="shop">Shop</button>':'')+(G.staff.find(s=>s.npc==id)?'':'<button data-g="hire">Hire?</button>')+'<button data-g="bye">Bye</button>':'<button data-g="bye">Close</button>';}
function vnShowPage(){const d=$('dlg'),tx=d.querySelector('.tx'),ch=d.querySelector('.ch');clearInterval(VN.typing);
 VN.full=VN.pages[VN.pi]||'';tx.textContent='';ch.innerHTML='';d.classList.remove('done','last');let n=0;
 VN.typing=setInterval(()=>{n+=2;tx.textContent=VN.full.slice(0,n);if(n>=VN.full.length)vnFinish();},16);}
function vnFinish(){const d=$('dlg');clearInterval(VN.typing);VN.typing=0;d.querySelector('.tx').textContent=VN.full;d.classList.add('done');
 if(VN.pi>=VN.pages.length-1){d.classList.add('last');const ch=d.querySelector('.ch');if(!ch.innerHTML)ch.innerHTML=vnChoicesHTML();}}
function vnAdvance(){if(VN.typing){vnFinish();return;}if(VN.pi<VN.pages.length-1){VN.pi++;vnShowPage();}}
function vnExpr(m){const d=$('dlg'),pi=d.querySelector('.vpi');pi.dataset.ex=m;const fx=d.querySelector('.vfx');const def=VNDEF[VN.id];
 fx.querySelectorAll('.ex').forEach(e=>e.remove());if(!def)return;
 const add=(cls,x,y,txt)=>{const e=document.createElement('div');e.className='ex '+cls;e.style.left=(x*100)+'%';e.style.top=(y*100)+'%';if(txt)e.textContent=txt;fx.appendChild(e);};
 if(m=='blush')def.blush.forEach(p=>add('bl',p[0],p[1]));
 if(m=='mad')add('ang',def.head[0]+.12,def.head[1]-.08,'\u2716');
 if(m=='happy'){add('spk',def.head[0]-.16,def.head[1]-.06,'\u2726');add('spk',def.head[0]+.16,def.head[1]+.02,'\u2727');}
 if(m=='surprised')add('sur',def.head[0]+.14,def.head[1]-.09,'!');
 if(m=='smug')add('spk',def.head[0]+.15,def.head[1]-.05,'\u266A');}
let vnRT=0;
function vnTapPortrait(e){e.stopPropagation();const def=VNDEF[VN.id];if(!def){vnAdvance();return;}
 const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 const z=def.zones.find(q=>x>=q[1]&&x<=q[3]&&y>=q[2]&&y<=q[4]);if(!z){vnAdvance();return;}vnReact(z[0],x,y);}
function vnReact(zone,x,y){const def=VNDEF[VN.id],R=def.react[zone],tier=vnTier(VN.id);const pool=R.l.slice(0,tier+1).flat();
 const line=pool[Math.floor(Math.random()*pool.length)],d=$('dlg'),pi=d.querySelector('.vpi'),fx=d.querySelector('.vfx');
 vnExpr(R.m);pi.classList.remove('a-flex','a-bounce','a-hop');void pi.offsetWidth;pi.classList.add('a-'+R.a);
 fx.querySelectorAll('.bub,.pt').forEach(q=>q.remove());
 const b=document.createElement('div');b.className='bub';b.textContent=line;const hx=def.head[0];b.style.left=Math.min(70,Math.max(30,hx*100))+'%';b.style.top=Math.max(2,(def.head[1]-.12)*100)+'%';fx.appendChild(b);
 for(let i=0;i<7;i++){const p=document.createElement('div');p.className='pt';p.textContent=i%2?'\u2665':'\u2726';p.style.left=(x*100)+'%';p.style.top=(y*100)+'%';p.style.setProperty('--dx',(Math.cos(i*0.9)*60)+'px');p.style.setProperty('--dy',(-30-Math.random()*50)+'px');p.style.animationDelay=(i*40)+'ms';fx.appendChild(p);}
 if(window.addRel&&!VN.tapDay)VN.tapDay=1;
 clearTimeout(vnRT);vnRT=setTimeout(()=>{fx.querySelectorAll('.bub,.pt').forEach(q=>q.remove());pi.classList.remove('a-flex','a-bounce','a-hop');vnExpr(VN.mood);},1600);}
function vnClose(){clearInterval(VN.typing);VN.typing=0;VN.id=null;}
(function(){const s=document.createElement('style');s.textContent=`
#dlg.vn{display:none;position:fixed;inset:0;left:0;top:0;bottom:0;transform:none;width:auto;max-width:none;background:none;border:0;box-shadow:none;border-radius:0;padding:0;z-index:40;font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#f4ecff;overflow:hidden;-webkit-tap-highlight-color:transparent}
#dlg.vn.show{display:block}
#dlg .vbg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(70,30,110,.35),rgba(6,4,18,.82) 75%);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);animation:vnfade .3s ease}
#dlg .vpw{position:absolute;left:50%;bottom:0;transition:bottom .25s ease;height:min(86vh,calc(100vh - 40px));transform:translateX(-50%);pointer-events:none;display:flex;justify-content:center;align-items:flex-end}
#dlg .vpw.bust{height:min(55vh,560px);bottom:28vh}
#dlg .vpi{position:relative;height:100%;aspect-ratio:var(--asp);max-width:118vw;pointer-events:auto;transform-origin:50% 100%;filter:drop-shadow(0 0 18px rgba(120,80,255,.45)) drop-shadow(0 0 3px rgba(255,255,255,.25))}
#dlg .vp{width:100%;height:100%;object-fit:contain;display:block;margin:0;border:0;box-shadow:none;background:none;border-radius:0;-webkit-user-drag:none;user-select:none}
#dlg .vpw.in .vpi{animation:vnslide .45s cubic-bezier(.2,.9,.25,1.15)}
#dlg .vpi[data-ex=mad] .vp{filter:saturate(1.25) hue-rotate(-8deg) brightness(.97)}
#dlg .vpi[data-ex=happy] .vp{filter:brightness(1.07) saturate(1.1)}
#dlg .vpi[data-ex=blush] .vp{filter:brightness(1.04) saturate(1.12)}
#dlg .vfx{position:absolute;inset:0;pointer-events:none}
#dlg .ex{position:absolute;transform:translate(-50%,-50%)}
#dlg .ex.bl{width:9%;aspect-ratio:2/1;border-radius:50%;background:radial-gradient(ellipse,rgba(255,90,140,.75),rgba(255,90,140,0) 70%)}
#dlg .ex.ang{color:#ff3050;font:900 clamp(22px,6vw,34px) sans-serif;text-shadow:0 0 8px #ff3050;animation:vnpulse .6s infinite alternate}
#dlg .ex.spk{color:#fff6b0;font-size:clamp(18px,5vw,28px);text-shadow:0 0 10px #ffd84a;animation:vnpulse .8s infinite alternate}
#dlg .ex.sur{color:#fff;font:900 clamp(26px,7vw,40px) sans-serif;text-shadow:0 0 10px #38e8ff}
#dlg .bub{position:absolute;transform:translate(-50%,-100%);width:max-content;max-width:min(64vw,300px);background:linear-gradient(#fff,#f0e8ff);color:#2a1840;border-radius:16px;padding:8px 12px;font:600 14px/1.35 system-ui,sans-serif;box-shadow:0 0 0 2px #ff5ab4,0 6px 20px rgba(0,0,0,.45);animation:vnpop .25s cubic-bezier(.2,.9,.3,1.4)}
#dlg .bub:after{content:"";position:absolute;left:50%;bottom:-8px;border:8px solid transparent;border-top-color:#f0e8ff;border-bottom:0;transform:translateX(-50%)}
#dlg .pt{position:absolute;color:#ff6ab8;font-size:18px;text-shadow:0 0 8px #ff6ab8;animation:vnpt 1.2s ease-out forwards}
#dlg .pt:nth-child(odd){color:#fff2a0;text-shadow:0 0 8px #ffd84a}
#dlg .a-flex{animation:vnflex .9s ease}#dlg .a-bounce{animation:vnbounce .6s ease}#dlg .a-hop{animation:vnhop .5s ease}
#dlg .vbox{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom));width:min(620px,calc(100vw - 16px));box-sizing:border-box;padding:24px 16px 14px;border-radius:18px;background:linear-gradient(180deg,rgba(40,20,70,.72),rgba(14,8,34,.86));border:1px solid rgba(255,255,255,.22);box-shadow:0 0 0 1px rgba(56,232,255,.35),0 0 24px rgba(160,80,255,.35),inset 0 1px 0 rgba(255,255,255,.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:vnbox .3s ease;margin:0}
#dlg .vname{position:absolute;top:-17px;left:14px;display:inline-flex;align-items:center;gap:8px;padding:5px 16px;border-radius:10px 18px 10px 18px;background:linear-gradient(90deg,var(--tint),#a040ff);box-shadow:0 0 14px var(--tint);transform:skewX(-8deg);z-index:2}
#dlg .vname b{font:800 17px system-ui,sans-serif;color:#fff;letter-spacing:.5px;text-shadow:0 1px 2px rgba(0,0,0,.5)}
#dlg .hs{color:#ffd0ea;font-size:12px;letter-spacing:1px}#dlg .hs i{color:rgba(255,255,255,.3);font-style:normal}
#dlg .tx{margin:4px 2px 8px;min-height:2.9em;max-height:30vh;overflow-y:auto;white-space:normal;overflow-wrap:anywhere;font-size:15.5px;text-shadow:0 1px 2px rgba(0,0,0,.6)}
#dlg .ch{display:flex;flex-direction:column;gap:7px;max-height:34vh;overflow-y:auto}
#dlg .ch button{font:700 15px system-ui,sans-serif;color:#fff;text-align:center;background:linear-gradient(90deg,rgba(255,90,180,.18),rgba(120,80,255,.35),rgba(56,232,255,.18));border:1px solid rgba(255,255,255,.35);border-radius:12px;padding:10px 14px;min-height:42px;box-shadow:0 0 10px rgba(160,80,255,.3),inset 0 1px 0 rgba(255,255,255,.2);animation:vnbtn .3s ease backwards}
#dlg .ch button:nth-child(2){animation-delay:.05s}#dlg .ch button:nth-child(3){animation-delay:.1s}#dlg .ch button:nth-child(4){animation-delay:.15s}#dlg .ch button:nth-child(5){animation-delay:.2s}
#dlg .ch button:active{background:linear-gradient(90deg,#ff5ab4,#a040ff);transform:scale(.98)}
#dlg .vnext{position:absolute;right:14px;bottom:8px;color:#38e8ff;font-size:12px;display:none;animation:vnpulse .6s infinite alternate}
#dlg.done:not(.last) .vnext{display:block}
@keyframes vnfade{from{opacity:0}}@keyframes vnbox{from{opacity:0;transform:translate(-50%,20px)}}
@keyframes vnslide{from{opacity:0;transform:translateX(26%) scale(.97)}to{opacity:1;transform:none}}
@keyframes vnflex{0%{transform:none}25%{transform:scale(1.05,1.03) rotate(-1.5deg)}50%{transform:scale(1.03) rotate(1deg)}100%{transform:none}}
@keyframes vnbounce{0%,100%{transform:none}35%{transform:translateY(-3%)}65%{transform:translateY(.5%)}}
@keyframes vnhop{0%,100%{transform:none}30%{transform:translateY(-1.5%) rotate(1.5deg)}60%{transform:rotate(-1deg)}}
@keyframes vnpop{from{opacity:0;transform:translate(-50%,-80%) scale(.6)}}
@keyframes vnpt{from{opacity:1;transform:translate(-50%,-50%) scale(.6)}to{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.3)}}
@keyframes vnpulse{to{opacity:.55}}@keyframes vnbtn{from{opacity:0;transform:translateX(-14px)}}
`;document.head.appendChild(s);})();
