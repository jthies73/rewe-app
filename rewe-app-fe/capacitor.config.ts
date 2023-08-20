import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'rewe-app-fe',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
