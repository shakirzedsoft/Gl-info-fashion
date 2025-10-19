// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6xR9HyAd2Olt9s_IZfzr4cR-Y3di9Xxo",
  authDomain: "testfashion-7b9ae.firebaseapp.com",
  projectId: "testfashion-7b9ae",
  storageBucket: "testfashion-7b9ae.firebasestorage.app",
  messagingSenderId: "473464626605",
  appId: "1:473464626605:web:114a10295447f7ce929524",
  measurementId: "G-M3TCR5QV5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
