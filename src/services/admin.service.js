// backend/src/services/admin.service.js
import { db } from '../config/firebaseAdmin.js';

export const adminService = {
  async addQuestionBatch(batchData) {
    const { subject, grade, difficulty, questions } = batchData;

    // Validate inputs
    if (!subject || !grade || !difficulty || !questions) {
      throw new Error('Subject, grade, difficulty, and questions are required.');
    }

    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Admin must add questions in exact multiples of 10 to form a unique level.');
    }

    // Validate each question structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.question || 
        !Array.isArray(q.choices) || 
        q.choices.length !== 4 || 
        q.correctIndex === undefined || 
        q.correctIndex < 0 || 
        q.correctIndex > 3
      ) {
        throw new Error(`Question at index ${i} is invalid. Each question must have text, 4 choices, and a valid correctIndex (0-3).`);
      }
    }

    // Determine the next level number for this unique combination
    const levelsRef = db.collection('question_levels');
    const querySnapshot = await levelsRef
      .where('subject', '==', subject)
      .where('grade', '==', String(grade))
      .where('difficulty', '==', difficulty)
      .get();

    const nextLevelNumber = querySnapshot.size + 1;

    // Create unique level document
    const levelDocRef = levelsRef.doc();
    const newLevelData = {
      id: levelDocRef.id,
      subject,
      grade: String(grade),
      difficulty,
      levelNumber: nextLevelNumber,
      questions,
      createdAt: new Date().toISOString()
    };

    await levelDocRef.set(newLevelData);

    return {
      success: true,
      message: `Successfully created Level ${nextLevelNumber} for ${subject} (Grade ${grade}, ${difficulty}) with 10 questions.`,
      level: newLevelData
    };
  },

  async updateQuestionBatch(levelId, batchData) {
    const { subject, grade, difficulty, levelNumber, questions } = batchData;

    const levelRef = db.collection('question_levels').doc(levelId);
    const doc = await levelRef.get();

    if (!doc.exists) {
      throw new Error('Level not found.');
    }

    // Validate questions if provided
    if (questions) {
      if (!Array.isArray(questions) || questions.length !== 10) {
        throw new Error('Admin must provide questions in exact multiples of 10 to form a unique level.');
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (
          !q.question || 
          !Array.isArray(q.choices) || 
          q.choices.length !== 4 || 
          q.correctIndex === undefined || 
          q.correctIndex < 0 || 
          q.correctIndex > 3
        ) {
          throw new Error(`Question at index ${i} is invalid. Each question must have text, 4 choices, and a valid correctIndex (0-3).`);
        }
      }
    }

    const existingData = doc.data();
    const updatedSubject = subject !== undefined ? subject : existingData.subject;
    const updatedGrade = grade !== undefined ? String(grade) : existingData.grade;
    const updatedDifficulty = difficulty !== undefined ? difficulty : existingData.difficulty;
    const updatedLevelNumber = levelNumber !== undefined ? Number(levelNumber) : existingData.levelNumber;
    const updatedQuestions = questions !== undefined ? questions : existingData.questions;

    const updatedData = {
      subject: updatedSubject,
      grade: updatedGrade,
      difficulty: updatedDifficulty,
      levelNumber: updatedLevelNumber,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    };

    await levelRef.update(updatedData);

    return {
      success: true,
      message: `Successfully updated Level ${updatedLevelNumber} for ${updatedSubject} (Grade ${updatedGrade}, ${updatedDifficulty}).`,
      level: { id: levelId, ...existingData, ...updatedData }
    };
  },

  async getAllLevels() {
    const snapshot = await db.collection('question_levels').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async deleteLevel(levelId) {
    const levelRef = db.collection('question_levels').doc(levelId);
    const doc = await levelRef.get();
    
    if (!doc.exists) {
      throw new Error('Level not found.');
    }

    await levelRef.delete();
    return { success: true, message: 'Level successfully deleted.' };
  }
};