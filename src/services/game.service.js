// src/services/game.service.js
import { db } from '../config/firebaseAdmin.js';
import { scoringService } from './scoring.service.js';
import { rewardService } from './reward.service.js';

export const gameService = {
  async initializeGameSession(userId, data) {
    const sessionRef = db.collection('game_sessions').doc();
    const sessionData = {
      userId,
      subject: data.subject || 'general',
      score: 0,
      startTime: new Date().toISOString(),
      status: 'active',
    };
    await sessionRef.set(sessionData);
    return { sessionId: sessionRef.id, ...sessionData };
  },

  async processGameSubmission(userId, data) {
    const { sessionId, answers } = data;
    const score = scoringService.calculateScore(answers);
    const reward = rewardService.calculateReward(score);

    const sessionRef = db.collection('game_sessions').doc(sessionId);
    await sessionRef.update({ score, status: 'completed', reward });

    const userRef = db.collection('users').doc(userId);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentPoints = userDoc.exists ? (userDoc.data().points || 0) : 0;
      transaction.update(userRef, { points: currentPoints + reward });
    });

    return { score, reward };
  },

  async fetchUserGameHistory(userId) {
    const snapshot = await db.collection('game_sessions')
      .where('userId', '==', userId)
      .orderBy('startTime', 'desc')
      .limit(10)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async fetchLeaderboard() {
    const snapshot = await db.collection('users')
      .orderBy('points', 'desc')
      .limit(10)
      .get();
    return snapshot.docs.map((doc, index) => ({ rank: index + 1, id: doc.id, ...doc.data() }));
  },

  async fetchUserRank(userId) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return { rank: null };
    const userPoints = userDoc.data().points || 0;
    
    const higherSnapshot = await db.collection('users')
      .where('points', '>', userPoints)
      .get();
    return { rank: higherSnapshot.size + 1 };
  }
};