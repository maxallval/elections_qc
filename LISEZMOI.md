# Soirée électorale Québec 2026

Site statique: carte des circonscriptions, résultats en direct, 2022 et 2018, alertes, surveillances par parti, régions.

## 1. Héberger sur GitHub Pages
1. Créer un dépôt public sur github.com (ex.: `soiree-electorale`).
2. Y déposer **tout le contenu de ce dossier** (Add file → Upload files). Garder `.nojekyll`.
3. Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
4. Le site est en ligne à `https://VOTRE-COMPTE.github.io/soiree-electorale/` (1 à 2 minutes).

Sans l'étape 2, le site fonctionne (carte, 2022, 2018, mode démo `?demo`) mais **les résultats en direct ne se chargent pas**:
GitHub Pages ne peut pas exécuter de code, et le DGEQ bloque la lecture directe de ses fichiers par un navigateur (CORS).

## 2. Proxy des résultats (obligatoire pour le direct)
### Option A: Cloudflare Workers (gratuit, recommandé)
1. dash.cloudflare.com → Workers & Pages → Create → *Hello World* → Deploy.
2. Edit code → remplacer par le contenu de `proxy/cloudflare-worker.js` → Deploy.
3. Copier l'adresse du worker, ex. `https://soiree.mon-compte.workers.dev`.
4. Dans `config.js`, mettre: `window.APP_CONFIG = { proxy: "https://soiree.mon-compte.workers.dev/api/resultats" };` puis enregistrer (commit).
5. Tester après 20 h: ouvrir `https://soiree.mon-compte.workers.dev/api/resultats` (doit afficher du JSON).

### Option B: Netlify
Déployer le dossier `proxy/netlify/` sur app.netlify.com/drop (ou `npx netlify-cli deploy --prod --dir .`), puis mettre dans `config.js`:
`proxy: "https://VOTRE-SITE.netlify.app/api/resultats"`.

Le même proxy sert aussi la liste des candidats 2026 (`/api/candidatures`, déduite automatiquement de l'adresse ci-dessus).

## Mode démo et tests
- `?demo` : données simulées. `?demo&refresh=2` : le dépouillement avance toutes les 2 secondes.
- `?proxy=https://.../api/resultats` : tester un proxy sans modifier `config.js`.
- `?bandeau` : bandeau de diffusion seul (`&transparent` pour un fond translucide).

## Photos des candidats (facultatif)
Voir `data/photos/LISEZMOI.txt`, puis `python make_photos_json.py`.

## Contenu
`index.html` (la page) · `config.js` · `data/` (cartes 2018/2022/2026, résultats 2018/2022, députés sortants, photos) · `proxy/` (Cloudflare et Netlify).
