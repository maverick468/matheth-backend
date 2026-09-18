import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let credential;

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const keyPath = path.join(__dirname, '../serviceAccountKey.json');

  // If the local file exists (development), use it
  if (fs.existsSync(keyPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  } 
  // Otherwise, use the single JSON environment variable in production (Render)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    
    // Sanitize the private key to fix any newline or carriage return issues for OpenSSL 3
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key
        .replace(/\\n/g, '\n')
        .replace(/\r/g, '');
    }

    credential = admin.credential.cert(serviceAccount);
  } else {
    throw new Error('No Firebase credentials found (missing serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT_JSON)');
  }
} catch (error) {
  console.error('Firebase credential loading error:', error);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential || admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
export default admin;