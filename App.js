import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';  // Import du contexte
import PublicNavigation from './src/navigation/PublicNavigation';
import PrivateNavigation from './src/navigation/PrivateNavigation';

function AppContent() {
  const { isAuthenticated, isLoading } = React.useContext(AuthContext);  // Utilisation du contexte

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isAuthenticated ? <PrivateNavigation /> : <PublicNavigation />}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
