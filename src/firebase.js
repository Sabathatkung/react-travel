// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ใส่ค่าการตั้งค่า Firebase ของคุณ
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

// Export Firestore database
export const db = getFirestore(app);