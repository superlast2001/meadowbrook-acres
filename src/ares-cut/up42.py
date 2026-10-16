import sys;sys.path.insert(0,'/workspace/sr');from sr import sr
from PIL import Image,ImageFilter;import numpy as np,os
SH=Image.open('sheet2.png').convert('RGB');os.makedirs('out42',exist_ok=True)
M=8
for n in ['talk','laugh','tease','embar','angry','think','surp','serious']:
  cut=Image.open(f'out41/po_{n}.png');ox,oy=map(int,open(f'out41/po_{n}.off').read().split());w,h=cut.size
  src=np.asarray(SH.crop((ox,oy,ox+w,oy+h)));A=np.asarray(cut)
  m=A[...,3]==255;assert (abs(src[m].astype(int)-A[...,:3][m].astype(int)).max()<=0),n
  big=sr(SH.crop((ox-M,oy-M,ox+w+M,oy+h+M))).crop((M*4,M*4,(M+w)*4,(M+h)*4))
  al=Image.fromarray(A[...,3]).resize((w*4,h*4),Image.BICUBIC);al=np.asarray(al).astype(float)/255
  al=np.clip((al-0.5)*2.2+0.5,0,1)  # firm, clean edge from the original cut mask
  o=np.dstack([np.asarray(big),(al*255).astype(np.uint8)]);Image.fromarray(o).save(f'out42/po_{n}.png');print(n,o.shape)
for n in ['normal','smile','tease','blush','angry','serious','surp','sad']:
  im=Image.open(f'out41/ex_{n}.png');sr(im).save(f'out42/ex_{n}_4x.png')
