import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = ({ route }) => {
  // Récupérer le nom de l'utilisateur depuis les paramètres de navigation
  const { userName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue à Toi bel Inconnu!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default WelcomeScreen;
