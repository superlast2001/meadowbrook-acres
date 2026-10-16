from PIL import Image,ImageFilter,ImageDraw;import numpy as np
SH=Image.open('sheet2.png').convert('RGB')
P=['talk','laugh','tease','embar','angry','think','surp','serious']
def lz(im,s):return im.resize((im.width*s,im.height*s),Image.LANCZOS)
def c1(rgb):return lz(rgb,2).filter(ImageFilter.UnsharpMask(radius=1.2,percent=60,threshold=2))
def c2(rgb,n):e=Image.open(f'out42/po_{n}.png').convert('RGB');e=e.resize((rgb.width*2,rgb.height*2),Image.LANCZOS);return Image.blend(lz(rgb,2),e,0.45)
def withA(rgb,cut,s):al=cut.getchannel('A').resize((cut.width*s,cut.height*s),Image.LANCZOS);o=rgb.convert('RGBA');o.putalpha(al);return o
def bg(i):b=Image.new('RGBA',i.size,(40,30,60,255));b.alpha_composite(i.convert('RGBA'));return b.convert('RGB')
rows=[]
for n in P:
  cut=Image.open(f'out41/po_{n}.png');ox,oy=map(int,open(f'out41/po_{n}.off').read().split());w,h=cut.size
  rgb=SH.crop((ox,oy,ox+w,oy+h));A=np.asarray(cut)[...,3]>128
  ys,xs=np.where(A[:70]);cx=int(np.median(xs[ys<45]));fb=(max(0,cx-34),0,min(w,cx+34),62)  # face box in source px
  C1=withA(c1(rgb),cut,2);C2=withA(c2(rgb,n),cut,2);C1.save(f'out43/po_{n}_c1.png');C2.save(f'out43/po_{n}_c2.png')
  v42=Image.open(f'out42/po_{n}.webp')
  Z=5;fw,fh=(fb[2]-fb[0])*Z,(fb[3]-fb[1])*Z
  sheet=SH.crop((ox+fb[0],oy+fb[1],ox+fb[2],oy+fb[3])).resize((fw,fh),Image.NEAREST)
  v41=bg(cut.crop(fb)).resize((fw,fh),Image.BICUBIC)
  b42=bg(v42.crop([c*4 for c in fb])).resize((fw,fh),Image.LANCZOS)
  b1=bg(C1.crop([c*2 for c in fb])).resize((fw,fh),Image.LANCZOS);b2=bg(C2.crop([c*2 for c in fb])).resize((fw,fh),Image.LANCZOS)
  rows.append((n,[sheet,v41,b42,b1,b2]));open(f'out43/po_{n}.face','w').write(' '.join(map(str,fb)))
L=['sheet (nearest 5x)','v41 bicubic','v42 ESRGAN+hf','C1 lanczos2x+unsharp','C2 45% ESRGAN blend']
W=max(sum(i.width+8 for i in r) for _,r in rows);H=sum(r[0].height+18 for _,r in rows);C=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(C);y=0
for n,r in rows:
  x=0
  for k,i in enumerate(r):d.text((x+2,y+3),n+': '+L[k],fill='black');C.paste(i,(x,y+16));x+=i.width+8
  y+=r[0].height+18
C.save('out43/cmp_poses_faces.png');print(C.size)
