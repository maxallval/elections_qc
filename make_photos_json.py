# Génère data/photos.json à partir des images de data/photos/ (nom du fichier = prenom-nom)
import json, os, re, unicodedata
def nk(s):
    s = ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))
    return re.sub(r'[^a-z]', '', s.lower())
folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'photos')
out = {}
for f in sorted(os.listdir(folder)):
    stem, ext = os.path.splitext(f)
    if ext.lower() in ('.jpg', '.jpeg', '.png', '.webp'):
        out[nk(stem)] = 'data/photos/' + f
with open(os.path.join(os.path.dirname(folder), 'photos.json'), 'w', encoding='utf-8') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)
with open(os.path.join(os.path.dirname(folder), 'photos.js'), 'w', encoding='utf-8') as fh:
    fh.write('window.PHOTOS_JS=' + json.dumps(out, ensure_ascii=False) + ';')
print(len(out), 'photo(s) dans data/photos.json et data/photos.js')
