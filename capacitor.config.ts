import { CapacitorConfig } from '@capacitor/cli';



const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'yokapApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    'GoogleAuth': {
      'scopes': ['profile', 'email','https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata'],
      'serverClientId': '769661539885-m06ta17bqgtif99o7eeaj21hpdn9i7om.apps.googleusercontent.com',
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
