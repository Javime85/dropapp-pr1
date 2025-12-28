/// <reference types="@capacitor/local-notifications" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dropapp.pr1',
  appName: 'DropApp',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_dropapp_notif',
      iconColor: '#15B8D4',
      sound: 'soft_wake_up.mp3', // fitxer a res/raw
    },
  },
};

export default config;
