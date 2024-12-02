import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../../services/authService'; // Importer la fonction forgotPassword

const ForgotPasswordScreen = ({ navigation }) => {
    const [loading, setLoading] = React.useState(false);
  
    const validationSchema = Yup.object().shape({
      email: Yup.string().email('Email invalide').required('Email est requis'),
    });
  
    const handleForgotPassword = async (values) => {
      setLoading(true);
      try {
        const result = await forgotPassword(values);
        setLoading(false);
  
        if (result.success) {
            // Assure-toi que la navigation ne se fait pas pendant le rendu
            setTimeout(() => {
              navigation.navigate('Login'); // Naviguer vers la page de connexion
            }, 500); // Délai pour éviter l'erreur
            Alert.alert('Réinitialisation envoyée', 'Un e-mail de réinitialisation a été envoyé à votre adresse.');
          } else {
            Alert.alert('Erreur', result.message);
          }
        } catch (error) {
          Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
        }
    };
  
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Mot de passe oublié</Text>
  
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleForgotPassword(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
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
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Envoi en cours...' : 'Réinitialiser mot de passe'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
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
});

export default ForgotPasswordScreen;
