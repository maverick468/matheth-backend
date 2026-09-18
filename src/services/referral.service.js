// src/services/referral.service.js
import { db } from '../config/firebaseAdmin.js';
import crypto from 'crypto';

export const referralService = {
  async fetchReferralStats(userId) {
    const snapshot = await db.collection('referrals')
      .where('referrerId', '==', userId)
      .get();
    const referrals = snapshot.docs.map(doc => doc.data());
    return { totalReferrals: referrals.length, referrals };
  },

  async generateReferralCode(userId) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    await db.collection('referral_codes').doc(userId).set({ code, createdAt: new Date().toISOString() });
    return { code };
  }
};