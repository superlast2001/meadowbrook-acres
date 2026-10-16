js=''.join(open(f).read()+'\n' for f in ['assets.js','lib.js','hd.js','plazabake.js','game.js'])
s=open('shell.html').read().replace('/*JS*/',js)
open('/workspace/meadowbrook-acres/index.html','w').write(s);print(len(s))
