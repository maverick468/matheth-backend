// src/repositories/question.repository.js
import { db } from '../config/firebaseAdmin.js';

const collection = db.collection('questions');

export const questionRepository = {
  async findById(id) {
    const doc = await collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async findMany(query = {}) {
    let ref = collection;
    if (query.subject) {
      ref = ref.where('subject', '==', query.subject);
    }
    const snapshot = await ref.limit(20).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    const ref = collection.doc();
    const questionData = { ...data, createdAt: new Date().toISOString() };
    await ref.set(questionData);
    return { id: ref.id, ...questionData };
  }
};