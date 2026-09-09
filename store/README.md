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

### Sans Mac : Codemagic

1. Pousser le dépôt sur GitHub (privé).
2. Codemagic > Add application > choisir le dépôt > « codemagic.yaml ».
3. Teams > Integrations > App Store Connect : ajouter une clé API App Store Connect (créée dans
   App Store Connect > Users and Access > Integrations), nommée `app_store_connect` comme dans le YAML.
4. Lancer le workflow `ios-testflight` : il compile, signe automatiquement et envoie sur TestFlight.

## 6. App Store Connect

Créer l'app (bundle `com.footballundercover.app`), remplir la fiche depuis `metadata/fr.md` et `metadata/en.md`,
captures 6,9" ou 6,7", URL de confidentialité, questionnaire « App Privacy », classification d'âge, prix
(gratuit), puis choisir le build TestFlight et soumettre à la revue (1 à 3 jours en général).

Astuce : mettre l'app en « iPhone uniquement » (Xcode > General > Supported Destinations) évite les captures iPad.
