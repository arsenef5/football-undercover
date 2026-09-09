import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base './' : Capacitor charge l'app depuis le disque, les chemins doivent rester relatifs.
// La PWA (manifeste + service worker) sert à la version web : « Ajouter à l'écran d'accueil »
// donne une vraie icône, le plein écran et le fonctionnement hors ligne.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'logo.png', 'promo-pro.jpg', 'privacy.html'],
      manifest: {
        name: 'Football Undercover',
        short_name: 'Undercover',
        description: 'Le jeu de bluff 100 % foot : un mot secret, un imposteur, un carton blanc.',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2,webmanifest}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  base: './',
  build: { outDir: 'dist', target: 'es2019', sourcemap: false },
  server: { port: 5173, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
