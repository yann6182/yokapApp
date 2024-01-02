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
      'scopes': ['profile', 'email','https://www.googleapis.com/auth/drive.file'],
      'serverClientId': '769661539885-9fem97pe11313dqk2kbsbm8ecr50tumi.apps.googleusercontent.com',
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
