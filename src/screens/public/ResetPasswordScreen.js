import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { resetPassword } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';

const ResetPasswordScreen = () => {
  const route = useRoute(); // Accéder aux paramètres de la route
  const navigation = useNavigation(); // Récupérer l'instance de navigation pour rediriger l'utilisateur
  const { isAuthenticated } = React.useContext(AuthContext);  // Utilisation du contexte d'authentification pour vérifier si l'utilisateur est connecté

  const [token, setToken] = useState(route.params?.token); // Récupérer le token passé par les paramètres de la route
  const [loading, setLoading] = useState(false); // Indicateur de chargement pour la réinitialisation du mot de passe
  const [isTokenProcessed, setIsTokenProcessed] = useState(false); // Indicateur pour vérifier si le token a déjà été traité

  // Fonction de déconnexion de l'utilisateur
  const handleLogout = async () => {
    try {
      const result = await logoutUser();  // Appeler directement logoutUser sans avoir besoin de userId
      if (result.success) {
        Alert.alert('Déconnexion réussie', result.message);
        // Rediriger vers la page d'accueil de l'application après déconnexion
        logout();
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
    }
  };

  useEffect(() => {
    const handleUrl = (event) => {
      if (isTokenProcessed) return; // Empêcher le traitement plusieurs fois du même token
      const urlParts = event.url.split('/reset-password/');
      if (urlParts.length > 1) {
        const tokenFromUrl = urlParts[1];
        if (tokenFromUrl && tokenFromUrl.trim() !== '') {
          setToken(tokenFromUrl); // Mettre à jour le token
          setIsTokenProcessed(true); // Marquer le token comme traité
  
          // Si l'utilisateur est authentifié, le déconnecter
          if (isAuthenticated) {
            handleLogout(); // Déconnecter l'utilisateur avant de traiter le lien
          }
        } else {
          Alert.alert('Erreur', 'Le token de réinitialisation est vide ou invalide.');
        }
      } else {
        Alert.alert('Erreur', 'Le format de l\'URL est incorrect.');
      }
    };
  
    // Ajouter un écouteur pour les liens URL
    const subscription = Linking.addListener('url', handleUrl);
    // Vérifier si l'application a été ouverte via un lien
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url }); // Gérer le lien initial
    });
  
    return () => {
      subscription.remove(); // Nettoyer l'abonnement quand le composant est démonté
    };
  }, [isTokenProcessed, isAuthenticated]);

  // Validation du formulaire avec Yup
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .required('Mot de passe requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
      .required('Confirmation du mot de passe requise'),
  });

  // Fonction pour réinitialiser le mot de passe
  const handleResetPassword = async (values) => {
    if (!token) {
      Alert.alert('Erreur', 'Le token de réinitialisation est manquant.');
      return;
    }
  
    setLoading(true); // Afficher un indicateur de chargement
    try {
      const result = await resetPassword(token, values.password); // Appeler le service de réinitialisation avec le token et le nouveau mot de passe
      if (result.success) {
        Alert.alert('Succès', 'Votre mot de passe a été réinitialisé avec succès.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }, // Naviguer vers la page de connexion après succès
        ]);
      } else {
        Alert.alert('Erreur', result.message); // Afficher le message d'erreur si la réinitialisation échoue
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.'); // Gestion des erreurs
    } finally {
      setLoading(false); // Cacher l'indicateur de chargement
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleResetPassword}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
              style={[styles.input, touched.confirmPassword && errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

// Styles pour la page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
