// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXrIcpGByxVUS6wBbUE5gCXNv1Mna7ovc",
  authDomain: "angular-bc8c1.firebaseapp.com",
  projectId: "angular-bc8c1",
  storageBucket: "angular-bc8c1.firebasestorage.app",
  messagingSenderId: "542394680343",
  appId: "1:542394680343:web:08ced17a6cb1dea11cc852",
  measurementId: "G-GHKM5PFCWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);