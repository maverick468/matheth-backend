// src/services/scoring.service.js
export const scoringService = {
  calculateScore(answers) {
    let score = 0;
    if (!Array.isArray(answers)) return score;
    answers.forEach(ans => {
      if (ans.isCorrect) {
        score += ans.points || 10;
      }
    });
    return score;
  }
};