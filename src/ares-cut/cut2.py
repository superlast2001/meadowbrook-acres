import os;os.environ['U2NET_HOME']='/home/box/.rembg/models/isnet-anime'
from PIL import Image,ImageFilter;import numpy as np;from scipy import ndimage as nd
SH=Image.open('sheet.png').convert('RGB')
def bgmask(a):
  r,g,b=a[...,0],a[...,1],a[...,2];mx=a.max(2)
  return (mx<60)&(b-r>=2)&(g>=r-2)
def cut(box,minsz=60,keepall=True,mxb=60,holes=False):
  c=SH.crop(box);a=np.array(c).astype(int);bgl=bgmask(a)&(a.max(2)<mxb)
  lab,_=nd.label(bgl);edge=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
  fl=np.isin(lab,list(edge))
  # close tiny holes in bg (noise speckles) : bg-ish pixels fully enclosed by bg flood
  L=a.mean(2);sd=np.sqrt(np.maximum(nd.uniform_filter(L*L,5)-nd.uniform_filter(L,5)**2,0));mx=a.max(2);chm=mx-a.min(2)
  cand=(mx<42)&(chm<14)&(sd<2.2)
  for _ in range(40): fl=fl|(nd.binary_dilation(fl)&cand)
  if holes:
    hm=(mx<34)&(chm<14)&(sd<4)&(a[...,2]-a[...,0]>=1)&~fl;hl,hn=nd.label(hm);hs=nd.sum(hm,hl,range(1,hn+1))
    fl=fl|np.isin(hl,[i+1 for i,v in enumerate(hs) if v>=10])
  fl=nd.binary_opening(fl,iterations=1)|fl&nd.binary_erosion(fl,iterations=1)
  fg=~fl;lab,n=nd.label(fg);sz=nd.sum(fg,lab,range(1,n+1))
  fg=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>=minsz])
  al=Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6))
  al=np.minimum(np.array(al),fg*255+np.array(al)*0+255*fg).astype(np.uint8) # keep fg solid, soft only outside? 
  al=np.where(fg,255,np.array(Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)))).astype(np.uint8)
  o=c.convert('RGBA');o.putalpha(Image.fromarray(al));return o.crop(o.getbbox())
if __name__=='__main__':
  out={}
  X=[(446,619),(626,798),(806,978),(987,1158),(1168,1341),(1351,1524)]
  for n,(x0,x1) in zip(['normal','smile','tease','blush','angry','serious'],X): out['ex_'+n]=cut((x0+8,47,x1-8,211))
  PX=[(446,620),(628,800),(809,990),(990,1169),(1169,1349),(1349,1522)]
  for n,(x0,x1) in zip(['talk','laugh','embar','angryp','think','surp'],PX): out['po_'+n]=cut((x0+11,287,x1-11,540))
  for k,v in out.items(): v.save('c_'+k+'.png')
