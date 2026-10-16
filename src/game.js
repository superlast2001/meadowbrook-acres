// ===== NEON BARN (Meadowbrook Acres v0.0.0.33) =====
const VERSION='v0.0.0.43',SAVE_KEY='neonbarn_save_v1',TS=16;
const SPR={};const cv=document.getElementById('c'),X=cv.getContext('2d');
let G=null,AREA=null,cam={x:0,y:0},K=3,DPR=1,cssW=800,cssH=600,canH=600,TOUCH=false;
const keys={};let UI=null; // open modal name
const CHEAT={speed:false,noclip:false,gold:false};
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),rpick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function fmtT(t){const h=Math.floor(t/60)%24,m=Math.floor(t%60/10)*10;return ((h%12)||12)+':'+String(m).padStart(2,'0')+(h<12?' AM':' PM');}
const isNight=()=>G.time>=1170;
// ---------- items ----------
const ITEMS={drink:{name:'Neon Soda',buy:6,sell:3},chocolate:{name:'Chocolate',buy:20,sell:8},scrap:{name:'Scrap',sell:4},ore:{name:'Ore',sell:9},
 bouquet:{name:'Bouquet',buy:200,sell:0},pendant:{name:'Moonstone Pendant',buy:1000,sell:0}};
const DECOR={lamp:{name:'Neon Lamp',price:60,pts:3},plant:{name:'Planter',price:40,pts:2},stool:{name:'Bar Stool',price:50,pts:1,bar:1},speaker:{name:'Speaker',price:150,pts:3,hype:8},
 sofa:{name:'VIP Sofa',price:220,pts:4,vip:2},disco:{name:'Disco Ball',price:400,pts:6,hype:15},sign:{name:'Scrap Neon Sign',price:0,pts:8,craft:{scrap:3,ore:2}}};
const ROLES=['DJ','Bouncer','Bartender','Cleaner'];
const RANKS=[[0,'Unknown'],[20,'Local Spot'],[80,'Hot Spot'],[200,'Famous'],[500,'Legend']];
const rankOf=f=>{let r=RANKS[0][1];for(const [n,t] of RANKS)if(f>=n)r=t;return r;};
// ---------- NPCs / relationships ----------
const NPCDEF={rzel:{name:'Rzel',h:32,sheet:'rzel_world',dateable:true,love:['chocolate'],like:['drink'],hate:['scrap']},
 ares:{name:'Ares',h:33,sheet:'ares_world',dateable:true,love:['ore'],like:['chocolate','drink'],hate:[]},
 mabel:{name:'Mabel',h:29,sheet:'mabel_sheet',love:['chocolate'],like:['drink'],hate:['scrap']},
 pip:{name:'Pip',h:23,sheet:'pip_sheet',love:['chocolate'],like:['scrap'],hate:['ore']}};
function relOf(id){if(!G.rel[id])G.rel[id]={pts:0,talkDay:0,giftDay:0,known:{},dating:false,engaged:false,married:false,wedDay:0};return G.rel[id];}
function heartCap(id){const R=relOf(id);return NPCDEF[id].dateable?(R.married?14:R.dating?10:8):10;}
function heartsOf(id){return Math.min(heartCap(id),Math.floor(relOf(id).pts/100));}
function addRel(id,n){const h=heartsOf(id),R=relOf(id);R.pts=clamp(R.pts+n,0,heartCap(id)*100);if(heartsOf(id)>h)msg(NPCDEF[id].name+': '+heartsOf(id)+' \u2665');}
function statusOf(id){const R=relOf(id),h=heartsOf(id);if(R.married)return 'Married';if(R.engaged)return 'Engaged';if(R.dating)return 'Dating';return h>=8?'Best friend':h>=5?'Good friend':h>=3?'Friend':h>=1?'Acquaintance':'Stranger';}
const LINES={
 rzel:[[0,["Name's Rzel. Best gear in the market. Best smile too, but you didn't hear it from me.","So YOU bought the old barn on the plaza? Bold. I like bold.","Neon Barn, huh? Farm kid turned club owner. Cute."]],
  [3,["You were up till 4am again, weren't you? Those eye bags are... kind of adorable.","If your club needs a DJ with taste, I know a girl. She's me.","I walked past the Barn last night. The bass made my heart skip. Or maybe that was you."]],
  [6,["I saved you the shiny lamp. Don't tell the other customers.","Every time you walk in, the neon gets brighter. Science can't explain it.","Save me a slow song tonight? ...Kidding. Unless?"]],
  [9,["You. Me. Rooftop. Sunrise after closing. That's the plan.","Best part of my day is you walking past my counter."]]],
 ares:[[0,["Name's Ares. I keep trouble out. Need muscle at the door, boss?","Nice club. Terrible security. Lucky you met me.","Don't mind the sword. It's decorative. Mostly."]],
  [3,["Nobody gets past me without ID. Except you. You get a free pass.","Training at dawn, door at night. You keep me busy, boss.","You look good in neon light. Just an observation. A professional one."]],
  [6,["I'd guard you even if you didn't pay me. Don't tell accounting.","When the music stops and the crowd leaves... I like those quiet minutes with you.","Heh. You're staring. It's fine. I stare back."]],
  [9,["Forget the velvet rope. You're the only VIP I care about.","Sun's coming up. Walk you home, partner?"]]],
 mabel:[[0,["Oh hello, dear! A nightclub? In my day we called it a dance hall.","Need someone to pour drinks? I ran the church bake sale for thirty years. I can handle crowds."]],
  [4,["You work too hard, dear. Eat something.","The young folk love your club. Turn it down a smidge for my hearing aid, would you?"]]],
 pip:[[0,["WHOA, you own the Neon Barn?! That's SO cool!","Grandma says I can only help in the daytime. I'm a great sweeper!"]],
  [4,["I made a flyer for your club! It has a dragon on it. Dragons are good for business.","Can I push the light button? Just once? Pleeease?"]]]};
function talkLine(id){const R=relOf(id),h=heartsOf(id);if(R.married)return id=='rzel'?rpick(["Morning, love. I already counted last night's take. You're doing great.","Home is wherever you are. Even if that's a nightclub at 3am."]):rpick(["Morning, partner. Push-ups done. Coffee... brown. Close enough.","Best part of my shift? Walking home with you."]);
 let pool=LINES[id][0][1];for(const [n,l] of LINES[id])if(h>=n)pool=l;return rpick(pool);}
function portraitOf(id,mood){if(id=='rzel')return 'rzel_p_'+({happy:'smile',blush:'blush',mad:'mad'}[mood]||'normal');if(id=='ares')return 'ares_p_'+({happy:'happy',blush:'blush',mad:'mad'}[mood]||'normal');return null;}
function giveGift(id,it){const R=relOf(id),D=NPCDEF[id],nm=ITEMS[it].name;
 if(it=='bouquet'){if(!D.dateable)return ["That's sweet, but save those for someone special!",'happy'];if(R.dating)return ["We're already together, silly. Keep them for the club bar.",'happy'];
   if(heartsOf(id)<8)return ["Whoa, bold! Not THAT bold yet. (Needs 8 hearts.)",'blush'];G.inv.bouquet--;R.dating=true;addRel(id,60);return [id=='rzel'?"A bouquet... for me? ...Yes. A thousand times yes.":"For me? Ha! ...Yeah. You're stuck with this sword-swinging idiot now.",'blush'];}
 if(it=='pendant'){if(!D.dateable)return ["That pendant is meant for someone you want to spend your life with.",'normal'];if(R.married)return ["We're already forever. Keep it safe.",'happy'];
   if(!R.dating||heartsOf(id)<10)return ["That means forever... ask me when we're dating and closer. (Dating + 10 hearts.)",'blush'];G.inv.pendant--;R.engaged=true;R.wedDay=G.day+3;return [id=='rzel'?"A Moonstone Pendant? ...Yes. Three days. Rooftop wedding. Neon everywhere.":"You're serious. Good. So am I. Three days - let's do this.",'blush'];}
 if(R.giftDay==G.day)return ["One gift a day! Come back tomorrow.",'normal'];
 const k=D.love.includes(it)?'love':D.like.includes(it)?'like':D.hate.includes(it)?'hate':'neutral';G.inv[it]--;R.giftDay=G.day;R.known[it]=k;addRel(id,{love:80,like:45,neutral:20,hate:-40}[k]);
 const T={love:["A "+nm+"?! You know me too well.","My favourite! You're spoiling me."],like:["A "+nm+"! Thanks, boss.","Nice, a "+nm+". Thoughtful."],neutral:["A "+nm+". Thanks!"],hate:["Um... a "+nm+"? Not my thing. But thanks for thinking of me."]};
 return [rpick(T[k]),k=='hate'?'mad':k=='love'?'blush':'happy'];}
// ---------- staff ----------
const FN=['Kai','Nova','Jett','Luz','Ozzy','Mira','Dex','Yuki','Rio','Sasha','Bo','Indy','Zane','Coco','Remy','Tasha'];
function genCands(){const c=[];const sp=[];
 if(!G.staff.find(s=>s.id=='ares'))sp.push({id:'ares',name:'Ares',role:'Bouncer',stat:5,wage:120,npc:'ares'});
 if(!G.staff.find(s=>s.id=='rzel'))sp.push({id:'rzel',name:'Rzel',role:'DJ',stat:5,wage:130,npc:'rzel'});
 if(!G.staff.find(s=>s.id=='mabel'))sp.push({id:'mabel',name:'Mabel',role:'Bartender',stat:3,wage:60,npc:'mabel'});
 if(!G.staff.find(s=>s.id=='pip'))sp.push({id:'pip',name:'Pip',role:'Cleaner',stat:3,wage:30,npc:'pip',dayOnly:true});
 for(let i=0;i<3;i++){const st=rint(1,4);c.push({id:'s'+Date.now()%100000+i+rint(0,999),name:rpick(FN),role:rpick(ROLES),stat:st,wage:25+st*20+rint(0,10),seed:rint(1,9999)});}
 G.cands=sp.concat(c);G.candDay=G.day;}
const staffOf=r=>G.staff.filter(s=>s.role==r);
const bestStat=r=>Math.max(0,...staffOf(r).filter(s=>!s.dayOnly).map(s=>s.stat));
// ---------- game state ----------
function newGame(){G={v:1,day:1,time:420,gold:600,fans:0,area:'home',p:{x:120,y:200,dir:'down'},inv:{drink:12,chocolate:1,scrap:0,ore:0,bouquet:0,pendant:0},
 decor:{lamp:2,plant:2,stool:2,speaker:0,sofa:0,disco:0,sign:0},club:{items:[],clean:100,open:false},staff:[],cands:[],candDay:0,rel:{},night:null,bins:{day:0,taken:[]},nightsRun:0};
 G.club.items=[{k:'stool',tx:2,ty:6,lvl:1},{k:'stool',tx:4,ty:6,lvl:1},{k:'plant',tx:9,ty:4,lvl:1},{k:'lamp',tx:20,ty:4,lvl:1}];G.decor.stool=0;G.decor.plant=1;G.decor.lamp=1;genCands();}
function save(q){try{localStorage.setItem(SAVE_KEY,JSON.stringify(G));if(!q)msg('Game saved.');}catch(e){}}
function load(){const s=localStorage.getItem(SAVE_KEY);if(!s){msg('No save found.');return false;}try{const o=JSON.parse(s);newGame();Object.assign(G,o);G.night=null;G.club.open=false;if(G.time>=1170)G.time=1160;enterArea(G.area,G.p.x,G.p.y,true);msg('Loaded day '+G.day+'.');return true;}catch(e){msg('Save broken.');return false;}}
// ---------- areas ----------
const BAKE={};
function bakeCanvas(w,h){const c=document.createElement('canvas');c.width=w*BS;c.height=h*BS;ctx=c.getContext('2d');ctx.setTransform(BS,0,0,BS,0,0);ctx.imageSmoothingEnabled=true;LIGHTS=[];EMIT=[];return c;}
function finishNight(c,w,h,dark){ctx.fillStyle='rgba(12,10,40,'+dark+')';ctx.fillRect(0,0,w,h);for(const e of EMIT)drawEmit(e);
 ctx.globalCompositeOperation='lighter';for(const [lx,ly,r,c2] of LIGHTS){const g=ctx.createRadialGradient(lx,ly,0,lx,ly,r);g.addColorStop(0,c2+'66');g.addColorStop(1,c2+'00');ctx.fillStyle=g;ctx.fillRect(lx-r,ly-r,2*r,2*r);}ctx.globalCompositeOperation='source-over';}
const CX=440; // club x in plaza
function bakeClub(open){const W=480,H=352,c=bakeCanvas(W,H);NIGHT=open;
 R(0,0,W,H,'#1a1226');carpet(0,48,W,H-48,'#241a34','#2c2040');
 ctx.fillStyle=lg(0,0,0,48,['#4a3470','#2e2048','#1e1430']);ctx.fillRect(0,0,W,48);for(let i=0;i<W;i+=24){ctx.fillStyle=lg(i,0,i+24,0,['rgba(255,255,255,.06)','rgba(0,0,0,0)','rgba(0,0,0,.18)']);ctx.fillRect(i,0,24,44);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(i,0,.8,44);}ctx.fillStyle=lg(0,40,0,48,['#24183a','#0a0610']);ctx.fillRect(0,40,W,8);R(0,0,8,H,'#2e2048');R(W-8,0,8,H,'#2e2048');R(0,H-8,200,8,'#2e2048');R(280,H-8,200,8,'#2e2048');
 for(let i=12;i<W-12;i+=10)E(i,6,5,3,NEONS[(i/10|0)%6]);
 // bar (left)
 rr(16,12,96,32,2,lg(0,12,0,44,['#4a3020','#24160c']));for(let r2=0;r2<2;r2++){ctx.fillStyle='#8a5a30';ctx.fillRect(18,25+r2*12,92,1.5);for(let i=21;i<108;i+=6){const bc=['#c0392b','#e0a020','#3a8a5a','#4ff0ff','#b07aff'][(i+r2*3)%5];ctx.fillStyle=lg(i,0,i+4,0,[shade(bc,.3),bc,shade(bc,-.4)]);rr(i,16+r2*12,3.6,9,1.2);ctx.fill();ctx.fillRect(i+1.2,14+r2*12,1.2,3);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(i+.6,18+r2*12,.6,5);}}
 shadow(64,84,54);rr(12,66,104,16,2,lg(0,66,0,82,['#7a4422','#4a2410']));rr(10,62,108,6,2,lg(0,62,0,68,['#e0b080','#a06a3a','#6a3a1e']));ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(14,63,100,.6);for(let i=20;i<112;i+=16){ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(i,68,.6,14);}neon('BAR',52,71,'#fff2c0','#ffb040',1);
 // DJ booth
 shadow(240,82,46);rr(196,52,88,28,3,lg(0,52,0,80,['#2a2a36','#0c0c12']));ctx.save();ctx.shadowColor='#ff4fd0';ctx.shadowBlur=5;rr(196,52,88,3,1.5,'#ff4fd0');ctx.restore();for(const tx of [220,260]){ctx.fillStyle=rg(tx,62,8,['#5a5a6a','#1a1a22']);ctx.beginPath();ctx.arc(tx,62,7,0,7);ctx.fill();ctx.strokeStyle='#4ff0ff';ctx.lineWidth=.5;ctx.beginPath();ctx.arc(tx,62,5,0,7);ctx.stroke();ctx.fillStyle='#ddd';ctx.beginPath();ctx.arc(tx,62,1,0,7);ctx.fill();}for(let i=232;i<249;i+=3)rr(i,58,2,8,.5,NEONS[(i/3|0)%6]);neon('DJ',236,70,'#ffd1f0','#ff4fd0',1);
 speaker(170,40,30);speaker(296,40,30);
 // dance floor
 danceTiles(150,100,180,120,open?1:0);
 // VIP
 R(352,56,120,150,'#3a1430');for(let j=60;j<206;j+=8)for(let i=356+(j/8%2)*8;i<468;i+=16)R(i,j,8,8,'#4a1a3e');text('VIP',400,60,'#ffe14f');for(let j=60;j<206;j+=10){R(348,j,3,6,'#d0b040');}
 // office
 R(368,248,104,96,'#2a2420');tiles(370,250,100,92,'#3a3028','#342a22');R(368,248,104,4,'#5a4a3a');R(368,248,4,96,'#5a4a3a');R(400,270,40,16,'#6a4024');R(404,266,14,6,'#bff4ff');text('OFFICE',398,256,'#ffe7a0');
 // entrance
 R(200,H-8,80,8,open?'#ff4fd0':'#5a2a5a');text('EXIT',228,H-16,'#ffe7a0');
 finishGrain(W,H,.04);if(open){LIGHTS.push([240,160,140,'#ff4fd0'],[60,70,60,'#ffe14f'],[410,130,70,'#b07aff'],[240,60,60,'#4ff0ff']);finishNight(c,W,H,0.22);}else{ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(0,0,W,H);}
 return c;}
function bakeMarket(night){const W=800,H=480,c=bakeCanvas(W,H);NIGHT=night;sd=321;sidewalk(0,0,W,H);
 const sh=[[40,170,'RZEL','#ffe14f'],[230,150,'SUPPLY','#7affb0'],[400,140,'HIRE','#ff4fd0'],[560,100,'BOBA','#4ff0ff'],[680,120,'GEAR','#ff7a3d']];
 for(const [x,w,s,n] of sh)bigB(x,220,w,150,{sign:s,neon:n,vneon:n});bigB(0,220,40,150,{});
 for(let i=0;i<5;i++){const sx=60+i*140,col=NEONS[i];R(sx,300,70,26,'#5a4030');R(sx-4,288,78,12,col);for(let k=sx-4;k<sx+74;k+=8)R(k,288,4,12,'#fff');R(sx+8,304,10,6,'#e05030');R(sx+28,304,10,6,'#f0c040');R(sx+48,304,10,6,'#60c040');LIGHTS.push([sx+35,310,40,col]);}
 R(470,196,20,24,'#2a2e3e');E(472,198,16,12,'#4ff0ff');text('JOB',470,212,'#fff');LIGHTS.push([480,206,24,'#4ff0ff']);
 R(0,400,W,80,'#353844');R(0,400,W,2,'#9aa0ac');for(let i=0;i<W;i+=24)R(i,440,12,2,'#d8dce4');busStop(700,398);
 for(const x of [30,250,520,770])bigTree(x,390);for(const x of [140,380,640])bigLamp(x,380);
 if(night)finishNight(c,W,H,0.4);return c;}
function bakeAlleys(night){const W=640,H=480,c=bakeCanvas(W,H);NIGHT=night;sd=555;R(0,0,W,H,'#3a3a44');for(let j=0;j<H;j+=8)for(let i=(j/8%2)*8;i<W;i+=16)R(i,j,8,8,'#34343e');
 for(let x=0;x<W;x+=ri(80,130))bigB(x,150,130,110,{noshop:1,face:'#4a4048'});bigB(0,480,640,100,{noshop:1,face:'#3a3440'});
 R(0,150,W,8,'#2a2a30');for(let k=0;k<10;k++){const px=ri(20,600),py=ri(170,330);ctx.fillStyle='rgba(80,140,200,.35)';ctx.beginPath();ctx.ellipse(px,py,14,5,0,0,7);ctx.fill();}
 E(120,40,6,60,'#ff4fd0');E(420,50,6,50,'#4ff0ff');LIGHTS.push([123,70,40,'#ff4fd0'],[423,75,40,'#4ff0ff']);
 for(const [x,y] of BINS){R(x-14,y-18,28,18,'#3a6a4a');R(x-15,y-20,30,4,'#2a4a34');R(x-12,y-14,24,1,'#2a4a34');}
 R(300,160,40,30,'#2a1a10');R(304,164,32,22,'#5a3a24');text('?',318,170,'#ffe14f');
 if(night)finishNight(c,W,H,0.42);return c;}
const BINS=[[60,200],[180,186],[300,330],[420,200],[540,320],[600,200]];
function bakeHome(night){const W=480,H=320,c=bakeCanvas(W,H);NIGHT=night;tiles(0,0,W,H,'#e4e8ee','#d8dce4');
 R(0,0,W,40,'#9ad0f0');for(let i=0;i<W;i+=24)R(i,0,2,40,'#f2f4f8');R(0,40,W,3,'#c0c8d0');
 R(300,43,180,277,'#d0c8b8');pool(330,90,120,70);for(const [x,y] of [[316,80],[466,200],[316,260]])palm(x,y);R(340,190,20,8,'#f2f2f2');R(380,190,20,8,'#f2f2f2');R(296,43,4,277,'rgba(200,240,255,.7)');
 shadow(64,136,28);rr(40,70,48,64,3,lg(0,70,0,134,['#ffffff','#dcdce6']));rr(40,70,48,14,3,lg(0,70,0,84,['#9a7ae8','#5a3ab0']));rr(44,86,40,44,3,lg(44,0,84,0,['#d4bcff','#a888f0']));rr(46,86,16,8,3,'#ffffff');rr(66,86,16,8,3,'#ffffff');text('BED',52,140,'#3b2414');
 R(140,80,90,40,'#5a3a24');R(150,70,70,10,'#7a4a24');R(130,170,120,50,'#4a5a7a');R(134,174,112,30,'#6a7a9a');text('SOFA',176,226,'#3b2414');
 R(220,H-8,60,8,'#7a5634');text('DOOR',236,H-16,'#3b2414');R(16,200,30,40,'#2a2e3e');E(18,202,26,20,'#4ff0ff');
 if(night)finishNight(c,W,H,0.3);return c;}
const AREAS={
 plaza:{name:'Central Plaza',w:1280,h:960,bake:bakePlaza,
  solids:[[0,0,600,298],[680,0,600,298],[600,0,80,288],[556,528,168,62],[200,366,170,114],[696,628,68,38],[816,628,68,38],[1050,442,56,30],[690,316,124,8],[0,866,1280,94],[170,374,12,8],[1098,374,12,8],[414,594,12,8],[854,594,12,8],[634,738,12,8]],
  exits:[{r:[600,284,80,18],to:'club',at:[240,330],label:'Enter Neon Barn'},{r:[-20,330,24,530],to:'alleys',at:[612,330]},{r:[1276,330,24,530],to:'market',at:[24,350]}],
  acts:[{r:[730,770,90,30],a:'tram',label:'Tram stop'}]},
 club:{name:'Neon Barn',w:480,h:352,bake:bakeClub,
  solids:[[0,0,480,50],[0,0,10,352],[470,0,10,352],[0,344,200,8],[280,344,200,8],[12,60,104,22],[196,50,88,30],[368,248,104,4],[368,248,4,60],[400,266,40,20],[170,40,14,34],[296,40,14,34]],
  exits:[{r:[200,346,80,10],to:'plaza',at:[640,320],label:'Exit to plaza'}],
  acts:[{r:[396,262,48,30],a:'office',label:'Office desk'},{r:[196,50,88,36],a:'djbooth',label:'DJ booth'},{r:[12,60,104,30],a:'bar',label:'Bar'}]},
 market:{name:'Neon Market',w:800,h:480,bake:bakeMarket,solids:[[0,0,800,222],[60,296,70,30],[200,296,70,30],[340,296,70,30],[480,296,70,30],[620,296,70,30]],
  exits:[{r:[-20,230,24,250],to:'plaza',at:[1250,600]}],
  acts:[{r:[105,212,40,16],a:'rzelshop',label:"Rzel's Gear Shop"},{r:[285,212,40,16],a:'supply',label:'Supply Store'},{r:[455,212,50,16],a:'hire',label:'Hire Office / Job Terminal'},{r:[680,400,90,20],a:'tram',label:'Tram stop'}]},
 alleys:{name:'Back Alleys',w:640,h:480,bake:bakeAlleys,solids:[[0,0,640,154],[0,376,640,104]].concat(BINS.map(([x,y])=>[x-15,y-20,30,20])),
  exits:[{r:[636,154,24,222],to:'plaza',at:[24,600]}],acts:BINS.map(([x,y],i)=>({r:[x-18,y-24,36,32],a:'bin:'+i,label:'Search bin'})).concat([{r:[296,186,48,14],a:'craft',label:'Workbench (craft)'}])},
 home:{name:'Resort Home',w:480,h:320,bake:bakeHome,solids:[[0,0,480,44],[40,70,48,64],[140,70,90,50],[130,170,120,52],[330,90,120,70],[0,312,220,8],[280,312,200,8],[16,200,30,40]],
  exits:[{r:[220,314,60,10],to:'plaza',at:[770,762],label:'Leave (tram to plaza)'}],acts:[{r:[36,66,56,72],a:'bed',label:'Bed (sleep)'},{r:[12,196,38,48],a:'tram',label:'Tram app'}]}};
function bg(id){const n=id=='club'?(G.club.open?1:0):(isNight()?1:0),k=id+n;if(!BAKE[k]){sd=777;BAKE[k]=AREAS[id].bake(!!n);}return BAKE[k];}
let fade=0,fadeTo=null;
function enterArea(id,x,y,instant){const go=()=>{G.area=id;AREA=AREAS[id];if(typeof resize=='function')resize();G.p.x=x;G.p.y=y;snapCam();onEnter(id);};if(instant){go();return;}fade=0.01;fadeTo=go;}
function onEnter(id){if(id=='club'&&G.club.open)msg('The Neon Barn is OPEN!');if(id=='market'&&!isNight()&&Math.random()<.6)say('rzel',rpick(["Hey boss! Shopping for the Barn?","Fresh neon in stock. And me. I'm also here."]),3);}
// ---------- collision ----------
function solidAt(x,y){if(CHEAT.noclip)return x<2||y<6||x>AREA.w-2||y>AREA.h;if(x<4||x>AREA.w-4||y<8||y>AREA.h-2){return !AREA.exits.some(e=>hit(e.r,x,y));}
 for(const r of AREA.solids)if(x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3])return true;
 if(G.area=='club')for(const it of G.club.items){if(x>=it.tx*TS&&x<(it.tx+(it.k=='sofa'?2:1))*TS&&y>=it.ty*TS+6&&y<(it.ty+1)*TS)return true;}return false;}
const hit=(r,x,y)=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3];
function blocked(x,y){return solidAt(x-5,y-3)||solidAt(x+5,y-3)||solidAt(x-5,y+1)||solidAt(x+5,y+1);}
// ---------- NPC actors ----------
const ACT={};// runtime actors {x,y,dir,moving,walk,tx,ty,wT,area}
function npcPlace(id){// where is this NPC now
 const st=G.staff.find(s=>s.npc==id);const t=G.time;
 if(G.club.open&&st&&!st.dayOnly){if(st.role=='Bouncer')return ['plaza',CX+246,334];if(st.role=='DJ')return ['club',240,48];if(st.role=='Bartender')return ['club',64,58];if(st.role=='Cleaner')return ['club',300,260];}
 if(isNight()){if(id=='ares'&&!G.club.open)return ['plaza',900,380];return null;}
 if(id=='rzel')return ['market',125,236];if(id=='ares')return ['plaza',t<720?820:460,t<720?700:640];if(id=='mabel')return ['market',360,260];if(id=='pip')return ['market',560,350];}
function updateActors(dt){for(const id in NPCDEF){const pl=npcPlace(id);let a=ACT[id];if(!pl){if(a)a.area=null;continue;}
  if(!a||a.area!=pl[0]||a.key!=pl.join()){a=ACT[id]={area:pl[0],x:pl[1],y:pl[2],hx:pl[1],hy:pl[2],dir:'down',moving:false,walk:0,wT:2,key:pl.join(),tx:pl[1],ty:pl[2]};}
  const work=G.club.open&&G.staff.find(s=>s.npc==id&&!s.dayOnly);
  a.wT-=dt;if(a.wT<=0){a.wT=2+Math.random()*4;if(!work||G.staff.find(s=>s.npc==id).role=='Cleaner'){const rx=id=='ares'?70:30;a.tx=a.hx+rint(-rx,rx);a.ty=a.hy+rint(-10,10);}}
  const dx=a.tx-a.x,dy=a.ty-a.y,l=Math.hypot(dx,dy);const sp=30*dt;
  if(l>1&&!(a.area==G.area&&Math.hypot(G.p.x-a.x,G.p.y-a.y)<14)){const nx=a.x+dx/l*Math.min(sp,l),ny=a.y+dy/l*Math.min(sp,l);a.x=nx;a.y=ny;a.moving=true;a.walk+=Math.min(sp,l);a.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');}else{a.moving=false;if(work)a.dir='down';}}}
function drawNPC(id,a,now){const D=NPCDEF[id],s=SPR[D.sheet];if(!s)return;ctx=X;if(LOOKS[id]){human(a.x,a.y,LOOKS[id],a.dir,a.walk,a.moving);return;}X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';shadow(a.x,a.y+1,id=='ares'||id=='rzel'?8:5);
 const hh=D.h;if(id=='ares'&&SPR.ares_side&&(a.dir=='left'||a.dir=='right')){const sd2=SPR.ares_side,fw=sd2.width/9,fh=sd2.height,ww=fw*hh/fh,k=a.moving?Math.floor(a.walk/3.5)%9:6;X.save();X.translate(a.x,0);if(a.dir=='left')X.scale(-1,1);X.drawImage(sd2,k*fw,0,fw,fh,-ww/2,a.y-hh+1,ww,hh);X.restore();return;}
 const row={down:0,up:1,left:2,right:3}[a.dir]||0,col=a.moving?[1,2,3,2][Math.floor(a.walk/5)%4]:0,fw=s.width/4,fh=s.height/4,ww=fw*hh/fh;X.drawImage(s,col*fw,row*fh,fw,fh,a.x-ww/2,a.y-hh+1,ww,hh);}
const LKC={};const lk=s=>LKC[s]||(LKC[s]=lookFromSeed(s));
const bubbles={};function say(id,t,d){bubbles[id]={t,d:d||3};}
// ambient pedestrians
let PEDS=[];function makePeds(){PEDS=[];const n={plaza:56,market:30,alleys:7}[G.area]||0;for(let i=0;i<n;i++){let x,y;for(let k=0;k<20;k++){x=rint(20,AREA.w-20);y=rint(310,AREA.h-110);if(G.area!='plaza')y=rint(240,380);if(!blocked(x,y))break;}PEDS.push({x,y,tx:x,ty:y,s:rint(1,99999),w:Math.random()*3});}}
function updatePeds(dt){for(const p of PEDS){p.w-=dt;if(p.w<=0){p.w=2+Math.random()*5;p.tx=clamp(p.x+rint(-60,60),20,AREA.w-20);p.ty=clamp(p.y+rint(-30,30),G.area=='plaza'?306:236,G.area=='plaza'?850:390);}
 const dx=p.tx-p.x,dy=p.ty-p.y,l=Math.hypot(dx,dy);p.mov=false;if(l>1){const nx=p.x+dx/l*18*dt,ny=p.y+dy/l*18*dt;if(!blocked(nx,ny)){p.x=nx;p.y=ny;p.mov=true;p.walk=(p.walk||0)+18*dt;p.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');}else p.w=0;}}}
// ---------- night simulation ----------
function decorStats(){let pts=0,hype=0,vip=0,bar=2;for(const it of G.club.items){const d=DECOR[it.k],m=1+0.5*(it.lvl-1);pts+=d.pts*m;hype+=(d.hype||0)*m;vip+=d.vip||0;bar+=d.bar||0;}return {pts,hype,vip,bar};}
let GUESTS=[],POPS=[],QUEUE=0;
function openClub(){if(G.club.open)return;if(G.time<1200){msg('The club opens at 8:00 PM. Prepare during the day!');return;}G.club.open=true;GUESTS=[];QUEUE=0;
 G.night={inc:{door:0,bar:0,dance:0,vip:0},guests:0,happy:0,fans0:G.fans,hype:20,doorT:0,spawnAcc:0};for(const k in BAKE)if(k.startsWith('club'))delete BAKE[k];msg('Neon Barn is OPEN! Guests are lining up.');}
function earn(kind,n,x,y,area){G.night.inc[kind]+=n;G.gold+=n;POPS.push({x,y,area,t:1.2,txt:'+'+n});}
function simNight(dm){const N=G.night,ds=decorStats();if(!N)return;
 const dj=bestStat('DJ'),target=clamp(15+dj*13+ds.hype+(G.club.clean-50)/5,0,100);N.hype+=(target-N.hype)*Math.min(1,dm*0.03);
 if(G.time<1650){N.spawnAcc+=dm*(0.05+G.fans/1500+ds.pts/600)*(0.6+N.hype/100);while(N.spawnAcc>=1){N.spawnAcc--;QUEUE++;}}
 if(QUEUE>12){QUEUE--;}
 const b=bestStat('Bouncer');N.doorT-=dm;if(QUEUE>0&&N.doorT<=0&&GUESTS.length<14+ds.vip+ds.bar){N.doorT=b?Math.max(1.5,7-b):12;QUEUE--;N.guests++;earn('door',10,CX+246,300,'plaza');
  GUESTS.push({x:240,y:340,s:rint(1,99999),plan:[...Array(rint(2,4))].map(()=>rpick(['bar','dance','dance','vip'])),st:'walk',tx:240,ty:300,t:0,mood:0.5+N.hype/250,leaving:false});pickGoal(GUESTS[GUESTS.length-1]);}
 const bt=bestStat('Bartender');let serve=dm*(bt?(0.08+bt*0.05):0.04);
 for(const g of GUESTS){if(g.st=='walk')continue;g.t-=dm;
  if(g.st=='bar'){if(serve>0&&G.inv.drink>0&&Math.random()<serve*3){serve-=0.3;G.inv.drink--;const p=15+(N.hype>60?5:0);earn('bar',Math.round(p*(G.club.clean<40?.7:1)),g.x,g.y-24,'club');g.mood+=0.1;g.t=Math.min(g.t,2);G.club.clean-=0.6;}else if(G.inv.drink<=0)g.mood-=dm*0.01;}
  if(g.st=='dance'&&Math.random()<dm*0.02*(dj?1:0.3)){earn('dance',Math.max(1,Math.round(N.hype/20)),g.x,g.y-24,'club');g.mood+=0.05;}
  if(g.st=='vip'&&Math.random()<dm*0.015){earn('vip',25,g.x,g.y-24,'club');g.mood+=0.1;}
  if(g.t<=0){if(!g.plan.length){g.leaving=true;g.st='walk';g.tx=240;g.ty=360;}else pickGoal(g);}}
 for(const g of GUESTS.filter(g=>g.leaving&&g.y>=350)){if(g.mood>0.7){G.fans++;N.happy++;}}GUESTS=GUESTS.filter(g=>!(g.leaving&&g.y>=350));
 G.club.clean=clamp(G.club.clean-GUESTS.length*dm*0.004+bestStat('Cleaner')*dm*0.03,0,100);}
function pickGoal(g){const want=g.plan.shift(),ds=decorStats();let w=want;if(w=='vip'&&ds.vip<=GUESTS.filter(o=>o.goal=='vip').length)w='dance';g.goal=w;g.st='walk';
 if(w=='bar'){g.tx=rint(20,110);g.ty=rint(90,100);}else if(w=='dance'){g.tx=rint(158,322);g.ty=rint(108,214);}else{const sofas=G.club.items.filter(i=>i.k=='sofa');const s=sofas.length?rpick(sofas):null;g.tx=s?s.tx*TS+16+rint(-6,6):410;g.ty=s?s.ty*TS+18:120;}}
function moveGuests(dt){for(const g of GUESTS){const dx=g.tx-g.x,dy=g.ty-g.y,l=Math.hypot(dx,dy),sp=40*dt;if(l>1){g.x+=dx/l*Math.min(sp,l);g.y+=dy/l*Math.min(sp,l);g.walk=(g.walk||0)+Math.min(sp,l);g.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');}else if(g.st=='walk'&&!g.leaving){g.st=g.goal;g.t=rint(20,50);}
  if(g.st=='dance'&&Math.random()<dt){g.tx=clamp(g.x+rint(-8,8),158,322);g.ty=clamp(g.y+rint(-6,6),108,214);}}}
// ---------- payout ----------
function endNight(){if(!G.club.open)return;G.club.open=false;for(const k in BAKE)if(k.startsWith('club'))delete BAKE[k];const N=G.night;G.nightsRun++;
 const inc=N.inc.door+N.inc.bar+N.inc.dance+N.inc.vip;openPanel('payout',{inc,N});}
function payWages(info){let paid=0;const lines=[];for(const s of [...G.staff]){if(G.gold>=s.wage||CHEAT.gold){G.gold-=s.wage;paid+=s.wage;s.morale=Math.min(100,(s.morale||70)+5);lines.push(s.name+' paid '+s.wage+'g');}
 else{s.morale=(s.morale||70)-40;if(s.morale<=0){G.staff=G.staff.filter(x=>x!==s);lines.push(s.name+' was not paid and QUIT!');}else lines.push(s.name+' NOT paid (morale '+s.morale+')');}}info.paid=paid;info.lines=lines;info.done=true;}
function sleep(){G.day++;G.time=360;G.club.open=false;G.night=null;GUESTS=[];QUEUE=0;
 const pip=G.staff.find(s=>s.dayOnly);G.club.clean=clamp(G.club.clean+25+(pip?50:0)+bestStat('Cleaner')*10,0,100);
 for(const id in NPCDEF){const R=relOf(id);if(R.engaged&&!R.married&&G.day>=R.wedDay){R.married=true;R.engaged=false;setTimeout(()=>dialog(id,"Today's the day! Rooftop, neon, everyone from the market... and you. I do. Forever.",'blush'),400);}}
 G.p.x=110;G.p.y=170;G.area='home';AREA=AREAS.home;genCands();for(const k in BAKE)delete BAKE[k];makePeds();snapCam();save(true);msg('Day '+G.day+'. Rise and shine, boss!');}
// ---------- interaction ----------
function front(){const d={up:[0,-12],down:[0,10],left:[-12,-4],right:[12,-4]}[G.p.dir];return [G.p.x+d[0],G.p.y+d[1]];}
function nearNPC(){for(const id in ACT){const a=ACT[id];if(a.area!=G.area)continue;if(Math.hypot(a.x-G.p.x,a.y-G.p.y)<22)return id;}return null;}
function nearAct(){const [fx,fy]=front();for(const a of AREA.acts)if(hit(a.r,fx,fy)||hit(a.r,G.p.x,G.p.y-4))return a;
 if(G.area=='plaza'&&hit([590,280,100,40],G.p.x,G.p.y)&&!G.club.open&&G.time>=1200)return {a:'open',label:'Open the club!'};return null;}
function prompt(){if(BUILD)return 'BUILD MODE';const n=nearNPC();if(n)return 'Talk to '+NPCDEF[n].name;const a=nearAct();if(a)return a.label;for(const e of AREA.exits)if(e.label&&Math.hypot(G.p.x-(e.r[0]+e.r[2]/2),G.p.y-(e.r[1]+e.r[3]/2))<40)return e.label;return null;}
function use(){if(UI)return;if(BUILD){buildAct('place');return;}const n=nearNPC();if(n){openTalk(n);return;}const a=nearAct();if(!a)return;const k=a.a;if(a.msg){msg(a.msg);return;}
 if(k=='tram')openPanel('tram');else if(k=='bed'){if(G.club.open){msg('The club is still open! Close it first (office or wait for 4 AM).');return;}openPanel('confirm',{q:'Sleep until tomorrow?',yes:()=>sleep()});}
 else if(k=='office')openPanel('office');else if(k=='open')openClub();else if(k=='rzelshop')openPanel('shop',{kind:'rzel'});else if(k=='supply')openPanel('shop',{kind:'supply'});else if(k=='hire')openPanel('hire');
 else if(k=='craft')openPanel('craft');else if(k.startsWith('bin:')){const i=+k.slice(4);if(G.bins.day!=G.day){G.bins={day:G.day,taken:[]};}if(G.bins.taken.includes(i)){msg('Already searched today.');return;}G.bins.taken.push(i);const r=Math.random();const it=r<0.55?'scrap':r<0.85?'ore':'drink';const n=it=='scrap'?rint(1,3):1;G.inv[it]+=n;msg('Found '+n+' '+ITEMS[it].name+'!');}
 else if(k=='djbooth')msg(bestStat('DJ')?'Your DJ is spinning. Hype: '+(G.night?Math.round(G.night.hype):0):'No DJ hired. Hype stays low. Hire one at the Market job terminal.');
 else if(k=='bar')msg('Drinks in stock: '+G.inv.drink+(bestStat('Bartender')?'':' (no bartender: slow service)'));}
// ---------- build mode ----------
let BUILD=null;
function buildCursor(){const [fx,fy]=front();return [Math.floor(fx/TS),Math.floor((fy-2)/TS)];}
function itemAt(tx,ty){return G.club.items.find(i=>ty==i.ty&&tx>=i.tx&&tx<i.tx+(i.k=='sofa'?2:1));}
function canPlace(k,tx,ty){const w=k=='sofa'?2:1;for(let i=0;i<w;i++){const x=(tx+i)*TS+8,y=ty*TS+12;if(tx+i<1||tx+i>28||ty<4||ty>20)return false;if(itemAt(tx+i,ty))return false;for(const r of AREAS.club.solids)if(hit(r,x,y))return false;if(y>320&&x>190&&x<290)return false;
  const onFloor=x>=150&&x<330&&y>=100&&y<220;if(onFloor&&k!='disco')return false;if(k=='disco'&&!onFloor)return false;}return true;}
function buildAct(a){const [tx,ty]=buildCursor();const it=itemAt(tx,ty);
 if(a=='place'){const k=BUILD.sel;if(!k){msg('Pick an item first.');return;}if((G.decor[k]||0)<=0){msg('You have no '+DECOR[k].name+'. Buy at Rzel\'s shop.');return;}if(!canPlace(k,tx,ty)){msg(k=='disco'?'Disco balls go over the dance floor.':"Can't place there.");return;}G.decor[k]--;G.club.items.push({k,tx,ty,lvl:1});msg('Placed '+DECOR[k].name+'.');}
 else if(a=='pick'){if(!it){msg('Nothing here.');return;}G.club.items=G.club.items.filter(i=>i!==it);G.decor[it.k]=(G.decor[it.k]||0)+1;msg('Picked up '+DECOR[it.k].name+'.');}
 else if(a=='up'){if(!it){msg('Stand facing an item to upgrade.');return;}if(it.lvl>=3){msg('Max level.');return;}const c=Math.max(80,DECOR[it.k].price)*it.lvl;if(G.gold<c&&!CHEAT.gold){msg('Upgrade costs '+c+'g.');return;}if(!CHEAT.gold)G.gold-=c;it.lvl++;msg(DECOR[it.k].name+' upgraded to Lv'+it.lvl+'!');}
 renderBuildBar();}
function drawItem(it,ghost){const x=it.tx*TS,y=it.ty*TS;ctx=X;if(ghost)X.globalAlpha=.55;const k=it.k;
 if(k=='lamp'){R(x+7,y-10,2,24,'#555');R(x+3,y-14,10,5,NEONS[(it.tx+it.ty)%6]);if(G.club.open){X.save();X.globalCompositeOperation='lighter';X.fillStyle='rgba(255,120,220,.25)';X.beginPath();X.arc(x+8,y-10,14,0,7);X.fill();X.restore();}}
 else if(k=='plant')plant(x+8,y+15);else if(k=='stool'){X.save();X.translate(x+8,y+14);X.scale(1.8,1.8);stool(0,0);X.restore();}else if(k=='speaker')speaker(x+1,y-12,26);else if(k=='sofa')sofa(x,y+2,32);else if(k=='disco'){discoBall(x+8,y-20);}
 else if(k=='sign'){R(x,y-14,16,22,'#3a3e46');E(x+2,y-12,12,8,'#ff7a3d');R(x+3,y-2,10,8,'#7a7e86');}
 if(it.lvl>1)for(let i=0;i<it.lvl-1;i++)R(x+1+i*4,y+13,3,2,'#ffe14f');X.globalAlpha=1;}
// ---------- camera, input ----------
function snapCam(){const vw=cv.width/K,vh=cv.height/K;cam.x=AREA.w<=vw?(AREA.w-vw)/2:clamp(G.p.x-vw/2,0,AREA.w-vw);cam.y=AREA.h<=vh?(AREA.h-vh)/2:clamp(G.p.y-vh/2-8,0,AREA.h-vh);}
function update(dt){const now=performance.now();if(fade>0){fade+=dt*4;if(fade>=1&&fadeTo){fadeTo();fadeTo=null;makePeds();fade=-1;}if(fade>=0&&fade<1)return;}if(fade<0){fade+=dt*4;if(fade>=0)fade=0;}
 for(const id in bubbles){bubbles[id].d-=dt;if(bubbles[id].d<=0)delete bubbles[id];}
 if(!UI&&!dlgOpen){const dm=dt*6*(CHEAT.speed?3:1);G.time+=dm;if(G.club.open){simNight(dm);}
  if(G.time>=1680){G.time=1680;if(G.club.open)endNight();else{msg('You crashed at 4 AM...');sleep();}}
  let vx=0,vy=0;if(keys.arrowleft||keys.a)vx--;if(keys.arrowright||keys.d)vx++;if(keys.arrowup||keys.w)vy--;if(keys.arrowdown||keys.s)vy++;
  if(vx||vy){const sp=70*dt*(CHEAT.speed?2:1)/Math.hypot(vx,vy);G.p.dir=Math.abs(vx)>Math.abs(vy)?(vx<0?'left':'right'):(vy<0?'up':'down');if(vx&&!vy)G.p.dir=vx<0?'left':'right';
   const nx=G.p.x+vx*sp,ny=G.p.y+vy*sp;if(!blocked(nx,G.p.y))G.p.x=nx;if(!blocked(G.p.x,ny))G.p.y=ny;G.p.walk=(G.p.walk||0)+sp;G.p.moving=true;}else G.p.moving=false;
  for(const e of AREA.exits)if(hit(e.r,G.p.x,G.p.y)){if(e.to=='club'&&!G.club.open&&false){}enterArea(e.to,e.at[0],e.at[1]);break;}
  if(BUILD&&G.area!='club'){BUILD=null;renderBuildBar();}}
 updateActors(dt);updatePeds(dt);moveGuests(dt);for(const p of POPS)p.t-=dt;POPS=POPS.filter(p=>p.t>0);
 const vw=cv.width/K,vh=cv.height/K;const tx=AREA.w<=vw?(AREA.w-vw)/2:clamp(G.p.x-vw/2,0,AREA.w-vw),ty=AREA.h<=vh?(AREA.h-vh)/2:clamp(G.p.y-vh/2-8,0,AREA.h-vh);cam.x+=(tx-cam.x)*Math.min(1,dt*8);cam.y+=(ty-cam.y)*Math.min(1,dt*8);}
// ---------- render ----------
function drawPlayer(){ctx=X;human(G.p.x,G.p.y,LOOKS.farmer,G.p.dir,G.p.walk||0,G.p.moving);return;const s=SPR.farmer_sheet;ctx=X;shadow(G.p.x,G.p.y+1,5);const row={down:0,up:1,left:2,right:3}[G.p.dir],col=G.p.moving?[1,2,3,2][Math.floor(G.p.walk/5)%4]:0;X.drawImage(s,col*48,row*72,48,72,G.p.x-8,G.p.y-23,16,24);}
function render(){const now=performance.now();X.setTransform(1,0,0,1,0,0);X.imageSmoothingEnabled=false;X.fillStyle='#0e0c1a';X.fillRect(0,0,cv.width,cv.height);
 const cx=Math.round(cam.x*K)/K,cy=Math.round(cam.y*K)/K;X.setTransform(K,0,0,K,-cx*K,-cy*K);X.imageSmoothingEnabled=false;{const B=bg(G.area);if(B.pixel){X.fillStyle=AREA.outer||'#2a1a10';X.fillRect(cam.x-50,cam.y-50,cv.width/K+100,cv.height/K+100);}X.imageSmoothingEnabled=!B.pixel;X.drawImage(B,0,0,AREA.w,AREA.h);}X.imageSmoothingEnabled=false;ctx=X;
 const objs=[{y:G.p.y,d:drawPlayer}];
 for(const id in ACT){const a=ACT[id];if(a.area==G.area)objs.push({y:a.y,d:()=>drawNPC(id,a,now)});}
 const vx0=cam.x-20,vx1=cam.x+cv.width/K+20,vy0=cam.y-10,vy1=cam.y+cv.height/K+40;const inV=(x,y)=>x>vx0&&x<vx1&&y>vy0&&y<vy1;
 for(const p of PEDS)if(inV(p.x,p.y))objs.push({y:p.y,d:()=>{ctx=X;human(p.x,p.y,lk(p.s),p.dir||'down',p.walk||0,p.mov);}});
 if(G.area=='club'){for(const it of G.club.items)objs.push({y:it.ty*TS+14,d:()=>drawItem(it)});for(const g of GUESTS)objs.push({y:g.y,d:()=>{ctx=X;const bob=g.st=='dance'?Math.round(Math.sin(now/150+g.s)):0;human(g.x,g.y+bob,lk(g.s),g.st=='dance'?((Math.floor(now/900+g.s)%4==0)?'left':'down'):(g.dir||'down'),g.walk||0,g.st=='walk');}});
  for(const s of G.staff)if(!s.npc&&G.club.open&&!s.dayOnly){const p={DJ:[226,48],Bartender:[40,58],Cleaner:[120+((now/40+s.seed)%200),280],Bouncer:[262,330]}[s.role];if(p)objs.push({y:p[1],d:()=>{ctx=X;human(p[0],p[1],lk(s.seed),'down',0,false);}});}}
 if(G.area=='plaza'&&G.club.open){for(let i=0;i<Math.min(QUEUE,10);i++){const qx=CX+262+i*14,qy=348+(i%2)*3;objs.push({y:qy,d:()=>{ctx=X;human(qx,qy,lk(5000+i+G.day*7),'left',0,false);}});}
  for(const s of G.staff)if(!s.npc&&s.role=='Bouncer')objs.push({y:334,d:()=>{ctx=X;human(CX+236,334,lk(s.seed),'down',0,false);}});}
 objs.sort((a,b)=>a.y-b.y).forEach(o=>o.d());
 if(BUILD){const [tx,ty]=buildCursor(),k=BUILD.sel,ok=k&&canPlace(k,tx,ty);X.strokeStyle=ok?'#7affb0':'#ff4f6a';X.lineWidth=1/K*2;X.strokeRect(tx*TS,ty*TS,(k=='sofa'?2:1)*TS,TS);if(k&&ok)drawItem({k,tx,ty,lvl:1},true);}
 if(isNight()&&G.area!='club'&&G.area!='home'){}
 // bubbles / pops in world
 X.font='bold 8px monospace';for(const p of POPS)if(p.area==G.area){X.fillStyle='#000';X.fillText(p.txt,p.x-6+.5,p.y-(1.2-p.t)*14+.5);X.fillStyle='#ffe14f';X.fillText(p.txt,p.x-6,p.y-(1.2-p.t)*14);}
 X.setTransform(DPR,0,0,DPR,0,0);
 for(const id in bubbles){const a=ACT[id];if(!a||a.area!=G.area)continue;const sx=(a.x-cx)*K/DPR,sy=(a.y-NPCDEF[id].h-4-cy)*K/DPR;bubbleUI(sx,sy,bubbles[id].t);}
 drawTags(cx,cy);drawHUD();if(fade){X.fillStyle='rgba(0,0,0,'+Math.min(1,Math.abs(fade))+')';X.fillRect(0,0,cssW,canH);}}
function bubbleUI(sx,sy,t){X.font='bold 12px monospace';const lines=[];let l='';for(const w of t.split(' ')){const tr=l?l+' '+w:w;if(X.measureText(tr).width>170&&l){lines.push(l);l=w;}else l=tr;}lines.push(l);
 const bw=Math.max(...lines.map(s=>X.measureText(s).width))+12,bh=lines.length*14+8;const bx=clamp(sx-bw/2,4,cssW-bw-4),by=Math.max(70,sy-bh-6);X.fillStyle='#2b1a0e';X.fillRect(bx-2,by-2,bw+4,bh+4);X.fillStyle='#fff8e8';X.fillRect(bx,by,bw,bh);X.fillStyle='#3b2414';lines.forEach((s,i)=>X.fillText(s,bx+6,by+15+i*14));}
function panelBox(x,y,w,h){X.fillStyle='#2b1a0e';X.fillRect(x,y,w,h);X.fillStyle='#8a5530';X.fillRect(x+2,y+2,w-4,h-4);X.fillStyle='#f2d8a0';X.fillRect(x+4,y+4,w-8,h-8);}
let MSG=[];function msg(t){MSG.push({t,d:3.2});if(MSG.length>3)MSG.shift();}
function drawHUD(){const sm=cssW<500;const f=sm?'bold 12px monospace':'bold 14px monospace';X.font=f;X.textBaseline='alphabetic';
 panelBox(6,6,sm?128:150,sm?50:56);X.fillStyle='#3b2414';X.fillText((isNight()?'Night ':'Day ')+G.day,14,24);X.fillText(fmtT(G.time),14,sm?40:42);X.fillStyle='#7a5a3a';X.font='11px monospace';X.fillText(AREA.name,14,sm?52:56-4);
 X.font=f;const gw=sm?110:130;panelBox(cssW-gw-6,6,gw,26);X.fillStyle='#e0a020';X.fillRect(cssW-gw+2,13,12,12);X.fillStyle='#3b2414';X.textAlign='right';X.fillText(G.gold+'g',cssW-14,24);
 panelBox(cssW-gw-6,34,gw,26);X.fillStyle='#3b2414';X.fillText('\u2605'+G.fans+' '+(sm?'':rankOf(G.fans)),cssW-14,52);X.textAlign='left';
 if(G.club.open&&G.night){const N=G.night,inc=N.inc.door+N.inc.bar+N.inc.dance+N.inc.vip;const w=sm?150:190,x=cssW-w-6,y=64;panelBox(x,y,w,64);X.font='bold 11px monospace';X.fillStyle='#3b2414';
  X.fillText('OPEN  in:'+GUESTS.length+' queue:'+QUEUE,x+8,y+18);X.fillText('Hype',x+8,y+33);X.fillStyle='#3a2a5a';X.fillRect(x+44,y+25,w-56,8);X.fillStyle='#ff4fd0';X.fillRect(x+44,y+25,(w-56)*N.hype/100,8);
  X.fillStyle='#3b2414';X.fillText('Clean',x+8,y+47);X.fillStyle='#3a2a5a';X.fillRect(x+44,y+39,w-56,8);X.fillStyle='#4fd060';X.fillRect(x+44,y+39,(w-56)*G.club.clean/100,8);X.fillStyle='#3b2414';X.fillText('Tonight +'+inc+'g',x+8,y+60);}
 const pr=prompt();if(pr&&!UI){X.font='bold 13px monospace';const tw=X.measureText((TOUCH?'USE: ':'E: ')+pr).width+16;panelBox(cssW/2-tw/2,canH-38,tw,28);X.fillStyle='#3b2414';X.fillText((TOUCH?'USE: ':'E: ')+pr,cssW/2-tw/2+8,canH-19);}
 X.font='bold 12px monospace';MSG.forEach((m,i)=>{m.d-=1/60;});MSG=MSG.filter(m=>m.d>0);MSG.forEach((m,i)=>{const tw=Math.min(cssW-12,X.measureText(m.t).width+14),y=canH-72-(MSG.length-1-i)*24;X.globalAlpha=Math.min(1,m.d*2);X.fillStyle='rgba(27,20,13,.85)';X.fillRect(6,y,tw,20);X.fillStyle='#ffe9b0';X.fillText(m.t,13,y+14);X.globalAlpha=1;});}
// ---------- DOM UI ----------
const $=id=>document.getElementById(id);let dlgOpen=false;
function closeUI(){UI=null;$('panel').classList.remove('show');document.body.classList.remove('shop');}
function openTalk(id){const R=relOf(id);let t;if(R.talkDay!=G.day){R.talkDay=G.day;addRel(id,20);}t=talkLine(id);dialog(id,t,heartsOf(id)>=6?'blush':'happy',true);}
function dialogOld(id,t,mood,choices){dlgOpen=true;const p=portraitOf(id,mood);const d=$('dlg');let img='';if(p&&ASSETS[p])img='<img src="'+ASSETS[p]+'">';else{img='<img src="'+bustCanvas(LOOKS[id],240).toDataURL()+'">';}
 d.innerHTML='<div class="pt">'+img+'<b>'+NPCDEF[id].name+'</b><span class="hs">'+'\u2665'.repeat(heartsOf(id))+'<i>'+'\u2665'.repeat(Math.max(0,heartCap(id)-heartsOf(id)))+'</i></span></div><div class="tx">'+t+'</div><div class="ch">'+(choices?'<button data-g="talk">Talk</button><button data-g="gift">Gift</button>'+(id=='rzel'&&!isNight()?'<button data-g="shop">Shop</button>':'')+(G.staff.find(s=>s.npc==id)?'':'<button data-g="hire">Hire?</button>'):'')+'<button data-g="bye">Bye</button></div>';
 d.classList.add('show');d.dataset.id=id;}
function closeDlg(){dlgOpen=false;$('dlg').classList.remove('show');if(window.vnClose)vnClose();}
$('dlg').addEventListener('click',e=>{const g=e.target.dataset.g;if(!g)return;const id=$('dlg').dataset.id;
 if(g=='bye')closeDlg();else if(g=='talk')dialog(id,talkLine(id),'happy',true);else if(g=='shop'){closeDlg();openPanel('shop',{kind:'rzel'});}else if(g=='hire'){closeDlg();openPanel('hire');}
 else if(g=='gift'){const its=Object.keys(ITEMS).filter(k=>G.inv[k]>0);if(!its.length){dialog(id,"Empty-handed? That's okay. Your company is the gift.",'happy',true);return;}
  $('dlg').querySelector('.ch').innerHTML=its.map(k=>'<button data-gi="'+k+'">'+ITEMS[k].name+' ('+G.inv[k]+')</button>').join('')+'<button data-g="bye">Cancel</button>';}
 const gi=e.target.dataset.gi;if(gi){const [t,m]=giveGift(id,gi);dialog(id,t,m,true);}});
$('dlg').addEventListener('click',e=>{const gi=e.target.dataset.gi;},true);
function openPanel(kind,data){UI=kind;closeDlg();PD=data||{};renderPanel();$('panel').classList.add('show');document.body.classList.add('shop');}
let PD={};
function stars(n){return '\u2605'.repeat(n)+'<i>'+'\u2605'.repeat(5-n)+'</i>';}
function renderPanel(){const p=$('panel');let h='';const B=(a,l,dis)=>'<button data-p="'+a+'"'+(dis?' disabled':'')+'>'+l+'</button>';const k=UI;
 if(k=='shop'){const rz=PD.kind=='rzel';h='<h3>'+(rz?"Rzel's Gear Shop":'Supply Store')+'</h3><div class="info">Gold: '+G.gold+'g</div>';
  if(rz){h+='<div class="sec">Club decor</div>'+Object.keys(DECOR).filter(d=>DECOR[d].price).map(d=>'<div class="ln">'+DECOR[d].name+' <small>(own '+(G.decor[d]||0)+')</small> '+B('buyd:'+d,DECOR[d].price+'g')+'</div>').join('')+'<div class="sec">Special</div>'+['bouquet','pendant'].map(i=>'<div class="ln">'+ITEMS[i].name+' <small>(own '+G.inv[i]+')</small> '+B('buyi:'+i,ITEMS[i].buy+'g')+'</div>').join('');}
  else{h+='<div class="sec">Stock</div>'+['drink','chocolate'].map(i=>'<div class="ln">'+ITEMS[i].name+' <small>(own '+G.inv[i]+')</small> '+B('buyi:'+i,ITEMS[i].buy+'g')+(i=='drink'?B('buyi10:'+i,'x10 '+ITEMS[i].buy*10+'g'):'')+'</div>').join('')+'<div class="sec">Sell resources</div>'+['scrap','ore'].map(i=>'<div class="ln">'+ITEMS[i].name+' x'+G.inv[i]+' '+B('sell:'+i,'Sell all ('+ITEMS[i].sell+'g ea)',!G.inv[i])+'</div>').join('');}}
 else if(k=='hire'){h='<h3>Hire Office</h3><div class="info">Gold: '+G.gold+'g &middot; signing fee = 1 wage &middot; wages paid after each night</div><div class="sec">Candidates today</div>'+
  G.cands.map((c,i)=>'<div class="ln"><b>'+c.name+'</b> '+c.role+(c.dayOnly?' (day only)':'')+' '+stars(c.stat)+' <small>'+c.wage+'g/shift</small> '+B('hire:'+i,'Hire',G.staff.length>=6)+'</div>').join('')+
  '<div class="sec">Your staff ('+G.staff.length+'/6)</div>'+(G.staff.length?G.staff.map((s,i)=>'<div class="ln"><b>'+s.name+'</b> '+s.role+' '+stars(s.stat)+' <small>'+s.wage+'g &middot; morale '+(s.morale||70)+'</small> '+B('fire:'+i,'Fire')+'</div>').join(''):'<div class="info">No staff yet. Hire a DJ, Bouncer, Bartender and Cleaner!</div>');}
 else if(k=='tram'){h='<h3>Tram</h3><div class="info">Where to, boss?</div>'+[['home','Resort Home',110,240],['plaza','Central Plaza',770,762],['market','Neon Market',720,430],['alleys','Back Alleys',600,330]].map(t=>B('tram:'+t.join(','),t[1],t[0]==G.area)).join('');}
 else if(k=='office'){const ds=decorStats();h='<h3>Office</h3><div class="info">Fans: '+G.fans+' ('+rankOf(G.fans)+') &middot; Decor: '+Math.round(ds.pts)+' &middot; VIP seats: '+ds.vip+' &middot; Clean: '+Math.round(G.club.clean)+'% &middot; Drinks: '+G.inv.drink+'</div>'+
  '<div class="info">Staff: '+ROLES.map(r=>r+' '+(bestStat(r)?stars(bestStat(r)):'-')).join(' &middot; ')+'</div>'+(G.club.open?B('close','Close club early & pay staff'):B('open','Open club tonight',G.time<1200))+B('build','Build / decorate mode',G.club.open)+(G.time<1200?'<div class="info">Doors open at 8:00 PM.</div>':'');}
 else if(k=='craft'){h='<h3>Workbench</h3><div class="info">Scrap '+G.inv.scrap+' &middot; Ore '+G.inv.ore+'</div><div class="ln">Scrap Neon Sign (3 scrap + 2 ore) '+B('craft:sign','Craft',G.inv.scrap<3||G.inv.ore<2)+'</div>';}
 else if(k=='confirm'){h='<h3>'+PD.q+'</h3>'+B('yes','Yes')+B('x','No');}
 else if(k=='payout'){const P=PD,N=P.N;h='<h3>Shift Report - Night '+G.day+'</h3><div class="ln">Door fees <b>'+N.inc.door+'g</b></div><div class="ln">Bar <b>'+N.inc.bar+'g</b></div><div class="ln">Dance tips <b>'+N.inc.dance+'g</b></div><div class="ln">VIP <b>'+N.inc.vip+'g</b></div><div class="ln">Guests '+N.guests+' &middot; happy '+N.happy+' &middot; fans +'+(G.fans-N.fans0)+' ('+rankOf(G.fans)+')</div><div class="sec">Wages</div>'+
  (G.staff.length?G.staff.map(s=>'<div class="ln">'+s.name+' ('+s.role+') '+s.wage+'g</div>').join(''):'<div class="info">No staff.</div>')+
  (P.done?'<div class="sec">Result</div>'+P.lines.map(l=>'<div class="ln">'+l+'</div>').join('')+'<div class="info"><b>Income '+P.inc+'g - wages '+P.paid+'g = net '+(P.inc-P.paid)+'g</b></div>'+B('gohome','Go home & sleep'):B('pay','Pay wages'));}
 else if(k=='menu'){h='<h3>Menu</h3>'+B('save','Save')+B('load','Load')+B('social','Social')+B('inv','Inventory')+B('help','Help')+B('dev','DEV')+B('ctl','Controls')+B('x','Close');}
 else if(k=='social'){h='<h3>Social</h3>'+Object.keys(NPCDEF).map(id=>{const R=relOf(id);return '<div class="soc"><b>'+NPCDEF[id].name+'</b> <span class="hs">'+'\u2665'.repeat(heartsOf(id))+'<i>'+'\u2665'.repeat(heartCap(id)-heartsOf(id))+'</i></span> <small>'+statusOf(id)+(R.talkDay==G.day?' &middot; talked today':'')+'</small><br><small>Gifts: '+(Object.keys(R.known).map(g=>ITEMS[g].name+' ('+R.known[g]+')').join(', ')||'?')+'</small></div>';}).join('')+B('x','Close');}
 else if(k=='inv'){h='<h3>Inventory</h3>'+Object.keys(ITEMS).map(i=>'<div class="ln">'+ITEMS[i].name+': '+G.inv[i]+'</div>').join('')+'<div class="sec">Decor (unplaced)</div>'+Object.keys(DECOR).map(d=>'<div class="ln">'+DECOR[d].name+': '+(G.decor[d]||0)+'</div>').join('')+B('x','Close');}
 else if(k=='help'){h='<h3>How to play</h3><div class="info">You own the Neon Barn on Central Plaza.<br>DAY: buy drinks (Supply) and decor (Rzel), hire staff at the Market job terminal, decorate in Build mode (club office or B key).<br>NIGHT 8PM-4AM: open the club (office or the door). Guests queue, pay at the door, drink, dance, chill in VIP. Hype comes from your DJ + speakers; keep it clean.<br>4AM: pay wages, then sleep at home (tram).<br>Keys: WASD/arrows move, E/Space use, B build, M menu, R social, ` DEV.</div>'+B('x','Close');}
 p.innerHTML=h;}
$('panel').addEventListener('click',e=>{const a=e.target.dataset.p;if(!a)return;const [c,v]=a.split(':');
 if(c=='x'){closeUI();return;}
 if(c=='buyd'){const d=DECOR[v];if(G.gold<d.price&&!CHEAT.gold)return msg('Not enough gold.');if(!CHEAT.gold)G.gold-=d.price;G.decor[v]=(G.decor[v]||0)+1;msg('Bought '+d.name+'. Place it in Build mode.');}
 else if(c=='buyi'||c=='buyi10'){const n=c=='buyi'?1:10,cost=ITEMS[v].buy*n;if(G.gold<cost&&!CHEAT.gold)return msg('Not enough gold.');if(!CHEAT.gold)G.gold-=cost;G.inv[v]+=n;msg('Bought '+n+' '+ITEMS[v].name+'.');}
 else if(c=='sell'){const g=G.inv[v]*ITEMS[v].sell;G.gold+=g;G.inv[v]=0;msg('Sold for '+g+'g.');}
 else if(c=='hire'){const cd=G.cands[+v];if(G.gold<cd.wage&&!CHEAT.gold)return msg('Not enough gold for the signing fee.');if(!CHEAT.gold)G.gold-=cd.wage;cd.morale=70;G.staff.push(cd);G.cands.splice(+v,1);msg('Hired '+cd.name+' as '+cd.role+'!');if(cd.npc)setTimeout(()=>dialog(cd.npc,{ares:"You got it, boss. Nobody gets in without my say-so.",rzel:"DJ Rzel in the house! Your crowd won't know what hit them.",mabel:"I'll keep the drinks flowing, dear. And the napkins.",pip:"YES! I'll sweep SO good! Daytime only, Grandma said."}[cd.npc],'happy'),100);}
 else if(c=='fire'){const s=G.staff[+v];G.staff.splice(+v,1);msg(s.name+' let go.');}
 else if(c=='tram'){const t=v.split(',');closeUI();enterArea(t[0],+t[2],+t[3]);return;}
 else if(c=='open'){closeUI();openClub();return;}else if(c=='close'){closeUI();G.time=Math.max(G.time,1500);endNight();return;}
 else if(c=='build'){closeUI();BUILD={sel:Object.keys(G.decor).find(k=>G.decor[k]>0)||null};renderBuildBar();return;}
 else if(c=='craft'){G.inv.scrap-=3;G.inv.ore-=2;G.decor.sign=(G.decor.sign||0)+1;msg('Crafted a Scrap Neon Sign!');}
 else if(c=='yes'){const f=PD.yes;closeUI();f&&f();return;}
 else if(c=='pay'){payWages(PD);}
 else if(c=='gohome'){closeUI();sleep();return;}
 else if(c=='save'){save();}else if(c=='load'){closeUI();load();return;}else if(c=='social'){UI='social';}else if(c=='inv'){UI='inv';}else if(c=='help'){UI='help';}else if(c=='dev'){closeUI();toggleCheats();return;}else if(c=='ctl'){document.body.classList.toggle('hidectl');closeUI();return;}
 renderPanel();});
function renderBuildBar(){const b=$('buildbar');if(!BUILD){b.classList.remove('show');document.body.classList.remove('build');return;}b.classList.add('show');document.body.classList.add('build');
 b.innerHTML=Object.keys(DECOR).map(k=>'<button data-b="sel:'+k+'"'+(BUILD.sel==k?' class="on"':'')+'>'+DECOR[k].name+' x'+(G.decor[k]||0)+'</button>').join('')+'<button data-b="place">Place</button><button data-b="pick">Pick up</button><button data-b="up">Upgrade</button><button data-b="done">Done</button>';}
$('buildbar').addEventListener('click',e=>{const a=e.target.dataset.b;if(!a)return;if(a.startsWith('sel:'))BUILD.sel=a.slice(4);else if(a=='done'){BUILD=null;}else buildAct(a);renderBuildBar();});
// ---------- DEV menu ----------
let cheatTab='char',cheatNpc='rzel';
function toggleCheats(){const el=$('cheat');el.classList.toggle('show');if(el.classList.contains('show')){UI='cheat';renderCheats();}else if(UI=='cheat')UI=null;}
function cheatAct(a){const p=a.split(':');
 if(p[0]=='tab')cheatTab=p[1];else if(a=='close'){toggleCheats();return;}else if(p[0]=='tog')CHEAT[p[1]]=!CHEAT[p[1]];else if(p[0]=='npc')cheatNpc=p[1];
 else if(p[0]=='hearts'){const R=relOf(cheatNpc),n=+p[1];if(NPCDEF[cheatNpc].dateable&&n>8)R.dating=true;if(NPCDEF[cheatNpc].dateable&&n>10){R.married=true;}R.pts=Math.min(heartCap(cheatNpc),n)*100;}
 else if(p[0]=='status'){const R=relOf(cheatNpc);R.dating=p[1]!='friend';R.engaged=p[1]=='engaged';R.married=p[1]=='married';if(R.engaged)R.wedDay=G.day+3;}
 else if(a=='heart')addRel(cheatNpc,100);else if(p[0]=='tp'){if($('cheat').classList.contains('show'))toggleCheats();const T={home:[110,240],plaza:[640,340],club:[240,300],market:[400,260],alleys:[300,260]}[p[1]];enterArea(p[1],T[0],T[1],true);makePeds();return;}
 else if(a=='me2npc'){if($('cheat').classList.contains('show'))toggleCheats();const o=ACT[cheatNpc];if(o&&o.area){enterArea(o.area,o.x,o.y+16,true);makePeds();}}
 else if(a=='gold')G.gold+=1000;else if(a=='gold10k')G.gold+=10000;else if(p[0]=='item')G.inv[p[1]]=(G.inv[p[1]]||0)+(+p[2]);else if(p[0]=='decor')G.decor[p[1]]=(G.decor[p[1]]||0)+1;
 else if(p[0]=='hour'){G.time=+p[1];for(const k in BAKE)delete BAKE[k];}else if(a=='h1'){G.time=Math.min(G.time+60,1679);for(const k in BAKE)delete BAKE[k];}else if(a=='sleep'){toggleCheats();if(G.club.open)endNight();else sleep();return;}else if(p[0]=='day'){G.day=Math.max(1,G.day+(+p[1]));genCands();}
 else if(a=='spawn'){if(!G.club.open)msg('Open the club first.');else QUEUE+=10;}else if(p[0]=='hype'){if(G.night)G.night.hype=+p[1];}else if(a=='clean')G.club.clean=100;else if(a=='fans')G.fans+=50;
 else if(a=='skipnight'){G.time=Math.max(G.time,1200);for(const k in BAKE)delete BAKE[k];openClub();}else if(a=='skippay'){toggleCheats();if(!G.club.open){G.time=Math.max(G.time,1200);openClub();}G.time=1680;endNight();return;}
 else if(a=='reset'){if(confirm('Reset save?')){localStorage.removeItem(SAVE_KEY);newGame();enterArea('home',120,200,true);}}
 renderCheats();}
function renderCheats(){const B=(a,l,on)=>'<button data-a="'+a+'"'+((on||(a.startsWith('tog:')&&CHEAT[a.slice(4)]))?' class="on"':'')+'>'+l+'</button>';const S=t=>'<div class="sec">'+t+'</div>';
 const tabs=[['char','Character'],['item','Item/Money'],['time','Time'],['club','Club']];let h='<h3>DEV MENU <button data-a="close">X</button></h3><div class="tabs">'+tabs.map(t=>'<button data-a="tab:'+t[0]+'"'+(cheatTab==t[0]?' class="sel"':'')+'>'+t[1]+'</button>').join('')+'</div>';
 if(cheatTab=='char'){const R=relOf(cheatNpc);h+=S('NPC')+Object.keys(NPCDEF).map(id=>B('npc:'+id,NPCDEF[id].name,cheatNpc==id)).join('')+'<div class="info">'+NPCDEF[cheatNpc].name+': '+heartsOf(cheatNpc)+'/'+heartCap(cheatNpc)+' hearts &middot; '+statusOf(cheatNpc)+'</div>'+S('Set hearts')+[0,2,4,6,8,10,12,14].filter(n=>NPCDEF[cheatNpc].dateable||n<=10).map(n=>B('hearts:'+n,n+'\u2665')).join('')+B('heart','+1\u2665');
  if(NPCDEF[cheatNpc].dateable)h+=S('Status')+B('status:friend','Friend',!R.dating)+B('status:dating','Dating',R.dating&&!R.engaged&&!R.married)+B('status:engaged','Engaged',R.engaged)+B('status:married','Married',R.married);
  h+=S('Move')+B('me2npc','Me to NPC')+B('tog:noclip','Noclip')+B('tog:speed','Speed x2')+S('Teleport me')+['home','plaza','club','market','alleys'].map(n=>B('tp:'+n,AREAS[n].name)).join('');}
 else if(cheatTab=='item'){h+=S('Money')+B('gold','+1000g')+B('gold10k','+10000g')+B('tog:gold','Inf gold')+S('Items')+Object.keys(ITEMS).map(k=>'<span class="it">'+ITEMS[k].name+' ('+G.inv[k]+') '+B('item:'+k+':1','+1')+B('item:'+k+':10','+10')+'</span>').join('')+S('Decor')+Object.keys(DECOR).map(k=>B('decor:'+k,'+'+DECOR[k].name+' ('+(G.decor[k]||0)+')')).join('');}
 else if(cheatTab=='time'){h+='<div class="info">Day '+G.day+' &middot; '+fmtT(G.time)+'</div>'+S('Set hour')+[[360,'6am'],[600,'10am'],[900,'3pm'],[1140,'7pm'],[1190,'7:50pm'],[1200,'8pm'],[1440,'12am'],[1660,'3:40am']].map(t=>B('hour:'+t[0],t[1])).join('')+B('h1','+1h')+S('Day')+B('sleep','Skip day (sleep)')+B('day:1','Day +1')+B('day:-1','Day -1')+S('Danger')+B('reset','Reset save');}
 else{h+='<div class="info">'+(G.club.open?'OPEN - guests '+GUESTS.length+', queue '+QUEUE+', hype '+Math.round(G.night.hype):'Closed')+' &middot; fans '+G.fans+'</div>'+S('Night')+B('skipnight','Skip to night & open')+B('skippay','Skip to payout')+S('Guests')+B('spawn','Spawn 10 guests')+S('Hype')+[0,50,100].map(n=>B('hype:'+n,'Hype '+n)).join('')+S('Other')+B('clean','Clean 100%')+B('fans','+50 fans');}
 $('cheat').innerHTML=h;$('cheatBadge').classList.toggle('show',Object.values(CHEAT).some(v=>v));}
$('cheat').addEventListener('click',e=>{const a=e.target.dataset.a;if(a)cheatAct(a);});
// ---------- input ----------
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
 if(k=='`'||k=='f2'){toggleCheats();return;}if(k=='escape'){if($('cheat').classList.contains('show'))toggleCheats();else if(dlgOpen)closeDlg();else if(UI&&UI!='payout')closeUI();else if(BUILD){BUILD=null;renderBuildBar();}return;}
 if(UI||dlgOpen)return;keys[k]=true;if(k=='e'||k==' '||k=='enter')use();else if(k=='m')openPanel('menu');else if(k=='r')openPanel('social');else if(k=='b'){if(G.area=='club'&&!G.club.open){BUILD=BUILD?null:{sel:Object.keys(G.decor).find(q=>G.decor[q]>0)||null};renderBuildBar();}else msg('Build mode: inside the club, while closed.');}
 else if(k=='p'&&BUILD)buildAct('pick');else if(k=='u'&&BUILD)buildAct('up');});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
function bindTouch(){document.querySelectorAll('[data-d]').forEach(el=>{const k=el.dataset.d;const on=e=>{e.preventDefault();keys[k]=true;el.classList.add('on');},off=e=>{e.preventDefault();keys[k]=false;el.classList.remove('on');};el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off);el.addEventListener('touchcancel',off);el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);});
 const tap=(id,f)=>{const el=$(id);el.addEventListener('touchstart',e=>{e.preventDefault();f();},{passive:false});el.addEventListener('click',f);};
 tap('bUse',()=>use());tap('bBuild',()=>{if(G.area=='club'&&!G.club.open){BUILD=BUILD?null:{sel:Object.keys(G.decor).find(q=>G.decor[q]>0)||null};renderBuildBar();}else msg('Build mode: inside the club, while closed.');});tap('bSoc',()=>openPanel('social'));tap('menuBtn',()=>openPanel('menu'));
 tap('ctlBtn',()=>document.body.classList.remove('hidectl'));}
function resize(){DPR=Math.min(3,window.devicePixelRatio||1);cssW=innerWidth;cssH=innerHeight;TOUCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;document.body.classList.toggle('touch',TOUCH);
 const portrait=cssH>cssW;canH=(TOUCH&&portrait&&!document.body.classList.contains('hidectl'))?Math.round(cssH-150):cssH;document.documentElement.style.setProperty('--ch',canH+'px');
 cv.style.width=cssW+'px';cv.style.height=canH+'px';cv.width=Math.round(cssW*DPR);cv.height=Math.round(canH*DPR);
 K=(TOUCH&&portrait)?Math.max(2,Math.round(cv.width/196)):Math.max(2,Math.round(3*DPR*Math.min(1,Math.max(cssW/900,0.67))));if(AREA)snapCam();}
addEventListener('resize',resize);
// ---------- boot ----------
let last=performance.now();
function loop(t){const dt=Math.min(0.05,(t-last)/1000);last=t;try{update(dt);render();}catch(e){console.error(String(e&&e.stack||e));}requestAnimationFrame(loop);}
window.NB={get G(){return G},closeDlg,use,openClub,endNight,payWages,sleep,openPanel,closeUI,enterArea,cheatAct,simNight,get GUESTS(){return GUESTS},get QUEUE(){return QUEUE},set QUEUE(v){QUEUE=v},renderPanel,get PD(){return PD},buildAct,get BUILD(){return BUILD},set BUILD(v){BUILD=v;renderBuildBar();},dialog,openTalk,update,render,snapCam,makePeds};
let nl=0;const AK=Object.keys(ASSETS);for(const k of AK){const im=new Image();im.onload=()=>{SPR[k]=im;if(++nl==AK.length)boot();};im.src=ASSETS[k];}
function boot(){$('ver').textContent=VERSION;bindTouch();resize();newGame();AREA=AREAS.home;if(localStorage.getItem(SAVE_KEY))load();else{enterArea('home',120,200,true);msg(TOUCH?'Welcome to the Neon Barn, boss! Tap \u2630 for menu.':'Welcome to the Neon Barn, boss! Press M for menu / help.');}makePeds();snapCam();window.READY=true;requestAnimationFrame(loop);}
