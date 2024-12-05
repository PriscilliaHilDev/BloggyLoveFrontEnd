import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Pour récupérer le token depuis l'URL
import * as Yup from 'yup';
import { Formik } from 'formik';
import { resetPassword } from '../../services/authService'; // Appelle la fonction API

const ResetPasswordScreen = ({ navigation }) => {
  const route = useRoute(); // Récupérer le token depuis l'URL
  const [token, setToken] = useState(route.params?.token); // Initialisation du token
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUrl = (event) => {
      const { path } = event.url;
      // Extraction du token de l'URL
      const tokenFromUrl = path?.split('/reset-password/')[1];
      if (tokenFromUrl) {
        setToken(tokenFromUrl); // Mettre à jour le token
      } else {
        Alert.alert('Erreur', 'Le token de réinitialisation est manquant.');
      }
    };

    Linking.addEventListener('url', handleUrl);

    // Vérification au démarrage de l'application si une URL est déjà ouverte
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url }); // Gérer l'URL initiale
      }
    });

    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);

  // Validation des champs
  const validationSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').required('Mot de passe requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
      .required('Confirmation du mot de passe requise'),
  });

  // Vérifier la présence du token
  useEffect(() => {
    if (token) {
      console.log('Token reçu :', token);
    }
  }, [token]);

  // Fonction de réinitialisation du mot de passe
  const handleResetPassword = async (values) => {
    if (!token) {
      Alert.alert('Erreur', 'Le token de réinitialisation est manquant.');
      return; // Ne pas tenter de réinitialisation sans token
    }
    setLoading(true);
    try {
      const result = await resetPassword(token, values.password);

      if (result.success) {
        Alert.alert('Succès', 'Votre mot de passe a été réinitialisé avec succès.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Erreur', result.message);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
