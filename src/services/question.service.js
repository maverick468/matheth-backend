import { db } from '../config/firebaseAdmin.js';

export const questionService = {
  async fetchQuestions(query) {
    let ref = db.collection('questions');
    if (query.subject) {
      ref = ref.where('subject', '==', query.subject);
    }
    const snapshot = await ref.limit(20).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async fetchQuestionById(id) {
    const doc = await db.collection('questions').doc(id).get();
    if (!doc.exists) throw new Error('Question not found');
    return { id: doc.id, ...doc.data() };
  },

  async createNewQuestion(data) {
    const ref = db.collection('questions').doc();
    const questionData = { ...data, createdAt: new Date().toISOString() };
    await ref.set(questionData);
    return { id: ref.id, ...questionData };
  },

  async saveBatchQuestions(questionsArray, metadata = {}) {
    const batch = db.batch();
    const savedQuestions = [];

    for (const q of questionsArray) {
      const ref = db.collection('questions').doc();
      const questionData = {
        ...q,
        ...metadata,
        createdAt: new Date().toISOString()
      };
      batch.set(ref, questionData);
      savedQuestions.push({ id: ref.id, ...questionData });
    }

    await batch.commit();
    return savedQuestions;
  }
};