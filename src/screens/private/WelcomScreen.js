import { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../services/authService';
import { getUserData } from '../../utils/userStorage';
import { AuthContext } from '../../context/AuthContext';


const WelcomeScreen = () => {

  const { logout } = useContext(AuthContext); // Utilisation de la méthode logout depuis AuthContext
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);


  useEffect(() => {
    const getUser = async () => {
      const userData = await getUserData();
      if (userData) {
        setUserId(userData.user.id)
        setUserName(userData.user.name)
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    if (!userId) {
      Alert.alert('Erreur', 'Aucun utilisateur connecté.');
      return;
    }

    try {
      const result = await logoutUser(userId);  // Passer l'userId lors de la déconnexion
      if (result.success) {
        Alert.alert('Déconnexion réussie', 'Vous avez été déconnecté avec succès.');
        logout();
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Bienvenue {userName || 'à Toi bel Inconnu'}! </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff4c4c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WelcomeScreen;
