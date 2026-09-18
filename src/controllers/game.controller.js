// src/controllers/game.controller.js
import { gameService } from '../services/game.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const startGame = async (req, res, next) => {
  try {
    const session = await gameService.initializeGameSession(req.user.uid, req.body);
    return apiResponse.success(res, 201, 'Game session started', session);
  } catch (error) {
    next(error);
  }
};

export const submitScore = async (req, res, next) => {
  try {
    const result = await gameService.processGameSubmission(req.user.uid, req.body);
    return apiResponse.success(res, 200, 'Score submitted successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getGameHistory = async (req, res, next) => {
  try {
    const history = await gameService.fetchUserGameHistory(req.user.uid);
    return apiResponse.success(res, 200, 'Game history retrieved', history);
  } catch (error) {
    next(error);
  }
};