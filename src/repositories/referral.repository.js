// src/repositories/referral.repository.js
import { db } from '../config/firebaseAdmin.js';

const referralCodesCol = db.collection('referral_codes');
const referralsCol = db.collection('referrals');

export const referralRepository = {
  async findStats(userId) {
    const snapshot = await referralsCol.where('referrerId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data());
  },

  async saveCode(userId, codeData) {
    const fullData = { ...codeData, createdAt: new Date().toISOString() };
    await referralCodesCol.doc(userId).set(fullData);
    return fullData;
  }
};