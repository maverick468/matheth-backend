// src/controllers/leaderboard.controller.js
import { gameService } from '../services/game.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await gameService.fetchLeaderboard(req.query);
    return apiResponse.success(res, 200, 'Leaderboard fetched successfully', leaderboard);
  } catch (error) {
    next(error);
  }
};

export const getUserRank = async (req, res, next) => {
  try {
    const rank = await gameService.fetchUserRank(req.user.uid);
    return apiResponse.success(res, 200, 'User rank fetched successfully', rank);
  } catch (error) {
    next(error);
  }
};