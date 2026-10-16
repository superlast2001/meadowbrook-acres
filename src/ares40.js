// ===== v0.0.0.40: Ares chibi world sprite + mood-matched talk art (sheet 7e9de386; crop + cutout only) =====
const AR={};['cg','ex_normal','ex_smile','ex_tease','ex_blush','ex_angry','ex_serious','po_talk','po_laugh','po_embar','po_angryp','po_think','po_surp','strip_dir','strip_walk','strip_emo'].forEach(k=>{const i=new Image();i.onload=()=>AR[k]=i;i.src='ares/'+k+'.png?v=40';});
const AR_EMO={idle:0,smile:1,blush:2,angry:3,surprised:4,happy:5,sit:6};let aresEmo=null;
function aresSetEmo(k,t){aresEmo=k?{k,t:performance.now()+(t||3500)}:null;}
const _drawNPC0=drawNPC;
drawNPC=function(id,a,now){if(id!='ares'||!AR.strip_dir||!AR.strip_walk){_drawNPC0(id,a,now);return;}
 ctx=X;X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';shadow(a.x,a.y+1,7);const hh=34;let im,cw,k,flip=false;
 const emo=aresEmo&&aresEmo.t>performance.now()&&!a.moving&&AR.strip_emo?aresEmo.k:null;
 if(emo){im=AR.strip_emo;cw=im.width/7;k=AR_EMO[emo]||0;}
 else if(a.moving&&(a.dir=='left'||a.dir=='right')){im=AR.strip_walk;cw=im.width/6;k=Math.floor(a.walk/4)%6;flip=a.dir=='left';}
 else{im=AR.strip_dir;cw=im.width/4;k={down:0,right:1,up:2,left:3}[a.dir]||0;}
 const ch=im.height,s=hh/119,ww=cw*s,h2=ch*s,bob=a.moving&&im==AR.strip_dir?Math.abs(Math.sin(a.walk/3))*1:0;
 X.save();X.translate(a.x,0);if(flip)X.scale(-1,1);X.drawImage(im,k*cw,0,cw,ch,-ww/2,a.y-h2+1-bob,ww,h2);X.restore();};
// ---- talk art ----
const AR_STAGE={normal:['cg','ex_normal'],smile:['po_talk','ex_smile'],happy:['po_talk','ex_smile'],teasing:['cg','ex_tease'],smug:['cg','ex_tease'],
 blush:['po_embar','ex_blush'],angry:['po_angryp','ex_angry'],mad:['po_angryp','ex_angry'],serious:['po_think','ex_serious'],laugh:['po_laugh','ex_smile'],
 thinking:['po_think','ex_serious'],surprised:['po_surp','ex_normal']};
const AR_EMO_OF={smile:'smile',happy:'happy',teasing:'smile',smug:'smile',blush:'blush',angry:'angry',mad:'angry',laugh:'happy',surprised:'surprised',serious:'idle',thinking:'idle',normal:'idle'};
const ZC=[['head',.47,0,.85,.36],['shoulder',.02,.3,.3,.45],['shoulder',.68,.36,.95,.5],['arm',0,.45,.22,1],['arm',.76,.18,1,.36],['chest',.24,.42,.8,.7],['back',.82,.5,1,.8]];
const ZP=[['head',.25,0,.82,.3],['shoulder',0,.28,.26,.42],['shoulder',.74,.28,1,.42],['arm',0,.42,.2,1],['arm',.8,.42,1,1],['chest',.22,.4,.78,.64],['back',.2,.64,.8,.8]];
Object.assign(VNDEF.ares,{px:0,react:{head:['blush','bounce'],shoulder:['laugh','hop'],arm:['smile','flex'],chest:['surprised','hop'],back:['laugh','bounce']}});
const _vnMood0=vnMood;vnMood=function(m){if(VN.id=='ares'||m in AR_STAGE)return AR_STAGE[m]?m:'normal';return _vnMood0(m);};
function aresInfer(t){t=String(t);if(/\?!|!\?|^\W*(what|huh|whoa)\b/i.test(t))return 'surprised';if(/\b(ha(ha)+|hah|heh)\b/i.test(t))return /~|cute|rookie/i.test(t)?'teasing':'laugh';
 if(/\bhmm+\b|let me think|\.\.\.\s*\w+\?/i.test(t))return 'thinking';if(/charging|cute|admire|free of charge|~/i.test(t))return 'teasing';if(/\bnobody\b|\bkeep trouble\b|security/i.test(t))return 'serious';
 if(/!/.test(t))return 'smile';return 'normal';}
function aresStage(m){const d=$('dlg');if(!d||VN.id!='ares')return;const st=AR_STAGE[m]||AR_STAGE.normal,im=d.querySelector('.vp'),pw=d.querySelector('.vpw'),I=AR[st[0]];
 const asp=I?I.width/I.height:(st[0]=='cg'?433/500:.6);const src='ares/'+st[0]+'.png?v=40';if(!im.src.endsWith(src))im.src=src;im.style.imageRendering='auto';
 pw.style.setProperty('--asp',asp);pw.style.height=st[0]=='cg'?'min(58vh,calc(96vw / '+asp+'))':'min(66vh,calc(100vw / '+asp+'))';VNDEF.ares.zones=st[0]=='cg'?ZC:ZP;
 let f=d.querySelector('.vface');if(!f){f=document.createElement('img');f.className='vface';f.alt='';d.querySelector('.vbox').appendChild(f);}f.src='ares/'+st[1]+'.png?v=40';f.style.display='';
 aresSetEmo(AR_EMO_OF[m]||'idle',4000);requestAnimationFrame(vnLayout);}
const _vnExpr0=vnExpr;vnExpr=function(m){const d=$('dlg');if(VN.id=='ares'){d.querySelector('.vpi').dataset.ex=m;d.querySelector('.vfx').querySelectorAll('.ex').forEach(e=>e.remove());aresStage(m);return;}
 const f=d&&d.querySelector('.vface');if(f)f.style.display='none';_vnExpr0(m);};
const _vnShowPage0=vnShowPage;vnShowPage=function(){if(VN.id=='ares'){const base=VN.mood0||VN.mood;const m=base=='normal'?aresInfer(VN.pages[VN.pi]||''):base;VN.mood=m;vnExpr(m);}_vnShowPage0();};
const _dialog0=dialog;dialog=function(id,t,mood,ch){VN.mood0=null;_dialog0(id,t,mood,ch);if(id=='ares'){VN.mood0=vnMood(mood);}};
(function(){const s=document.createElement('style');s.textContent=`#dlg .vface{position:absolute;right:14px;top:-74px;width:72px;height:72px;object-fit:cover;object-position:50% 20%;border-radius:12px;border:3px solid #3a3a44;background:#1c1a24;box-shadow:0 4px 10px rgba(0,0,0,.4);pointer-events:none}`;document.head.appendChild(s);})();
if(window.NB){NB.dialog=dialog;NB.aresSetEmo=aresSetEmo;}
