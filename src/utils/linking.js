// utils/linking.js
export const linking = {
    prefixes: ['mychat://', 'http://192.168.1.20', 'https://192.168.1.20'],
    config: {
      screens: {
        ResetPassword: 'reset-password/:token', // Capturer le token de l'URL
      },
    },
  };
  