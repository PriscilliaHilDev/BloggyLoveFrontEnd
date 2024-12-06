import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  // Déclaration d'état pour le chargement (lorsque l'enregistrement est en cours)
const [isLoading, setIsLoading] = useState(false);

// Schéma de validation du formulaire avec Yup pour assurer la validité des champs
const validationSchema = Yup.object().shape({
  // Validation du champ 'name' pour s'assurer qu'il est requis
  name: Yup.string().required('Le nom est requis'),
  
  // Validation du champ 'email' pour vérifier qu'il a un format valide et qu'il est requis
  email: Yup.string().email('Email invalide').required('Email est requis'),
  
  // Validation du mot de passe : il doit contenir au moins 6 caractères et être requis
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe est requis'),
  
  // Validation de la confirmation du mot de passe : il doit correspondre au mot de passe
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});

const handleRegister = async (values, resetForm) => {
  // On récupère les valeurs du formulaire : nom, email et mot de passe
  const { name, email, password } = values;
  
  // On met l'état de chargement à true pour afficher un indicateur de chargement pendant l'enregistrement
  setIsLoading(true);

  try {
    // On appelle la fonction d'enregistrement avec les données du formulaire
    const result = await registerUser({ name, email, password });

    // Si l'enregistrement est réussi
    if (result.success) {
      // On réinitialise le formulaire pour le vider et enlever les erreurs
      resetForm();  // Tous les champs et erreurs sont réinitialisés

      // Petite pause avant la navigation, pour éviter les erreurs de rendu de la navigation
      setTimeout(() => {
        // On navigue vers la page de connexion après un enregistrement réussi
        navigation.navigate('Login');
      }, 500); // Délai pour éviter le bug de navigation immédiate

      // On affiche une alerte pour informer que l'enregistrement a réussi
      Alert.alert('Enregistrement réussit', 'Compte créé !');
    } else {
      // Si l'API renvoie une erreur, on l'affiche
      Alert.alert('Erreur', result.message);
    }
  } catch (error) {
    // Si une erreur inattendue survient (ex. problème réseau), on affiche un message générique
    Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
  } finally {
    // Quel que soit le résultat, on désactive le chargement à la fin
    setIsLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Inscription</Text>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => handleRegister(values, resetForm)} // appel de handleregister
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                  placeholder="Nom"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="Email"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                  placeholder="Mot de passe"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.confirmPassword && errors.confirmPassword ? styles.inputError : null,
                  ]}
                  placeholder="Confirmer le mot de passe"
                  secureTextEntry
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Chargement...</Text>
                ) : (
                  <Text style={styles.submitButtonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Vous avez déjà un compte ? Connectez-vous</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RegisterScreen;
