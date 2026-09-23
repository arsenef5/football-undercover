# Serveur de salons — mode en ligne

Un salon = un Durable Object Cloudflare, nommé par son code à quatre lettres.
Le salon est l'arbitre : lui seul tire les mots, connaît les rôles et compte les votes.

## Jouer en local (aucun compte nécessaire)

```
npm run salon      # le serveur de salons, sur le port 8787
npm run dev        # l'app, qui s'y connecte toute seule
```

## Mettre en ligne

```
npx wrangler login
npx wrangler deploy --config server/wrangler.toml
```

La commande affiche l'adresse du serveur à la fin, de la forme
`football-undercover-salons.XXXX.workers.dev` où `XXXX` est le sous-domaine du compte.

**Cette adresse doit être recopiée dans la compilation de l'app**, sans quoi le mode en ligne
s'affiche comme pas encore ouvert :

```
VITE_ONLINE_URL=https://football-undercover-salons.XXXX.workers.dev npm run build
```

Dans Codemagic, la même valeur se met en variable d'environnement du workflow.

## Vérifier avant de déployer

```
npm run check:server   # TypeScript du serveur
npm test               # les règles du jeu
node scripts/test-online2.mjs   # une partie à 4 avec une déconnexion
node scripts/test-online3.mjs   # le carton blanc qui ne revient jamais
node scripts/test-online4.mjs   # rouvrir le salon entre deux parties
node scripts/test-online5.mjs   # le joueur qui claque la porte en pleine manche
```

Les trois scénarios ont besoin de `npm run salon` et `npm run dev` en cours d'exécution.
