import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/public/HomeScreen'
import LoginScreen from '../screens/public/LoginScreen'
import RegisterScreen from '../screens/public/RegisterScreen'
import WelcomeScreen from '../screens/private/WelcomScreen'
import ForgotPasswordScreen from '../screens/public/ForgetPasswordScreen';

const Stack = createStackNavigator();

const PublicNavigation = () => {
  return (
    <NavigationContainer>
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
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PublicNavigation;
