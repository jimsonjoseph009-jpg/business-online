import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA8-W-_Je5LyZ3lK20W7QSGg1Dvx2h2Wgc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "business-online-592f6.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "business-online-592f6",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "business-online-592f6.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "114143559872",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:114143559872:web:7e9038f9813367f1c22d25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
