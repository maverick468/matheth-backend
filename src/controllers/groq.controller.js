// src/controllers/groq.controller.js
import { groqService } from '../services/groq.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const handleRealtimeChat = async (req, res, next) => {
  try {
    const response = await groqService.chatCompletion(req.body);
    return apiResponse.success(res, 200, 'Realtime chat response generated', response);
  } catch (error) {
    next(error);
  }
};

export const generateQuickHint = async (req, res, next) => {
  try {
    const hint = await groqService.quickHint(req.body);
    return apiResponse.success(res, 200, 'Hint generated successfully', hint);
  } catch (error) {
    next(error);
  }
};