import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DriveX',
        short_name: 'DriveX',
        description: 'Google Drive Multi-platform Manager',
        theme_color: '#ffffff',
        icons: [] // À compléter avec des icônes valides
      }
    })
  ]
});
