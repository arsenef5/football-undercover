import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/anton';
import './styles/global.css';
import { App } from './App';
import { isNative } from './native';

// Version web : service worker pour le hors-ligne et « Ajouter à l'écran d'accueil ».
// Inutile dans l'app native (Capacitor sert les fichiers depuis le téléphone).
if (!isNative && 'serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
