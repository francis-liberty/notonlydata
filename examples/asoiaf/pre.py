# Preprocessing of txt novel data.

import os
import re


for b in range(1, 6):
    chapters = []
    with open('./'+str(b)+'.txt', 'r') as f:
        txt = f.read()
        p = re.compile('\n\n')
        chapters = p.split(txt)

    for i, chapter in enumerate(chapters):
        with open('./'+str(b)+'-'+str(i)+'.txt', 'w') as f:
            f.write(chapter)
