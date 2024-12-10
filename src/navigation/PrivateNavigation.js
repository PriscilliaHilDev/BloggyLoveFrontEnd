import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/private/WelcomScreen'



const Stack = createStackNavigator();

// const linking = {
//   prefixes: ['mychat://', 'http://192.168.1.20', 'https://192.168.1.20'],
//   config: {
//     screens: {
//       ResetPassword: 'reset-password/:token', // Capturer le token de l'URL
//     },
//   },
// };

const PublicNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcom"
        screenOptions={{
          headerShown: false, // Désactive l'en-tête pour tous les écrans
        }}
      >
        <Stack.Screen name="Welcom" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PublicNavigation;
