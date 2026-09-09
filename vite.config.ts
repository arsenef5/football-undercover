import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' : Capacitor charge l'app depuis le disque, les chemins doivent rester relatifs.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', target: 'es2019', sourcemap: false },
  server: { port: 5173, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
