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
  } else {
    // Otherwise, use environment variables (production / Render)
    let rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    
    // Remove accidental surrounding quotes if present
    rawKey = rawKey.replace(/^["']|["']$/g, '');
    
    // Convert literal \n text to real newlines and strip carriage returns
    const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/\r/g, '');

    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: formattedKey,
    });
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