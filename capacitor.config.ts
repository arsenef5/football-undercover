import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.footballundercover.app',
  appName: 'Football Undercover',
  webDir: 'dist',
  backgroundColor: '#0A0A0A',
  // scrollEnabled: false → la WebView ne « rebondit » plus quand on tire l'écran ; nos écrans défilent seuls.
  ios: { contentInset: 'never', backgroundColor: '#0A0A0A', scrollEnabled: false },
  android: { backgroundColor: '#0A0A0A', allowMixedContent: false },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#0A0A0A',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: { style: 'DARK', overlaysWebView: true },
  },
};

export default config;
