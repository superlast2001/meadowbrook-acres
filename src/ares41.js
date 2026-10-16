/* v0.0.0.43: gentler scale (40% ESRGAN blended with Lanczos 2x); face card = crop of the shown pose */
/* v0.0.0.42: talk art upscaled with Real-ESRGAN x4plus anime_6B (+ original texture restore), alpha from original cut mask */
// ===== v0.0.0.41: Ares from sheet 434816bf (crop + cutout only). Chibi world sprite; full-body mood poses as the talk stand; close-up expressions in a framed face card =====
const AR={};const ARK=['po_talk','po_laugh','po_tease','po_embar','po_angry','po_think','po_surp','po_serious','strip_dir','strip_walk','strip_emo'];
ARK.forEach(k=>{const i=new Image();i.onload=()=>AR[k]=i;i.src='ares/'+k+(k.startsWith('strip')?'.png':'.webp')+'?v=43';});
const AR_EMO={idle:0,smile:1,blush:2,angry:3,surprised:4,happy:5,sit:6};let aresEmo=null;
function aresSetEmo(k,t){aresEmo=k?{k,t:performance.now()+(t||3500)}:null;}
const _drawNPC0=drawNPC;
drawNPC=function(id,a,now){if(id!='ares'||!AR.strip_dir||!AR.strip_walk){_drawNPC0(id,a,now);return;}
 ctx=X;X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';shadow(a.x,a.y+1,7);let im,n,k,flip=false;
 const emo=aresEmo&&aresEmo.t>performance.now()&&!a.moving&&AR.strip_emo?aresEmo.k:null;
 if(emo){im=AR.strip_emo;n=7;k=AR_EMO[emo]||0;}
 else if(a.moving&&(a.dir=='left'||a.dir=='right')){im=AR.strip_walk;n=7;k=Math.floor(a.walk/4)%7;flip=a.dir=='left';}
 else{im=AR.strip_dir;n=4;k={down:0,right:1,up:2,left:3}[a.dir]||0;}
 const cw=im.width/n,ch=im.height,s=34/108,ww=cw*s,h2=ch*s,bob=a.moving&&im==AR.strip_dir?Math.abs(Math.sin(a.walk/3)):0;
 X.save();X.translate(a.x,0);if(flip)X.scale(-1,1);X.drawImage(im,k*cw,0,cw,ch,-ww/2,a.y-h2+1-bob,ww,h2);X.restore();};
// ---- talk: mood -> [full-body pose, close-up face] ----
const AR_STAGE={normal:['po_talk','ex_normal'],smile:['po_talk','ex_smile'],happy:['po_laugh','ex_smile'],teasing:['po_tease','ex_tease'],smug:['po_tease','ex_tease'],
 blush:['po_embar','ex_blush'],angry:['po_angry','ex_angry'],mad:['po_angry','ex_angry'],serious:['po_serious','ex_serious'],laugh:['po_laugh','ex_smile'],
 thinking:['po_think','ex_serious'],surprised:['po_surp','ex_surp'],sad:['po_serious','ex_sad']};
const AR_EMO_OF={smile:'smile',happy:'happy',teasing:'smile',smug:'smile',blush:'blush',angry:'angry',mad:'angry',laugh:'happy',surprised:'surprised',serious:'idle',thinking:'idle',sad:'idle',normal:'idle'};
const ZP=[['head',.3,0,.75,.17],['shoulder',.08,.15,.33,.26],['shoulder',.67,.15,.92,.26],['arm',0,.22,.2,.55],['arm',.8,.22,1,.55],['chest',.28,.2,.72,.37],['back',.3,.37,.7,.45]];
Object.assign(VNDEF.ares,{px:0,zones:ZP,react:{head:['blush','bounce'],shoulder:['laugh','hop'],arm:['smile','flex'],chest:['surprised','hop'],back:['laugh','bounce']}});
const _vnMood0=vnMood;vnMood=function(m){if(VN.id=='ares'||m in AR_STAGE)return AR_STAGE[m]?m:'normal';return _vnMood0(m);};
function aresInfer(t){t=String(t);if(/\?!|!\?|^\W*(what|huh|whoa)\b/i.test(t))return 'surprised';if(/\b(ha(ha)+|hah)\b/i.test(t))return 'laugh';if(/\bheh+e*\b|~/i.test(t))return 'teasing';
 if(/\bhmm+\b|let me think/i.test(t))return 'thinking';if(/\b(sorry|miss(ed)?|alone|lonely|sad)\b/i.test(t))return 'sad';if(/charging|cute|admire|free of charge|rookie/i.test(t))return 'teasing';
 if(/\bnobody\b|keep trouble|security|not on my watch/i.test(t))return 'serious';if(/!/.test(t))return 'smile';return 'normal';}
function aresStage(m){const d=$('dlg');if(!d||VN.id!='ares')return;const st=AR_STAGE[m]||AR_STAGE.normal,im=d.querySelector('.vp'),pw=d.querySelector('.vpw'),I=AR[st[0]];
 const asp=I?I.width/I.height:.52;const src='ares/'+st[0]+'.webp?v=43';if(!im.src.endsWith(src)){im.classList.remove('arsw');void im.offsetWidth;im.classList.add('arsw');im.src=src;}im.style.imageRendering='auto';
 pw.style.setProperty('--asp',asp);pw.style.height='min(82vh,calc(100vw / '+asp.toFixed(3)+'))';
 let f=d.querySelector('.vface');if(!f){f=document.createElement('img');f.className='vface';f.alt='';d.querySelector('.vbox').appendChild(f);}f.src='ares/ic_'+st[0].slice(3)+'.webp?v=43';f.style.display='';
 aresSetEmo(AR_EMO_OF[m]||'idle',4000);}
const _vnExpr0=vnExpr;vnExpr=function(m){const d=$('dlg');if(VN.id=='ares'){d.querySelector('.vpi').dataset.ex=m;d.querySelector('.vfx').querySelectorAll('.ex').forEach(e=>e.remove());aresStage(m);return;}
 const f=d&&d.querySelector('.vface');if(f)f.style.display='none';_vnExpr0(m);};
const _vnShowPage0=vnShowPage;vnShowPage=function(){if(VN.id=='ares'){const base=VN.mood0||VN.mood;const m=base=='normal'?aresInfer(VN.pages[VN.pi]||''):base;VN.mood=m;vnExpr(m);}_vnShowPage0();};
const _dialog0=dialog;dialog=function(id,t,mood,ch){VN.mood0=null;_dialog0(id,t,mood,ch);if(id=='ares')VN.mood0=vnMood(mood);};
(function(){const s=document.createElement('style');s.textContent=`
#dlg[data-id=ares] .vpw{bottom:0!important}
#dlg[data-id=ares] .vpi{filter:drop-shadow(0 4px 12px rgba(0,0,0,.45))}
#dlg .vp.arsw{animation:arsw .28s ease}@keyframes arsw{from{opacity:.25}}
#dlg .vface{position:absolute;right:14px;top:-84px;width:80px;height:80px;object-fit:cover;object-position:50% 30%;border-radius:14px;border:3px solid #fff;outline:2px solid #3a3a44;background:#1c1a24;box-shadow:0 4px 10px rgba(0,0,0,.45);pointer-events:none}`;document.head.appendChild(s);})();
if(window.NB){NB.dialog=dialog;NB.aresSetEmo=aresSetEmo;}
