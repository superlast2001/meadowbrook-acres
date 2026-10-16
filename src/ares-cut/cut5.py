from PIL import Image,ImageFilter;import numpy as np;from scipy import ndimage as nd
SH=Image.open('sheet2.png').convert('RGB');A=np.array(SH).astype(int)
def fgmask(box,mxb=60):
  x0,y0,x1,y1=box;a=A[y0:y1,x0:x1];r,g,b=a[...,0],a[...,1],a[...,2];mx=a.max(2);chm=mx-a.min(2)
  bgl=(mx<mxb)&(b-r>=2)&(g>=r-2)
  lab,_=nd.label(bgl);edge=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0};fl=np.isin(lab,list(edge))
  L=a.mean(2);sd=np.sqrt(np.maximum(nd.uniform_filter(L*L,5)-nd.uniform_filter(L,5)**2,0))
  cand=(mx<42)&(chm<14)&(sd<2.2)
  for _ in range(40): fl=fl|(nd.binary_dilation(fl)&cand)
  hm=(mx<34)&(chm<14)&(sd<4)&(b-r>=1)&~fl;hl,hn=nd.label(hm);hs=nd.sum(hm,hl,range(1,hn+1));fl=fl|np.isin(hl,[i+1 for i,v in enumerate(hs) if v>=10])
  return ~fl,a
def rgba(a,fg):
  al=np.where(fg,255,np.array(Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)))).astype(np.uint8)
  return Image.fromarray(np.dstack([a.astype(np.uint8),al]))
def band(box,minfig=1500,name='x'):
  fg,a=fgmask(box);lab,n=nd.label(fg,structure=np.ones((3,3)));objs=nd.find_objects(lab);sz=nd.sum(fg,lab,range(1,n+1))
  figs=[];small=[]
  for i,s in enumerate(objs):
    h=s[0].stop-s[0].start;w=s[1].stop-s[1].start;fill=sz[i]/(h*w)
    if min(h,w)<=5 or fill<0.04: continue   # lines/borders
    (figs if sz[i]>=minfig else small).append((i+1,s))
  return fg,a,lab,figs,small
