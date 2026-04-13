import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.drivex.app',
  appName: 'DriveX',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
