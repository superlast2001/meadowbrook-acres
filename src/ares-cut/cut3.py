import os;os.environ['U2NET_HOME']='/home/box/.rembg/models/isnet-anime'
from cut2 import *;from rembg import remove,new_session
S=new_session('isnet-anime')
c=SH.crop((0,0,440,500));m=remove(c,session=S,only_mask=True)
o=c.convert('RGBA');o.putalpha(m);
# remove label box region (top-left) explicitly by alpha
a=np.array(o);a[:60,:190,3]=0;o=Image.fromarray(a);o.crop(o.getbbox()).save('c_cg.png')
# chibi: components in band
def comps(y0,y1,x0,x1,minsz=800,name=''):
  c=cut((x0,y0,x1,y1),minsz=30);a=np.array(c);fg=a[...,3]>128
  lab,n=nd.label(nd.binary_dilation(fg,iterations=14));objs=nd.find_objects(lab)
  objs=sorted([o for o in objs if (o[0].stop-o[0].start)*(o[1].stop-o[1].start)>minsz],key=lambda o:o[1].start)
  r=[]
  for i,o in enumerate(objs):
    sub=a[o].copy();sub[...,3]*=(lab[o]==lab[o][lab[o]>0][0]).astype(np.uint8) if False else 1
    im=Image.fromarray(sub);im=im.crop(im.getbbox());r.append(im)
  return r
D=comps(660,797,452,936);W=comps(660,797,952,1520);E=comps(838,972,452,1520)
for nm,L in (('dir',D),('walk',W),('emo',E)):
  print(nm,[i.size for i in L])
  for k,i in enumerate(L):i.save(f'ch_{nm}{k}.png')
