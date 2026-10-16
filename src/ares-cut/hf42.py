from PIL import Image,ImageFilter;import numpy as np,glob
SH=Image.open('sheet2.png').convert('RGB')
def g(a,r):return np.asarray(Image.fromarray(a.clip(0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(float)
def det(N,src):
  bc=np.asarray(src.resize((N.shape[1],N.shape[0]),Image.BICUBIC)).astype(float);return np.clip(N+ (bc-g(bc,5)),0,255)
for n in ['talk','laugh','tease','embar','angry','think','surp','serious']:
  ox,oy=map(int,open(f'out41/po_{n}.off').read().split());w,h=Image.open(f'out41/po_{n}.png').size
  N=np.asarray(Image.open(f'out42/po_{n}.png')).astype(float);o=N.copy();o[...,:3]=det(N[...,:3],SH.crop((ox,oy,ox+w,oy+h)))
  Image.fromarray(o.astype(np.uint8)).save(f'out42/po_{n}.webp',lossless=True,method=6)
for n in ['normal','smile','tease','blush','angry','serious','surp','sad']:
  N=np.asarray(Image.open(f'out42/ex_{n}_4x.png')).astype(float);o=det(N,Image.open(f'out41/ex_{n}.png').convert('RGB'))
  i=Image.fromarray(o.astype(np.uint8));i=i.resize((i.width*240//i.height,240),Image.LANCZOS);i.save(f'out42/ex_{n}.webp',lossless=True,method=6)
