const admin = require('firebase-admin');
require('dotenv').config();

let db;

const initializeFirebase = () => {
  try {
    // Try to initialize with service account from environment
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else if (!admin.apps.length) {
      // Initialize with default credentials (for local development)
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }
    
    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
    return { admin, db };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

// Initialize on module load
if (!admin.apps.length) {
  initializeFirebase();
} else {
  db = admin.firestore();
}

module.exports = { admin, db, initializeFirebase };
