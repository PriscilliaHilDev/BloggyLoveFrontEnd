import EncryptedStorage from 'react-native-encrypted-storage'; // Import de EncryptedStorage pour un stockage sécurisé



// Fonction pour sauvegarder les données utilisateur de manière sécurisée
export const saveUserData = async (user, authSource, accessToken, refreshToken) => {
  try {
    // Vérification de la validité des données avant de les sauvegarder
    if (!user || !accessToken || !refreshToken) {
      throw new Error('Données utilisateur manquantes');
    }

    // Convertir l'objet 'user' en JSON pour le sauvegarder
    await EncryptedStorage.setItem('user', JSON.stringify(user)); // Conversion en JSON

    // Sauvegarde des autres données sous forme de chaîne
    await EncryptedStorage.setItem('auth_source', authSource);
    await EncryptedStorage.setItem('accessToken', accessToken);
    await EncryptedStorage.setItem('refreshToken', refreshToken);

    console.log('Données utilisateur sauvegardées avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données utilisateurs:', error);
  }
};


// Fonction pour récupérer les données utilisateur (nom, source, tokens)
export const getUserData = async () => {
  try {
    const user = await EncryptedStorage.getItem('user');
    const authSource = await EncryptedStorage.getItem('auth_source');
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const refreshToken = await EncryptedStorage.getItem('refreshToken');

    // Vérifier si les données sont présentes
    if (!user || !authSource || !accessToken || !refreshToken) {
      console.error('Certaines données sont manquantes');
      return null;
    }

    // Retourner les données utilisateur sous forme d'objet
    return {
      user,
      authSource,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateurs:', error);
    return null;
  }
};