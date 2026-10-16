from cut6 import *
names={'dir':['front','right','back','left'],'walk':[f'w{i}' for i in range(7)],'emo':['idle','smile','blush','angry','surprised','happy','sit']}
R={}
for nm,b,sp in (('dir',(20,846,416,978),[100,199,297]),('walk',(420,846,922,978),None),('emo',(938,846,1528,978),[73,154,233,316,393,456])):
  R[nm]=section(b,0,nm,sp)
# strips (shared baseline: full section height)
for nm,L in R.items():
  cw=max(i.width for i,_ in L)+6;H=L[0][0].height;st=Image.new('RGBA',(cw*len(L),H))
  for k,(i,_) in enumerate(L):st.alpha_composite(i,(k*cw+(cw-i.width)//2,0));i.save(f'out41/ch_{names[nm][k]}.png')
  st.save(f'out41/strip_{nm}.png');print(nm,st.size,cw)
# contact sheet: source (4x) vs cut on checker (4x)
rows=[]
for nm,L in R.items():
  for k,(i,bx) in enumerate(L):
    src=SH.crop((bx[0]-6,bx[1],bx[2]+6,bx[3])).resize(((bx[2]-bx[0]+12)*4,(bx[3]-bx[1])*4),Image.NEAREST)
    ck=Image.new('RGBA',(i.width+12,i.height),(255,0,255,255));ck.alpha_composite(i,(6,0));ck=ck.resize((ck.width*4,ck.height*4),Image.NEAREST)
    rows.append((names[nm][k],src,ck))
from PIL import ImageDraw
W=max(r[1].width+r[2].width for r in rows)+40;per=6
import math
cols=3;cellW=W;cellH=max(r[1].height for r in rows)+24
for p in range(math.ceil(len(rows)/per)):
  pg=rows[p*per:(p+1)*per];sheet=Image.new('RGB',(cellW*cols,cellH*math.ceil(len(pg)/cols)),(240,240,240));d=ImageDraw.Draw(sheet)
  for j,(n,s,c) in enumerate(pg):
    x=(j%cols)*cellW;y=(j//cols)*cellH;d.text((x+4,y+4),n+'  (left: sheet 4x | right: cut 4x on magenta)',fill='black');sheet.paste(s,(x+4,y+20));sheet.paste(c.convert('RGB'),(x+s.width+16,y+20))
  sheet.save(f'out41/contact_{p}_{__import__("os").environ.get("T","x")}.png');print('contact',p,sheet.size)
