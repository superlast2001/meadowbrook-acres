from cut5 import *
import os
os.makedirs('out41',exist_ok=True)
def section(box,nexp,name,splits=None):
  x0,y0,x1,y1=box;fg,a=fgmask(box);lab,n=nd.label(fg,structure=np.ones((3,3)));sz=nd.sum(fg,lab,range(1,n+1));objs=nd.find_objects(lab)
  keep=np.zeros_like(fg);chm=a.max(2)-a.min(2)
  for i,s in enumerate(objs):
    h=s[0].stop-s[0].start;w=s[1].stop-s[1].start;m=lab[s]==i+1
    if min(h,w)<=4 and max(h,w)>20: continue
    if sz[i]<12: continue
    mc=chm[s][m].mean()
    if s[0].stop<=26 and (mc<40 or sz[i]<80): continue   # header label row
    if s[0].start>=y1-y0-30 and mc<40 and w>30: continue  # bottom labels
    if mc<25 and sz[i]<400: continue  # gray specks/lines
    keep[s]|=m
  lc=keep&(a[...,2]-a[...,0]>12)
  hr=nd.uniform_filter1d(lc.astype(float),25,axis=1)>0.9;vr=nd.uniform_filter1d(lc.astype(float),25,axis=0)>0.9
  line=nd.binary_dilation(hr|vr,iterations=1)&lc;keep&=~line
  lab2,n2=nd.label(keep,structure=np.ones((3,3)));sz2=nd.sum(keep,lab2,range(1,n2+1));ob2=nd.find_objects(lab2);keep&=np.isin(lab2,[i+1 for i,v in enumerate(sz2) if v>=12 and ob2[i][0].stop>26])
  cols=keep.sum(0);segs=[];ins=False
  for x,v in enumerate(list(cols)+[0]):
    if v>0 and not ins:s0=x;ins=True
    if v==0 and ins:segs.append([s0,x,int(cols[s0:x].sum())]);ins=False
  big=max(s[2] for s in segs);figs=[]
  for s in segs:
    if s[2]>big*0.25 or not figs: figs.append(s[:2])
    else:
      if s[0]-figs[-1][1]<14 or True: figs[-1][1]=s[1]
  if splits:
    figs=[]
    for a0,a1 in zip([0]+splits,splits+[keep.shape[1]]):
      c=np.where(keep[:,a0:a1].any(0))[0]
      if len(c):figs.append([a0+c[0],a0+c[-1]+1])
  print(name,len(figs),figs)
  out=[]
  for k,(a0,a1) in enumerate(figs):
    im=rgba(a[:,a0:a1],keep[:,a0:a1].copy());bb=im.getbbox();im=im.crop((bb[0],0,bb[2],im.height))
    out.append((im,(x0+a0+bb[0],y0,x0+a0+bb[2],y1)))
  return out
