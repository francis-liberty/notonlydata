# counts the occurrence of keywords throughout the novel

import os
from nltk import word_tokenize


words = {
    'kill': 'kill',
    'killed': 'kill',
    'murder': 'kill',
    'murdered': 'kill',

    'fuck': 'fuck',
    'fucked': 'fuck',

    'honor': 'honor',

    'family': 'family',

    'dead': 'dead',
    'death': 'dead',
}


def chapter_cmp(chap1, chap2):
    book1, ch1 = map(int, chap1.split('-'))
    book2, ch2 = map(int, chap2.split('-'))
    multiplier = 1000
    return book1*multiplier+ch1 - (book2*multiplier+ch2)


counts = {}


directory = './txt'
txts = [f for f in os.listdir(directory) if f.endswith('.txt')]
chapters = [txt.split('.')[0] for txt in txts]
chapters.sort(cmp=chapter_cmp)
for ch in chapters:
    # count
    tokens = {}
    with open(os.path.join(directory, ch+'.txt'), 'r') as f:
        corpus = f.read().lower()
        corpus = word_tokenize(corpus)
        for token in corpus:
            if token in words:
                tokens[words[token]] = tokens.get(token, 0) + 1
    occurs = [(count, token) for token, count in tokens.iteritems()]

    for count, token in occurs:
        counts.setdefault(token, {}).update({ch: count})


with open('counts.csv', 'w') as f:
    f.write('word,' + ','.join(chapters))
    f.write('\n')
    for token, occurs in counts.iteritems():
        f.write(token + ',')
        f.write(','.join(map(str, [occurs.get(ch, 0) for ch in chapters])))
        f.write('\n')
