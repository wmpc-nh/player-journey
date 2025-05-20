// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1U_CIEto_AvcWlE6eWUltwdG96qBBOTg",
  authDomain: "player-journey.firebaseapp.com",
  databaseURL: "https://player-journey-default-rtdb.firebaseio.com",
  projectId: "player-journey",
  storageBucket: "player-journey.firebasestorage.app",
  messagingSenderId: "1015659019066",
  appId: "1:1015659019066:web:7021549d0140efb1fbee03",
  measurementId: "G-2XQ9M9QFBY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, db, auth, googleProvider };
