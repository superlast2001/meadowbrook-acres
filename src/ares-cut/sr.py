import numpy as np,onnxruntime as ort,sys,os
from PIL import Image
S=ort.InferenceSession('/workspace/sr/anime6b.onnx',providers=['CPUExecutionProvider'])
def sr(img,tile=128,pad=12):
  a=np.asarray(img.convert('RGB')).astype(np.float32)/255;H,W=a.shape[:2];out=np.zeros((H*4,W*4,3),np.float32)
  for y in range(0,H,tile):
    for x in range(0,W,tile):
      y0,x0=max(0,y-pad),max(0,x-pad);y1,x1=min(H,y+tile+pad),min(W,x+tile+pad)
      t=a[y0:y1,x0:x1].transpose(2,0,1)[None];o=S.run(None,{'image.1':t})[0][0].transpose(1,2,0)
      ty,tx=(y-y0)*4,(x-x0)*4;h=min(tile,H-y)*4;w=min(tile,W-x)*4
      out[y*4:y*4+h,x*4:x*4+w]=o[ty:ty+h,tx:tx+w]
  return Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8))
