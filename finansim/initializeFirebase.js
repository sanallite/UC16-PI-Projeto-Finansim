// Import the functions you need from the Firebase SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);