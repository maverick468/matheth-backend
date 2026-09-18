import admin from 'firebase-admin';
import { serviceAccount } from './serviceAccount.js';

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
export default admin;