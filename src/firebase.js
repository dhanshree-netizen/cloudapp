// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkAx8riWpLuVooDvinckoIcmcOuG5Wa3I",
  authDomain: "cloudapp-18a28.firebaseapp.com",
  projectId: "cloudapp-18a28",
  storageBucket: "cloudapp-18a28.firebasestorage.app",
  messagingSenderId: "211077364587",
  appId: "1:211077364587:web:e6c7c3e47cc5cf7744aa2e",
  measurementId: "G-SG7SCH07Y4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
