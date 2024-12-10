import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { resetPassword } from '../../services/authService';
import { clearUserData } from '../../utils/userStorage'; // Fonction pour effacer les données de l'utilisateur

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [token, setToken] = useState(route.params?.token);
  const [loading, setLoading] = useState(false);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);

  // Déconnecte l'utilisateur et redirige vers la page de réinitialisation
  const logoutUser = async () => {
    await clearUserData(); // Efface les données utilisateur (comme le token)
    Alert.alert('Session terminée', 'Vous avez été déconnecté pour des raisons de sécurité. Veuillez réinitialiser votre mot de passe.');
    navigation.navigate('Login'); // Redirige vers l'écran de connexion
  };

  useEffect(() => {
    const handleUrl = (event) => {
      if (isTokenProcessed) return;
      const urlParts = event.url.split('/reset-password/');
      if (urlParts.length > 1) {
        const tokenFromUrl = urlParts[1];
        if (tokenFromUrl && tokenFromUrl.trim() !== '') {
          setToken(tokenFromUrl);
          setIsTokenProcessed(true);
          logoutUser(); // Déconnecte l'utilisateur dès l'accès au lien
        } else {
          Alert.alert('Erreur', 'Le token de réinitialisation est vide ou invalide.');
        }
      } else {
        Alert.alert('Erreur', 'Le format de l\'URL est incorrect.');
      }
    };

    const subscription = Linking.addListener('url', handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [isTokenProcessed]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .required('Mot de passe requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
      .required('Confirmation du mot de passe requise'),
  });

  const handleResetPassword = async (values) => {
    if (!token) {
      Alert.alert('Erreur', 'Le token de réinitialisation est manquant.');
      return;
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
