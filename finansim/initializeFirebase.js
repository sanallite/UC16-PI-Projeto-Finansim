// Import the functions you need from the Firebase SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore";

/* Importando a componente de armazenamento assíncrono */
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnvyntMWiNO-tLgQ11Uq47sh6n_i_yAdc",
  authDomain: "sanallite-finansim.firebaseapp.com",
  projectId: "sanallite-finansim",
  storageBucket: "sanallite-finansim.appspot.com",
  messagingSenderId: "477598190655",
  appId: "1:477598190655:android:a31b98f2888917752bbc8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase Analytics
isSupported().then( ( temSuporte ) => {
    if ( temSuporte ) {
      const analytics = getAnalytics(app);
      console.log('Analytics do Firebase iniciada.');
    }

    else {
      console.log('Ambiente sem suporte ao Firebase Analytics');
    }
  } ).catch ( (erro) => {
    console.error('Erro na checagem do suporte ao Firebase Analytics: '+erro);
  } );

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);