import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import RegisterScreen from '../screens/public/RegisterScreen';
import ForgotPasswordScreen from '../screens/public/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/public/ResetPasswordScreen';
import WelcomeScreen from '../screens/private/WelcomeScreen';
import { linking } from '../utils/linking';

const Stack = createStackNavigator();

const AppNavigation = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Welcome" : "Home"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Écrans privés
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> 
          </>
        ) : (
          // Écrans publics
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
