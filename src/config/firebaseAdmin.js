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
    
    // Remove surrounding quotes if present and trim whitespace
    rawKey = rawKey.replace(/^["']|["']$/g, '').trim();

    // Render's text box often squashes multi-line keys into a single line with spaces.
    // This automatically detects a squished key, strips spaces, and rebuilds proper PEM formatting:
    if (!rawKey.includes('\n') && rawKey.includes('-----BEGIN PRIVATE KEY-----')) {
      const base64Content = rawKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s+/g, ''); // Strip all spaces and broken line artifacts
      
      const chunked = base64Content.match(/.{1,64}/g).join('\n');
      rawKey = `-----BEGIN PRIVATE KEY-----\n${chunked}\n-----END PRIVATE KEY-----`;
    } else {
      // Fallback for literal \n strings if they came through
      rawKey = rawKey.replace(/\\n/g, '\n').replace(/\r/g, '');
    }

    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: rawKey,
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