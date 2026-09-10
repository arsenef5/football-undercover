# Publier Football Undercover

Tout ce qu'il faut pour sortir l'app, dans l'ordre. Les textes de fiche sont dans `metadata/`, les captures
d'écran se génèrent avec `npm run screenshots`.

## 0. Comptes à ouvrir

| Service | Prix | Sert à |
| --- | --- | --- |
| Apple Developer Program (developer.apple.com) | 99 $/an | App Store, TestFlight |
| Google Play Console (play.google.com/console) | 25 $ une fois | Play Store |
| AdMob (admob.google.com) | gratuit | publicités de la version gratuite |
| RevenueCat (app.revenuecat.com) | gratuit jusqu'à 2 500 $/mois | achat « Version Pro » sur les deux stores |
| Codemagic (codemagic.io) ou un Mac | gratuit (500 min/mois) | compiler l'app iOS depuis Windows |

## 1. Identifiants à coller dans le code

Fichier `src/monetization/config.ts` :

- `ADMOB_APP_ID` (une par plateforme) et `AD_UNITS` (bannière + interstitiel, une par plateforme), puis
  `USE_TEST_ADS = false`. Reporter aussi l'App ID Android dans `android/app/src/main/AndroidManifest.xml`
  (`com.google.android.gms.ads.APPLICATION_ID`) et l'App ID iOS dans `ios/App/App/Info.plist`
  (`GADApplicationIdentifier`). Tant que ce n'est pas fait, l'app sert les annonces de test de Google.
- `REVENUECAT_API_KEY` (clé publique iOS `appl_…` et Android `goog_…`).

Dans RevenueCat : un projet, les deux apps (App Store + Play), le produit `fu_pro` importé des stores, un
droit (« entitlement ») nommé `pro` qui contient ce produit, et une offre courante (« current offering »)
qui propose le package `fu_pro`.

Dans App Store Connect et Google Play : créer le produit intégré non consommable `fu_pro` (nom « Version Pro »,
prix conseillé 2,99 €). Sur Apple, signer les contrats payants (Agreements, Tax, and Banking) avant.

## 2. Politique de confidentialité

`public/privacy.html` contient la politique en français et en anglais. Remplacer `CONTACT@EXEMPLE.COM`
par ton e-mail, puis l'héberger (GitHub Pages du dépôt, ou ton site). L'URL est demandée par les deux stores.

## 3. Captures d'écran

```bash
npm run dev          # dans un terminal
npm run screenshots  # dans un autre : store/screenshots/ (iPhone 6,9", 6,7" et Android)
```

## 4. Android (depuis ce PC)

Android Studio installé, puis :

```bash
npm run android
```

Dans Android Studio : Build > Generate Signed Bundle (AAB), avec une clé de signature à créer une fois et à
garder précieusement. Puis Play Console : créer l'app, fiche (textes `metadata/`), captures, questionnaire
« Data safety », classification de contenu, test interne, puis production.

## 5. iOS

### Avec un Mac

```bash
npm install && npm run build && npx cap sync ios && npx cap open ios
```

Xcode : Signing & Capabilities > Team ; Product > Archive ; Distribute App > App Store Connect.

### Sans Mac : Codemagic (configuré le 10 septembre 2026)

Compte personnel Codemagic (GitHub `arsenef5`, gratuit, 500 minutes par mois), app `football-undercover`
reliée au dépôt, workflow lu dans `codemagic.yaml`.

Ce qui est en place, et où le retrouver si quelque chose casse :

1. **Clé API App Store Connect** « Codemagic », rôle Gestionnaire d'apps (App Store Connect > Utilisateurs
   et accès > Intégrations > API App Store Connect). Déposée dans Codemagic > Settings > Integrations >
   Developer Portal sous le nom `app_store_connect` (celui du YAML).
2. **Certificat Apple Distribution** généré par Codemagic avec cette clé : Settings > Code signing
   identities > iOS certificates, référence `app_store_distribution` (expire le 10 septembre 2027).
3. **Profil de provisionnement App Store** « Football Undercover App Store » créé sur le portail Apple
   (Certificates, Identifiers & Profiles > Profiles), puis récupéré dans Codemagic via « Fetch profiles »,
   référence `app_store_profile`. Le YAML référence ces deux identités explicitement.
4. **Lancer un build** : Codemagic > football-undercover > Start new build > branche `main`,
   workflow « iOS → TestFlight ». Le numéro de build iOS suit le compteur Codemagic.

Quand le certificat ou le profil expirent (septembre 2027) : régénérer le certificat dans Codemagic,
recréer le profil chez Apple avec ce certificat, refaire « Fetch profiles », garder les mêmes références.

## 6. App Store Connect

État au 10 septembre 2026 : identifiant `fr.footballundercover.app` enregistré (`com.footballundercover.app`
était déjà pris chez Apple), conditions App Store Connect acceptées, fiche créée sous le nom provisoire
**« Football Undercover FR »** (le nom « Football Undercover » est déjà utilisé sur l'App Store par une autre
app ; le nom se change librement jusqu'à la première soumission). Aucun build envoyé pour l'instant.

Pour la bêta TestFlight : un build via Codemagic (section 5) puis, dans App Store Connect > TestFlight,
ajouter les testeurs internes (adresses e-mail) ; les testeurs externes demandent une courte revue d'Apple.

Pour la publication : remplir la fiche depuis `metadata/fr.md` et `metadata/en.md`, captures 6,9" ou 6,7",
URL de confidentialité, questionnaire « App Privacy », classification d'âge, prix (gratuit), statut de
commerçant (obligation européenne), contrat « applications payantes » pour la version Pro, puis choisir le
build TestFlight et soumettre à la revue (1 à 3 jours en général).

Astuce : mettre l'app en « iPhone uniquement » (Xcode > General > Supported Destinations) évite les captures iPad.

