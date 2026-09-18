import admin from 'firebase-admin';
import { serviceAccount } from './serviceAccount.js';

// Normalize the private key to fix OpenSSL 3 / Node 24 line-ending issues
if (serviceAccount && serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key
    .replace(/\\n/g, '\n')    // Handle literal backslash-n if copied that way
    .replace(/\r\n/g, '\n');  // Strip Windows CRLF carriage returns
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