// src/repositories/session.repository.js
import { db } from '../config/firebaseAdmin.js';

const collection = db.collection('game_sessions');

export const sessionRepository = {
  async create(data) {
    const ref = collection.doc();
    const sessionData = { ...data, startTime: new Date().toISOString() };
    await ref.set(sessionData);
    return { sessionId: ref.id, ...sessionData };
  },

  async update(sessionId, data) {
    await collection.doc(sessionId).update(data);
    const doc = await collection.doc(sessionId).get();
    return { id: doc.id, ...doc.data() };
  },

  async findByUserId(userId) {
    const snapshot = await collection
      .where('userId', '==', userId)
      .orderBy('startTime', 'desc')
      .limit(10)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};