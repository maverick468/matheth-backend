// backend/src/controllers/question.controller.js
import { db } from '../config/firebaseAdmin.js';

export const questionController = {
  async getAvailableLevels(req, res) {
    try {
      const { subject, grade, difficulty } = req.query;

      let query = db.collection('question_levels');

      if (subject) query = query.where('subject', '==', subject);
      if (grade) query = query.where('grade', '==', String(grade));
      if (difficulty) query = query.where('difficulty', '==', difficulty);

      const snapshot = await query.orderBy('levelNumber', 'asc').get();
      const levels = snapshot.docs.map(doc => ({
        id: doc.id,
        subject: doc.data().subject,
        grade: doc.data().grade,
        difficulty: doc.data().difficulty,
        levelNumber: doc.data().levelNumber,
        questionCount: doc.data().questions.length,
        createdAt: doc.data().createdAt
      }));

      res.status(200).json({ success: true, levels });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getLevelQuestions(req, res) {
    try {
      const { levelId } = req.params;
      const docRef = await db.collection('question_levels').doc(levelId).get();

      if (!docRef.exists) {
        return res.status(404).json({ success: false, message: 'Level not found.' });
      }

      res.status(200).json({ success: true, level: docRef.data() });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};