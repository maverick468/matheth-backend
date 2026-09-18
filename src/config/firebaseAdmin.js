import admin from 'firebase-admin';
import { serviceAccount } from './serviceAccount.js';

// Sanitize the private key to remove any editor indentation or line-ending mismatches
if (serviceAccount && serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key
    .replace(/\\n/g, '\n') // Handle literal escaped newlines if present
    .split('\n')
    .map(line => line.trim()) // Strip accidental leading/trailing spaces from auto-indentation
    .join('\n');
}

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
export default admin;