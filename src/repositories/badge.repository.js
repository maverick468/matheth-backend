// src/repositories/badge.repository.js
import { db } from '../config/firebaseAdmin.js';

const collection = db.collection('user_badges');

export const badgeRepository = {
  async findByUserId(userId) {
    const snapshot = await collection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    const ref = collection.doc();
    const badgeData = { ...data, claimedAt: new Date().toISOString() };
    await ref.set(badgeData);
    return { id: ref.id, ...badgeData };
  }
};