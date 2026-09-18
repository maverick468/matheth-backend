// src/services/badge.service.js
import { db } from '../config/firebaseAdmin.js';

export const badgeService = {
  async fetchUserBadges(userId) {
    const snapshot = await db.collection('user_badges')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async claimUserBadge(userId, badgeId) {
    const claimRef = db.collection('user_badges').doc();
    const claimData = { userId, badgeId, claimedAt: new Date().toISOString() };
    await claimRef.set(claimData);
    return { success: true, claimId: claimRef.id };
  }
};