// ===== VN conversation layer (v0.0.0.38: reference talk layout, Skip/Hide/Next, touch reactions) =====
const MALE_L={
 ares:{head:[["Hey, watch the hair. Took me nine whole seconds.","Pat me again and I start charging cover."],["Heh. Okay, that one I didn't hate."],["Keep that up and I'll actually smile on shift."]],
  shoulder:[["Tense? Me? I'm a rock, boss.","Shoulder's fine. It carries this whole club."],["Little lower... kidding. You're alright."],["You always know when I need a break."]],
  arm:[["Go on, admire the merch. Free of charge... this once.","Careful, boss. These guns are registered."],["Again? You're keeping count, aren't you."],["Fine, one flex. Just for you."]],
  chest:[["Solid, right? Door-proof.","Knock knock. Nobody's getting past this."],["You poke like a rookie. Cute."],["Heart's right there. Guess who's in it."]],
  back:[["A pat on the back? I'll take it.","Yeah, yeah, I did good tonight."],["Team spirit, huh? Fine."],["Thanks, partner. Means a lot."]]},
 rzel:{head:[["Ha! Don't scuff the mask, it's vintage.","Did you just pat my helmet? Bold."],["Heh... that's kinda nice, actually."],["Keep doing that and I'll play your song all night."]],
  shoulder:[["Shoulder rub? I've been hunched over decks all day.","Ooh, right on the knot."],["You're a natural. Hired. Again."],["Stay a sec. The beat can wait."]],
  arm:[["The chrome arm! Tuned the servos myself. Feel that torque.","Careful, it's still under warranty!"],["You like the arm? I'll flex. Don't tell the crowd."],["Strong enough to carry you home. Just saying."]],
  chest:[["Pfft, haha! Ticklish! Stop!","Hey, no poking the DJ mid-set!"],["You're such a dork. I love it."],["Ha... you always make me laugh."]],
  back:[["Back pat? Thanks, partner!","Yeah! Good set, right?"],["Teamwork makes the dream work."],["You've got my back. I've got yours."]]}};
const VNDEF={
 ares:{img:'ares',male:1,px:1,h:'min(72vh,calc(100vh - 110px))',aspect:284/486,head:[.58,.07],
  zones:[['head',.42,0,.78,.17],['shoulder',.2,.15,.42,.24],['shoulder',.62,.17,.86,.26],['arm',0,.06,.2,.36],['arm',.8,.25,1,.55],['chest',.35,.2,.72,.36],['back',.22,.3,.34,.42],['back',.72,.3,.84,.42]],
  blush:[[.5,.08],[.66,.07]],react:{head:['happy','bounce'],shoulder:['smug','hop'],arm:['smug','flex'],chest:['happy','flex'],back:['happy','bounce']}},
 rzel:{img:'rzel',male:1,px:1,h:'min(70vh,calc(100vh - 110px))',aspect:48/96,head:[.47,.09],
  zones:[['head',.22,0,.75,.2],['shoulder',.12,.2,.35,.29],['shoulder',.6,.2,.88,.3],['arm',0,.29,.2,.62],['arm',.78,.3,1,.66],['chest',.3,.22,.68,.38],['back',.2,.38,.3,.48],['back',.68,.38,.78,.48]],
  blush:[[.36,.13],[.6,.13]],react:{head:['happy','bounce'],shoulder:['blush','hop'],arm:['smug','flex'],chest:['happy','hop'],back:['happy','bounce']}},
 mabel:{bust:1,fem:1,head:[.5,.3],zones:[['head',.15,0,.85,.62],['shoulder',0,.62,.35,.8],['shoulder',.65,.62,1,.8],['arm',0,.8,.22,1],['arm',.78,.8,1,1]],blush:[[.36,.445],[.64,.445]],
  ang:["Hands to yourself, young one!","I beg your pardon! Manners!","Do that again and you'll be washing every glass in the bar.","Goodness! I'm not a coat rack, dear."]},
 pip:{bust:1,kid:1,head:[.5,.3],zones:[['head',.15,0,.85,.62],['shoulder',0,.62,.35,.8],['shoulder',.65,.62,1,.8],['arm',0,.8,.22,1],['arm',.78,.8,1,1]],blush:[[.36,.445],[.64,.445]],
  ang:["Hey!","Hey! I'm busy sweeping!","Hey! No poking!"]}};
const VN={id:null,pages:[],pi:0,choices:false,typing:0,full:'',mood:'normal'};
function vnPages(t){const s=String(t).match(/[^.!?]+[.!?]+["']?\s*|[^.!?]+$/g)||[t];const out=[];let cur='';
 for(const x of s){if(cur&&(cur+x).length>140){out.push(cur.trim());cur=x;}else cur+=x;}if(cur.trim())out.push(cur.trim());return out;}
function vnTier(id){const h=heartsOf(id);return h>=6?2:h>=3?1:0;}
function vnMood(m){return {happy:'happy',smile:'happy',blush:'blush',mad:'mad',serious:'serious',surprised:'surprised',smug:'smug'}[m]||'normal';}
function vnEnsure(){const d=$('dlg');if(d.dataset.vn)return d;d.dataset.vn=1;d.className='vn';
 d.innerHTML='<div class="vbg"></div><div class="vpw"><div class="vpi"><img class="vp" alt=""><div class="vfx"></div></div></div><div class="vbox"><div class="vname"><b></b><span class="hs"></span></div><div class="tx"></div><div class="ch"></div><div class="vctl"><button type="button" data-v="skip">Skip&gt;&gt;</button><button type="button" data-v="hide">Hide</button><button type="button" data-v="next">Next &gt;</button></div></div><button type="button" class="vshow" data-v="show">Show text \u25B2</button><div class="vhint">Tap head, shoulder, arm, chest or back</div>';
 d.querySelector('.vpi').addEventListener('click',vnTapPortrait);
 d.querySelector('.vbox').addEventListener('click',e=>{if(e.target.closest('.ch button'))return;const v=e.target.closest('[data-v]');if(v){e.stopPropagation();vnCtl(v.dataset.v);return;}vnAdvance();});
 d.querySelector('.vshow').addEventListener('click',e=>{e.stopPropagation();vnCtl('show');});
 d.querySelector('.vbg').addEventListener('click',()=>{if(d.classList.contains('hid'))vnCtl('show');else vnAdvance();});
 new ResizeObserver(vnLayout).observe(d.querySelector('.vbox'));addEventListener('resize',vnLayout);
 return d;}
function vnCtl(v){const d=$('dlg');if(v=='hide'){d.classList.add('hid');vnLayout();}else if(v=='show'){d.classList.remove('hid');vnLayout();}
 else if(v=='skip'){VN.pi=VN.pages.length-1;vnShowPage();vnFinish();}
 else if(v=='next'){if(VN.typing)vnFinish();else if(VN.pi<VN.pages.length-1){VN.pi++;vnShowPage();}else if(!VN.choices)closeDlg();}}
function vnLayout(){const d=$('dlg');if(!d||!d.classList.contains('show'))return;const pw=d.querySelector('.vpw');if(pw.classList.contains('bust')){pw.style.bottom=d.classList.contains('hid')?'12vh':'';return;}
 const bh=d.classList.contains('hid')?0:d.querySelector('.vbox').offsetHeight,ph=pw.offsetHeight;pw.style.bottom=Math.max(0,Math.min(bh-ph*0.22,innerHeight-ph-8))+'px';}
function dialog(id,t,mood,choices){dlgOpen=true;const d=vnEnsure();const def=VNDEF[id]||{bust:1,head:[.5,.3],zones:[]};const same=VN.id==id&&d.classList.contains('show');
 VN.id=id;VN.pages=vnPages(t);VN.pi=0;VN.choices=!!choices;VN.mood=vnMood(mood);d.dataset.id=id;d.classList.remove('hid');
 const pw=d.querySelector('.vpw'),img=d.querySelector('.vp');
 if(!def.bust){img.src=VNART[def.img];pw.style.setProperty('--asp',def.aspect);pw.classList.remove('bust');pw.style.height=def.h||'';img.style.imageRendering=def.px?'pixelated':'auto';}
 else{img.src=bustCanvas(LOOKS[id],512).toDataURL();pw.style.setProperty('--asp',1);pw.classList.add('bust');pw.style.height='';img.style.imageRendering='auto';}
 d.querySelector('.vname b').textContent=NPCDEF[id].name;vnHearts();
 vnExpr(VN.mood);d.classList.add('show');requestAnimationFrame(vnLayout);
 if(!same){pw.classList.remove('in');void pw.offsetWidth;pw.classList.add('in');}
 vnShowPage();}
function vnHearts(){const id=VN.id,d=$('dlg');d.querySelector('.hs').innerHTML='\u2665'.repeat(heartsOf(id))+'<i>'+'\u2665'.repeat(Math.max(0,heartCap(id)-heartsOf(id)))+'</i><u style="--p:'+((relOf(id).pts%100))+'%"></u>';}
function vnChoicesHTML(){const id=VN.id;return VN.choices?'<button data-g="talk">Talk</button><button data-g="gift">Gift</button>'+(id=='rzel'&&!isNight()?'<button data-g="shop">Shop</button>':'')+(G.staff.find(s=>s.npc==id)?'':'<button data-g="hire">Hire?</button>')+'<button data-g="bye">Bye</button>':'';}
function vnShowPage(){const d=$('dlg'),tx=d.querySelector('.tx'),ch=d.querySelector('.ch');clearInterval(VN.typing);
 VN.full=VN.pages[VN.pi]||'';tx.textContent='';ch.innerHTML='';d.classList.remove('done','last');let n=0;
 VN.typing=setInterval(()=>{n+=2;tx.textContent=VN.full.slice(0,n);if(n>=VN.full.length)vnFinish();},16);}
function vnFinish(){const d=$('dlg');clearInterval(VN.typing);VN.typing=0;d.querySelector('.tx').textContent=VN.full;d.classList.add('done');
 if(VN.pi>=VN.pages.length-1){d.classList.add('last');const ch=d.querySelector('.ch');if(!ch.innerHTML)ch.innerHTML=vnChoicesHTML();}}
function vnAdvance(){if(VN.typing){vnFinish();return;}if(VN.pi<VN.pages.length-1){VN.pi++;vnShowPage();}}
function vnExpr(m){const d=$('dlg'),pi=d.querySelector('.vpi');pi.dataset.ex=m;const fx=d.querySelector('.vfx');const def=VNDEF[VN.id];
 fx.querySelectorAll('.ex').forEach(e=>e.remove());if(!def)return;
 const add=(cls,x,y,txt)=>{const e=document.createElement('div');e.className='ex '+cls;e.style.left=(x*100)+'%';e.style.top=(y*100)+'%';if(txt)e.textContent=txt;fx.appendChild(e);};
 if(m=='blush'&&def.bust)def.blush.forEach(p=>add('bl',p[0],p[1]));
 if(m=='mad'){add('ang',def.head[0]+.2,def.head[1]-.02,'\u2716');if(def.bust){add('ang2',def.head[0],def.head[1]);const sk=(LOOKS[VN.id]||{}).skin||'#f2c8a0';const mp=document.createElement('div');mp.className='ex mpatch';mp.style.left='50%';mp.style.top='47.5%';mp.style.background=sk;fx.appendChild(mp);add('frown',.5,.485);add('brow l',.41,.34);add('brow r',.59,.34);}}
 if(m=='happy'){add('spk',def.head[0]-.16,def.head[1]-.06,'\u2726');add('spk',def.head[0]+.16,def.head[1]+.02,'\u2727');}
 if(m=='surprised')add('sur',def.head[0]+.14,def.head[1]-.09,'!');
 if(m=='smug')add('spk',def.head[0]+.15,def.head[1]-.05,'\u266A');}
let vnRT=0;
function vnTapPortrait(e){e.stopPropagation();const def=VNDEF[VN.id];if(!def){vnAdvance();return;}
 const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 const z=def.zones.find(q=>x>=q[1]&&x<=q[3]&&y>=q[2]&&y<=q[4]);if(!z){if(!$('dlg').classList.contains('hid'))vnAdvance();return;}vnReact(z[0],x,y);}
const TAP_GAIN=4,TAP_CAP=20,TAP_LOSS=10;
function vnReact(zone,x,y){const id=VN.id,def=VNDEF[id],R=relOf(id),d=$('dlg'),pi=d.querySelector('.vpi'),fx=d.querySelector('.vfx');let line,m,a,delta=0;
 if(def.male){const L=MALE_L[id][zone],pool=L.slice(0,vnTier(id)+1).flat();line=pool[Math.floor(Math.random()*pool.length)];[m,a]=def.react[zone];
  if(R.tapDay!=G.day){R.tapDay=G.day;R.tapPts=0;}const g=Math.min(TAP_GAIN,TAP_CAP-(R.tapPts||0));if(g>0){R.tapPts=(R.tapPts||0)+g;addRel(id,g);delta=g;}}
 else if(def.kid){line=def.ang[Math.floor(Math.random()*def.ang.length)];m='mad';a='hop';}
 else{line=def.ang[Math.floor(Math.random()*def.ang.length)];m='mad';a='shake';const before=R.pts;addRel(id,-TAP_LOSS);delta=R.pts-before;}
 vnExpr(m);pi.classList.remove('a-flex','a-bounce','a-hop','a-shake');void pi.offsetWidth;pi.classList.add('a-'+a);
 fx.querySelectorAll('.bub,.pt,.dl').forEach(q=>q.remove());
 const b=document.createElement('div');b.className='bub'+(m=='mad'?' mad':'');b.textContent=line;b.style.left=Math.min(70,Math.max(30,def.head[0]*100))+'%';b.style.top=Math.max(2,(def.head[1]-.12)*100)+'%';fx.appendChild(b);
 const sym=m=='mad'?['\u2716','\u2716']:['\u2665','\u2726'];
 for(let i=0;i<7;i++){const p=document.createElement('div');p.className='pt'+(m=='mad'?' bad':'');p.textContent=sym[i%2];p.style.left=(x*100)+'%';p.style.top=(y*100)+'%';p.style.setProperty('--dx',(Math.cos(i*0.9)*60)+'px');p.style.setProperty('--dy',(-30-Math.random()*50)+'px');p.style.animationDelay=(i*40)+'ms';fx.appendChild(p);}
 const dl=document.createElement('div');dl.className='dl '+(delta>0?'up':delta<0?'down':'none');dl.textContent=delta>0?'+\u2665 affection':delta<0?'\u2212\u2665 affection':(def.male?'(daily max)':'');dl.style.left=Math.min(80,Math.max(20,x*100))+'%';dl.style.top=(y*100)+'%';if(dl.textContent)fx.appendChild(dl);
 vnHearts();clearTimeout(vnRT);vnRT=setTimeout(()=>{fx.querySelectorAll('.bub,.pt,.dl').forEach(q=>q.remove());pi.classList.remove('a-flex','a-bounce','a-hop','a-shake');vnExpr(VN.mood);},1600);}
function vnClose(){clearInterval(VN.typing);VN.typing=0;VN.id=null;const d=$('dlg');if(d)d.classList.remove('hid');}
(function(){const s=document.createElement('style');s.textContent=`
#dlg.vn{display:none;position:fixed;inset:0;left:0;top:0;bottom:0;transform:none;width:auto;max-width:none;background:none;border:0;box-shadow:none;border-radius:0;padding:0;z-index:40;font:15px/1.4 "Trebuchet MS",Verdana,sans-serif;color:#222;overflow:hidden;-webkit-tap-highlight-color:transparent}
#dlg.vn.show{display:block}
#dlg .vbg{position:absolute;inset:0;background:rgba(10,8,20,.5);animation:vnfade .3s ease}
#dlg .vpw{position:absolute;left:50%;bottom:0;transition:bottom .25s ease;height:min(86vh,calc(100vh - 40px));transform:translateX(-50%);pointer-events:none;display:flex;justify-content:center;align-items:flex-end}
#dlg .vpw.bust{height:min(55vh,520px);bottom:26vh}
#dlg .vpi{position:relative;height:100%;aspect-ratio:var(--asp);max-width:118vw;pointer-events:auto;transform-origin:50% 100%;filter:drop-shadow(0 6px 14px rgba(0,0,0,.5))}
#dlg .vp{width:100%;height:100%;object-fit:contain;display:block;margin:0;border:0;box-shadow:none;background:none;border-radius:0;-webkit-user-drag:none;user-select:none}
#dlg .vpw.in .vpi{animation:vnslide .45s cubic-bezier(.2,.9,.25,1.15)}
#dlg .vfx{position:absolute;inset:0;pointer-events:none}
#dlg .ex{position:absolute;transform:translate(-50%,-50%)}
#dlg .ex.bl{width:9%;aspect-ratio:2/1;border-radius:50%;background:radial-gradient(ellipse,rgba(255,90,140,.75),rgba(255,90,140,0) 70%)}
#dlg .ex.ang{color:#ff2a40;font:900 clamp(26px,7vw,40px) sans-serif;text-shadow:0 0 6px #fff,0 0 10px #ff3050;animation:vnpulse .4s infinite alternate}
#dlg .ex.ang2{width:46%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(255,40,40,.28),rgba(255,40,40,0) 70%)}
#dlg .ex.spk{color:#fff6b0;font-size:clamp(18px,5vw,28px);text-shadow:0 0 10px #ffd84a;animation:vnpulse .8s infinite alternate}
#dlg .ex.mpatch{width:13%;height:5%;border-radius:40%}#dlg .ex.frown{width:9%;height:3%;border:3px solid #8a2a3a;border-bottom:0;border-radius:50% 50% 0 0}#dlg .ex.brow{width:10%;height:1.6%;background:#3a2a2a;border-radius:3px}#dlg .ex.brow.l{transform:translate(-50%,-50%) rotate(18deg)}#dlg .ex.brow.r{transform:translate(-50%,-50%) rotate(-18deg)}
#dlg .ex.sur{color:#fff;font:900 clamp(26px,7vw,40px) sans-serif;text-shadow:0 0 10px #38e8ff}
#dlg .bub{position:absolute;transform:translate(-50%,-100%);width:max-content;max-width:min(64vw,300px);background:#fff;color:#222;border-radius:16px;padding:8px 12px;font:700 14px/1.35 "Trebuchet MS",sans-serif;border:2px solid #333;box-shadow:0 6px 16px rgba(0,0,0,.4);animation:vnpop .25s cubic-bezier(.2,.9,.3,1.4)}
#dlg .bub.mad{border-color:#e0203a;color:#a0101a}
#dlg .bub:after{content:"";position:absolute;left:50%;bottom:-9px;border:8px solid transparent;border-top-color:#fff;border-bottom:0;transform:translateX(-50%)}
#dlg .pt{position:absolute;color:#ff4f8a;font-size:18px;text-shadow:0 0 6px #fff;animation:vnpt 1.2s ease-out forwards}
#dlg .pt:nth-child(odd){color:#ffd84a}#dlg .pt.bad{color:#ff2a40!important}
#dlg .dl{position:absolute;transform:translate(-50%,-50%);font:900 15px "Trebuchet MS",sans-serif;padding:3px 9px;border-radius:10px;white-space:nowrap;animation:vndl 1.5s ease-out forwards}
#dlg .dl.up{background:#ff4f8a;color:#fff}#dlg .dl.down{background:#2a2a36;color:#ff6a7a;border:2px solid #ff2a40}#dlg .dl.none{background:#555;color:#ddd;font-size:12px}
#dlg .a-flex{animation:vnflex .9s ease}#dlg .a-bounce{animation:vnbounce .6s ease}#dlg .a-hop{animation:vnhop .5s ease}#dlg .a-shake{animation:vnshake .5s ease}
#dlg .vbox{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom));width:min(560px,calc(100vw - 20px));box-sizing:border-box;padding:16px 16px 6px;border-radius:18px;background:#fff;border:3px solid #3a3a44;box-shadow:0 0 0 4px rgba(255,255,255,.55),0 8px 24px rgba(0,0,0,.45);animation:vnbox .3s ease;margin:0}
#dlg .vbox:after{content:"";position:absolute;right:-3px;bottom:-3px;width:26px;height:26px;background:linear-gradient(135deg,transparent 50%,#3aa83a 50%);border-radius:0 0 16px 0}
#dlg.hid .vbox,#dlg.hid .ch{display:none}
#dlg .vshow{display:none;position:absolute;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom));font:800 14px "Trebuchet MS",sans-serif;color:#222;background:#fff;border:3px solid #3a3a44;border-radius:16px;padding:8px 18px}
#dlg.hid .vshow{display:block}
#dlg .vhint{display:none;position:absolute;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);font:700 12px sans-serif;color:#fff;background:rgba(0,0,0,.6);border-radius:10px;padding:4px 10px;white-space:nowrap}
#dlg.hid .vhint{display:block}
#dlg .vname{position:absolute;top:-16px;left:14px;display:inline-flex;align-items:center;gap:8px;padding:4px 14px;border-radius:6px 6px 0 0;background:linear-gradient(#5a5a66,#34343e);border:2px solid #fff;border-bottom:0;z-index:2}
#dlg .vname b{font:900 14px "Trebuchet MS",sans-serif;color:#fff;letter-spacing:1.5px;text-transform:uppercase}
#dlg .hs{color:#ff6a9a;font-size:11px;letter-spacing:1px;position:relative}#dlg .hs i{color:rgba(255,255,255,.3);font-style:normal}
#dlg .hs u{position:absolute;left:0;right:0;bottom:-4px;height:3px;background:rgba(255,255,255,.2);text-decoration:none}#dlg .hs u:after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--p);background:#ff6a9a}
#dlg .tx{margin:6px 2px 6px;min-height:2.8em;max-height:30vh;overflow-y:auto;overflow-wrap:anywhere;font:700 15.5px/1.4 "Trebuchet MS",Verdana,sans-serif;color:#222}
#dlg .ch{display:flex;flex-direction:column;gap:6px;max-height:32vh;overflow-y:auto;margin:2px 0 4px}#dlg .ch:empty{display:none}
#dlg .ch button{font:800 15px "Trebuchet MS",sans-serif;color:#222;background:linear-gradient(#ffffff,#e8eaf0);border:2px solid #3a3a44;border-radius:12px;padding:8px 14px;min-height:40px;box-shadow:0 3px 0 #3a3a44;animation:vnbtn .3s ease backwards}
#dlg .ch button:nth-child(2){animation-delay:.05s}#dlg .ch button:nth-child(3){animation-delay:.1s}#dlg .ch button:nth-child(4){animation-delay:.15s}#dlg .ch button:nth-child(5){animation-delay:.2s}
#dlg .ch button:active{background:#7af06a;transform:translateY(2px);box-shadow:0 1px 0 #3a3a44}
#dlg .vctl{display:flex;justify-content:space-between;border-top:1px solid #e0e0e6;margin-top:2px}
#dlg .vctl button{font:700 13px "Trebuchet MS",sans-serif;color:#333;background:none;border:0;padding:9px 6px;min-height:36px;min-width:64px}
#dlg .vctl button:first-child{text-align:left}#dlg .vctl button:last-child{text-align:right;margin-right:18px}
#dlg.done:not(.last) .vctl [data-v=next]{color:#2aa83a;animation:vnpulse .6s infinite alternate}
@keyframes vnfade{from{opacity:0}}@keyframes vnbox{from{opacity:0;transform:translate(-50%,20px)}}
@keyframes vnslide{from{opacity:0;transform:translateX(26%) scale(.97)}to{opacity:1;transform:none}}
@keyframes vnflex{0%{transform:none}25%{transform:scale(1.05,1.03) rotate(-1.5deg)}50%{transform:scale(1.03) rotate(1deg)}100%{transform:none}}
@keyframes vnbounce{0%,100%{transform:none}35%{transform:translateY(-3%)}65%{transform:translateY(.5%)}}
@keyframes vnhop{0%,100%{transform:none}30%{transform:translateY(-1.5%) rotate(1.5deg)}60%{transform:rotate(-1deg)}}
@keyframes vnshake{0%,100%{transform:none}20%{transform:translateX(-3%)}40%{transform:translateX(3%)}60%{transform:translateX(-2%)}80%{transform:translateX(2%)}}
@keyframes vnpop{from{opacity:0;transform:translate(-50%,-80%) scale(.6)}}
@keyframes vnpt{from{opacity:1;transform:translate(-50%,-50%) scale(.6)}to{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.3)}}
@keyframes vndl{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}15%{opacity:1;transform:translate(-50%,-90%) scale(1.1)}100%{opacity:0;transform:translate(-50%,-260%)}}
@keyframes vnpulse{to{opacity:.55}}@keyframes vnbtn{from{opacity:0;transform:translateX(-14px)}}
`;document.head.appendChild(s);})();
