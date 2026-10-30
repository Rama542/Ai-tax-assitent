// AI TaxOS Backend - Firebase Admin SDK (v12+)
const {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { getAuth } = require('firebase-admin/auth');

let db = null;
let storage = null;
let authAdmin = null;

if (getApps().length === 0) {
  try {
    let app;
    try {
      const serviceAccount = require('./serviceAccountKey.json');
      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
      });
      console.log('✅ Firebase Admin initialized with serviceAccountKey.json');
    } catch {
      if (process.env.FIREBASE_PROJECT_ID) {
        app = initializeApp({
          credential: applicationDefault(),
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('✅ Firebase Admin initialized with env vars');
      } else {
        console.warn('⚠️  Firebase not configured — running in demo mode');
        app = null;
      }
    }

    if (app) {
      db = getFirestore();
      storage = getStorage();
      authAdmin = getAuth();
    }
  } catch (err) {
    console.warn('⚠️  Firebase init error:', err.message, '— running in demo mode');
  }
}

module.exports = { db, storage, authAdmin };
