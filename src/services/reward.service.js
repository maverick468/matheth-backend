// src/services/reward.service.js
export const rewardService = {
  calculateReward(score) {
    // 1 point per 10 score points as a base reward rule
    return Math.floor(score / 10);
  }
};