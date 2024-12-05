import { authorize } from 'react-native-app-auth';
import { saveUserData } from '../utils/userStorage';
import api from '../secureApiRequest';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL } from '@env'; // Importer les variables d'environnement


// Configuration OAuth Google
// Configuration OAuth Google avec les variables d'environnement
const config = {
  issuer: "https://accounts.google.com",
  clientId: GOOGLE_CLIENT_ID,
  redirectUrl: GOOGLE_REDIRECT_URL,
  scopes: ['openid', 'profile', 'email'],
  usePKCE: true, // Active PKCE pour une sécurité renforcée
};


// Fonction pour supprimer les données utilisateur lors de la déconnexion
export const logoutUser = async () => {
  try {
    // Appeler saveUserData pour effacer les données
    await saveUserData(); // Les paramètres sont nulls, donc ça va supprimer les données
  } catch (error) {
    console.error('Erreur lors de la déconnexion de l’utilisateur:', error);
  }
};

// Fonction pour gérer la connexion via Google
export const googleLogin = async () => {
  try {
    // Authentification OAuth via Google
    const authState = await authorize(config); // `authorize` retourne l'état d'authentification avec `idToken` et `accessToken`
    const { idToken, accessToken } = authState;

    // Appel à l'API backend pour vérifier et gérer les jetons
    const response = await api.post('/google-login', {
      idToken,
      accessToken, // Ce token pourrait être optionnel selon l'implémentation de l'API
    });

    if (response.status === 200) {
      const { tokens, user } = response.data;
      const { refreshToken, accessToken: newAccessToken } = tokens;

      // Sauvegarder les données utilisateur (tokens et informations utilisateur) de manière sécurisée
      await saveUserData(user, 'google', newAccessToken, refreshToken);

      console.log('Connexion réussie via Google');
      return { success: true, message: 'Vous êtes connecté !' };
    } else {
      return { success: false, message: response.data.message || 'Erreur lors de la connexion.' };
    }
  } catch (error) {
    if (error.message.includes('User cancelled flow')) {
      return { success: false, silent: true }; // Cas où l'utilisateur annule la connexion
    }
    console.error('Erreur lors de la connexion avec Google:', error);
    return { success: false, message: 'Impossible de se connecter avec Google.' };
  }
};

// Fonction pour gérer la connexion par email et mot de passe
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", {
      email: credentials.email,
      password: credentials.password,
    });
 // Vérifie si l'utilisateur a bien été créé avec un statut HTTP 201
 if (response.status === 200) {
  const { tokens, user } = response.data;
  const { accessToken, refreshToken } = tokens;

  // Sauvegarde des données utilisateur
  await saveUserData(user, 'form', accessToken, refreshToken);

  console.log('Utilisateur enregistré avec succès');
  return { success: true, data: response.data };
} else {
  console.error('Statut HTTP inattendu:', response.status);
  return { success: false, message: 'Erreur lors de l’inscription' };
}
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Une erreur est survenue',
    };
  }
};

export const registerUser = async (userData) => {
  try {
    // Envoie de la requête POST au backend pour enregistrer l'utilisateur
    const response = await api.post("/register", userData);

    // Vérifie si l'utilisateur a bien été créé avec un statut HTTP 201
    if (response.status === 200) {
      const { tokens, user } = response.data;
      const { accessToken, refreshToken } = tokens;

      // Sauvegarde des données utilisateur
      await saveUserData(user, 'form', accessToken, refreshToken);

      console.log('Utilisateur enregistré avec succès');
      return { success: true, data: response.data };
    } else {
      console.error('Statut HTTP inattendu:', response.status);
      return { success: false, message: 'Erreur lors de l’inscription' };
    }
  } catch (error) {
    console.error('Erreur lors de l’inscription:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Une erreur est survenue',
    };
  }
};

// Fonction pour gérer la demande de réinitialisation de mot de passe
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/forgot-password", { email });

    if (response.status === 200) {
      console.log('E-mail de réinitialisation envoyé');
      return { success: true, message: 'Un e-mail de réinitialisation a été envoyé.' };
    } else {
      return { success: false, message: response.data.message || 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation.' };
    }
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
    return { success: false, message: 'Impossible de traiter votre demande.' };
  }
};