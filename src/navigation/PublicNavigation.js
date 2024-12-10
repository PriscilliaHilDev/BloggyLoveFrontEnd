import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/public/HomeScreen'
import LoginScreen from '../screens/public/LoginScreen'
import RegisterScreen from '../screens/public/RegisterScreen'
import ForgotPasswordScreen from '../screens/public/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/public/ResetPasswordScreen';


const Stack = createStackNavigator();

const linking = {
  prefixes: ['mychat://', 'http://192.168.1.20', 'https://192.168.1.20'],
  config: {
    screens: {
      ResetPassword: 'reset-password/:token', // Capturer le token de l'URL
    },
  },
};

const PublicNavigation = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Désactive l'en-tête pour tous les écrans
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PublicNavigation;
