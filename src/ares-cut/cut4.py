from cut2 import *
def band(b,merge,splits=None):
  c=cut(b,minsz=30,mxb=40,holes=True);a=np.array(c);fg=a[...,3]>100;cols=fg.sum(0);gs=[];ins=False
  for x,v in enumerate(list(cols)+[0]):
    if v>0 and not ins:s=x;ins=True
    if v==0 and ins:gs.append([s,x]);ins=False
  gs=[g for g in gs if g[1]-g[0]>2];m=[]
  for g in gs:
    if m and g[0]-m[-1][1]<merge:m[-1][1]=g[1]
    else:m.append(g)
  if splits:
    sp=[]
    for g in splits:
      cand=[x for x in range(g-40,g+40) if 0<=x<len(cols) and cols[x]==0];sp.append(min(cand,key=lambda x:abs(x-g)) if cand else g)
    splits=sp;print('splits',sp)
  if splits:m=[[a0,a1] for a0,a1 in zip([0]+splits,splits+[c.width])]
  out=[]
  for g in m:
    im=c.crop((g[0],0,g[1],c.height));A=np.array(im);f=A[...,3]>100;lab,n=nd.label(f,structure=np.ones((3,3)))
    if n:
      sz=nd.sum(f,lab,range(1,n+1));big=sz.argmax()+1;Ai=A[...,:3].astype(int);chm=Ai.max(2)-Ai.min(2)
      for i in range(1,n+1):
        if i==big:continue
        mc=chm[lab==i].mean()
        if mc<40 or sz[i-1]<15: A[lab==i,3]=0
    im=Image.fromarray(A);bb=im.getbbox();out.append(im.crop((bb[0],0,bb[2],im.height)))
  return out,c
# need absolute crop offset: cut() crops to bbox, so use cut on full band but fix bottom alignment by padding: compute separately
for nm,b,mg in (('dir',(458,678,936,797),20),('walk',(954,683,1516,806),12),('emo',(458,860,1518,975),45)):
  L,c=band(b,mg,{'emo':[120,280,420,560,700,840],'walk':[94,188,282,376,470]}.get(nm));print(nm,c.size,[i.size for i in L])
  for k,i in enumerate(L):i.save(f'ch_{nm}{k}.png')

import glob
for nm in ('dir','walk','emo'):
  fs=sorted(glob.glob(f'ch_{nm}*.png'),key=lambda f:int(f[len('ch_'+nm):-4]));ims=[Image.open(f) for f in fs]
  cw=max(i.width for i in ims)+4;ch=max(i.height for i in ims);st=Image.new('RGBA',(cw*len(ims),ch))
  for k,i in enumerate(ims):st.alpha_composite(i,(k*cw+(cw-i.width)//2,ch-i.height))
  st.save(f'strip_{nm}.png');print(nm,st.size,cw)
