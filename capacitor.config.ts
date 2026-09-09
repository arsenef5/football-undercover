import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.footballundercover.app',
  appName: 'Football Undercover',
  webDir: 'dist',
  backgroundColor: '#0A0A0A',
  ios: { contentInset: 'never', backgroundColor: '#0A0A0A' },
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
