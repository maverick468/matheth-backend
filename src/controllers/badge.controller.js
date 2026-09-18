// src/controllers/badge.controller.js
import { badgeService } from '../services/badge.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const getUserBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.fetchUserBadges(req.user.uid);
    return apiResponse.success(res, 200, 'User badges retrieved', badges);
  } catch (error) {
    next(error);
  }
};

export const claimBadge = async (req, res, next) => {
  try {
    const result = await badgeService.claimUserBadge(req.user.uid, req.body.badgeId);
    return apiResponse.success(res, 200, 'Badge claimed successfully', result);
  } catch (error) {
    next(error);
  }
};