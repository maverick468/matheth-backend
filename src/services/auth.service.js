// backend/src/services/auth.service.js
import { getAuth } from 'firebase-admin/auth';
import { db } from '../config/firebaseAdmin.js';

export const authService = {
  async registerUser(userData) {
    const { firebaseUid, email, name, fullName } = userData;
    const userDisplayName = name || fullName || 'User';
    const uid = firebaseUid; 

    if (!uid) {
      throw new Error('firebaseUid is required for registration.');
    }

    const docRef = db.collection('users').doc(uid);
    const doc = await docRef.get();

    if (doc.exists) {
      return { message: "User already synced", user: doc.data() };
    }

    const newUser = {
      uid,
      email,
      name: userDisplayName,
      createdAt: new Date().toISOString(),
      role: 'student'
    };

    await docRef.set(newUser);
    return { message: "User registered successfully", user: newUser };
  },

  async loginUser(credentials) {
    // Handled via token verification middleware on login route
    const { firebaseUid, email } = credentials;
    const uid = firebaseUid;
    
    const userProfileDoc = await db.collection('users').doc(uid).get();
    const profile = userProfileDoc.exists ? userProfileDoc.data() : { email };

    return {
      user: {
        uid,
        email,
        ...profile
      }
    };
  },

  async getUserProfile(uid) {
    const docRef = await db.collection('users').doc(uid).get();
    if (!docRef.exists) {
      throw new Error('User profile not found');
    }
    return docRef.data();
  }
};