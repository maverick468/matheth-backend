// backend/routes/question.routes.js
import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

// GET /api/questions
router.get('/', async (req, res) => {
  try {
    const db = admin.firestore();
    // Updated to match your exact Firestore collection name: 'question_levels'
    const snapshot = await db.collection('question_levels').get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    let allQuestions = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.questions && Array.isArray(data.questions)) {
        const batchQuestions = data.questions.map((q, idx) => ({
          id: `${doc.id}_q_${idx}`,
          levelId: doc.id,
          subject: data.subject,
          grade: data.grade,
          difficulty: data.difficulty,
          levelNumber: data.levelNumber,
          ...q
        }));
        allQuestions = allQuestions.concat(batchQuestions);
      }
    });

    res.status(200).json(allQuestions);
  } catch (err) {
    console.error('Detailed Error fetching questions:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;