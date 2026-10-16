from cut6 import *
import os
T=os.environ.get('T','x')
P=['talk','laugh','tease','embar','angry','think','surp','serious']
X=[(341,490),(498,637),(645,785),(793,928),(934,1065),(1073,1198),(1206,1367),(1375,1524)]
def cell(box,name):
  r=section(box,0,name,[]) if False else None
  x0,y0,x1,y1=box
  out=section(box,0,name,None)
  # union of all figs into one
  xs=[bx for _,bx in out];a0=min(b[0] for b in xs);a1=max(b[2] for b in xs)
  return a0,a1
res=[]
for n,(x0,x1) in zip(P,X):
  b=(x0,507,x1,784)
  fg,a=fgmask(b)
  out=section(b,0,n,[b[2]-b[0]-1])  # single figure
  im,bx=out[0]
  A2=np.array(im);w=A2.shape[1];mx=A2[...,:3].max(2)
  bad=(mx<85)|((A2[...,1]<45)&(A2[...,0]<140))
  for c in list(range(0,7))+list(range(w-7,w)):A2[bad[:,c],c,3]=0
  A2[-2:,:,3][A2[-2:,:,:3].max(2)<85]=0
  im=Image.fromarray(A2);bb=im.getbbox();im=im.crop((bb[0],0,bb[2],im.height));res.append((n,im,bx))
  al=np.array(im)[...,3]>100;print(n,im.size,'touch L/R/T/B',al[:,0].sum(),al[:,-1].sum(),al[0].sum(),al[-1].sum(),'box',bx)
  im.save(f'out41/po_{n}.png')
