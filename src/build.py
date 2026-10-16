js=''.join(open(f).read()+'\n' for f in ['assets.js','lib.js','hd.js','chars.js','plazabake.js','game.js','vnart.js','vn.js','rooms.js','pixroom.js','ares40.js'])
s=open('shell.html').read().replace('/*JS*/',js)
open('/workspace/meadowbrook-acres/index.html','w').write(s);print(len(s))
