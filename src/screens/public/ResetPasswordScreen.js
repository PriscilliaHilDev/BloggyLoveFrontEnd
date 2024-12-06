import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { resetPassword } from '../../services/authService';

const ResetPasswordScreen = ({ navigation }) => {
  // Récupération des paramètres de la route actuelle
const route = useRoute();

// Déclaration d'état pour le token, initialisé avec le token reçu en paramètre de la route
const [token, setToken] = useState(route.params?.token);

// État de chargement pour afficher un indicateur de processus
const [loading, setLoading] = useState(false);

// État pour vérifier si le token a déjà été traité, afin d'éviter des traitements multiples
const [isTokenProcessed, setIsTokenProcessed] = useState(false);

// Utilisation de useEffect pour configurer l'écoute des URL externes via le Linking
useEffect(() => {
  // Fonction pour traiter l'URL reçue
  const handleUrl = (event) => {
    if (isTokenProcessed) return; // On s'assure de ne pas traiter l'URL plus d'une fois

    console.log('URL reçue :', event.url); // Affiche l'URL reçue pour le débogage
    const urlParts = event.url.split('/reset-password/'); // On découpe l'URL pour extraire le token
    if (urlParts.length > 1) {
      const tokenFromUrl = urlParts[1]; // Récupère le token de l'URL
      if (tokenFromUrl && tokenFromUrl.trim() !== '') {
        setToken(tokenFromUrl); // Met à jour l'état avec le token reçu
        setIsTokenProcessed(true); // Marque le token comme déjà traité pour éviter une double opération
      } else {
        Alert.alert('Erreur', 'Le token de réinitialisation est vide ou invalide.'); // Si le token est vide ou invalide
      }
    } else {
      Alert.alert('Erreur', 'Le format de l\'URL est incorrect.'); // Si l'URL ne contient pas le token
    }
  };

  // Abonnement à l'écouteur d'URL
  const subscription = Linking.addListener('url', handleUrl);

  // Vérification si une URL a été ouverte à l'origine
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleUrl({ url }); // Si une URL est présente, on la traite immédiatement
    }
  });

  // Retourne une fonction de nettoyage pour supprimer l'écouteur d'URL à la destruction du composant
  return () => {
    subscription.remove(); // Nettoyage de l'abonnement à l'écouteur
  };
}, [isTokenProcessed]); // La dépendance sur isTokenProcessed garantit qu'on ne traite l'URL qu'une seule fois

// Schéma de validation pour le mot de passe et sa confirmation
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères') // Validation de la longueur minimale du mot de passe
    .required('Mot de passe requis'), // Validation pour s'assurer que le champ est rempli
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas') // Validation pour que les mots de passe correspondent
    .required('Confirmation du mot de passe requise'), // Validation de la confirmation du mot de passe
});

// Fonction qui gère la réinitialisation du mot de passe
const handleResetPassword = async (values) => {
  if (!token) {
    // Si le token est manquant, on alerte l'utilisateur et on arrête l'exécution
    Alert.alert('Erreur', 'Le token de réinitialisation est manquant.');
    return;
  }
  
  setLoading(true); // Déclenche l'état de chargement pour montrer un indicateur
  try {
    // Appel à la fonction de réinitialisation du mot de passe avec le token et le nouveau mot de passe
    const result = await resetPassword(token, values.password);

    if (result.success) {
      // Si la réinitialisation est réussie, affiche un message de succès et navigue vers l'écran de connexion
      Alert.alert('Succès', 'Votre mot de passe a été réinitialisé avec succès.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }, // Navigation vers l'écran de connexion
      ]);
    } else {
      // Si l'API retourne une erreur, affiche le message d'erreur retourné par l'API
      Alert.alert('Erreur', result.message);
    }
  } catch (error) {
    // En cas d'exception (par exemple, problème de réseau ou serveur), affiche un message générique d'erreur
    Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
  } finally {
    setLoading(false); // Arrêt de l'indicateur de chargement une fois le processus terminé
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
