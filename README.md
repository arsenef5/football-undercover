# Football Undercover

Jeu de bluff façon *Undercover*, 100 % foot, à jouer sur un seul téléphone qui passe de main en main.
Hors ligne, en français. Construit en React + TypeScript (Vite), emballé pour iOS et Android par Capacitor.

## Le jeu en deux lignes

Tout le monde reçoit un mot secret (un joueur, un stade, un moment légendaire…) sauf que les **undercovers**
ont un mot proche (Neymar / Vinícius Jr) et que le **carton blanc** n'a rien du tout. Chacun décrit son mot en
une phrase, on vote, on élimine. Barème : titulaire gagnant +2, undercover gagnant +10, carton blanc gagnant +6.

Deux langues, réglables depuis le drapeau de l'accueil : la langue des **menus** et la langue des **mots**.

Les mots sont organisés en **groupes de mots proches** (`src/data/groups/`) : à chaque partie le moteur tire
deux mots différents d'un groupe, donc les duos changent (Coupe du monde / Euro une fois, Coupe du monde /
Ligue des champions la fois suivante ; Pavard avec Desailly, puis avec Umtiti…). Environ 500 mots gratuits
(60 % de joueurs) et plus de 1 100 mots dans le pack Pro, en français et en anglais, huit catégories
(joueurs, clubs, trophées, stades, compétitions, moments légendaires, memes, styles de jeu).

Les équipes se créent toutes seules au lancement d'une partie (TEAM 1, TEAM 2… renommables) ; dans une liste
de joueurs, un glissement vers la gauche supprime, un appui modifie ou sélectionne.

## Monétisation

Version gratuite avec publicités AdMob (bannière hors écrans de partie, interstitiel toutes les 3 parties) et
achat intégré unique « Version Pro » via RevenueCat (plus de pub, mots Pro). Tout est dans
`src/monetization/` ; les identifiants de test de Google sont en place tant que `USE_TEST_ADS` est vrai.
La marche à suivre complète (comptes, identifiants, captures, TestFlight, Play Console) est dans
[store/README.md](store/README.md).

## Lancer en développement

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173 (le rendu est pensé pour un écran de téléphone : réduire la fenêtre ou
utiliser le mode « appareil mobile » des outils de développement).

## Vérifier

```bash
npm test        # moteur de jeu (rôles, victoires, points, tirage pondéré, base de mots)
npm run build   # typage strict + bundle de production dans dist/
```

## Le logo

Dépose le visuel définitif (stade + ballon + espion, 1024 × 1024) à deux endroits :

- `public/logo.png` : il s'affiche en grand sur l'écran d'accueil (à défaut, un lockup texte est rendu).
- `assets/logo.png` : source des icônes et splash screens natifs.

Puis génère les icônes (le script crée un logo de secours uniquement si `assets/logo.png` manque, il n'écrase jamais le tien) :

```bash
npm run icons
```

## Android

Prérequis : Android Studio (SDK + JDK inclus).

```bash
npx cap add android      # une seule fois
npm run android          # build web, synchronise, ouvre Android Studio
```

Dans Android Studio : *Run* sur un appareil ou un émulateur, ou *Build > Generate Signed Bundle* pour le Play Store.

## iOS

Prérequis : un Mac avec Xcode (ou un service de build cloud type Codemagic / Ionic Appflow).

```bash
npx cap add ios          # une seule fois, sur le Mac
npm run ios              # build web, synchronise, ouvre Xcode
```

## Organisation du code

```
src/
  data/words.ts        200 mots de base (60 % joueurs) + pack Pro, par catégorie
  data/avatars.ts      avatars et couleurs proposés
  game/engine.ts       moteur pur : rôles, ordre de parole, éliminations, victoires, points, tirage pondéré
  game/engine.test.ts  tests du moteur (vitest)
  game/useGame.tsx     partie en cours (persistée pour reprendre après une fermeture)
  store/store.tsx      joueurs, équipes, réglages, classement (localStorage)
  i18n/fr.ts           tous les textes
  screens/             un fichier par écran
  components/          boutons, feuilles, éditeurs joueur / équipe, réglage des rôles, icônes
  styles/global.css    design system (palette noir / rouge / blanc, typo large)
```

## Version Pro (plan)

Le code distingue déjà `pack: 'base' | 'pro'` sur chaque mot et un réglage `premium`. Ce qui reste à brancher
au moment de publier : la publicité dans la version gratuite (ex. AdMob via plugin Capacitor) et l'achat
in-app qui active `premium` (ex. RevenueCat). L'écran « Version Pro » est en place avec un bouton inactif.
