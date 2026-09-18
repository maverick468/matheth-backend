// src/controllers/referral.controller.js
import { referralService } from '../services/referral.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const getReferralStats = async (req, res, next) => {
  try {
    const stats = await referralService.fetchReferralStats(req.user.uid);
    return apiResponse.success(res, 200, 'Referral stats fetched', stats);
  } catch (error) {
    next(error);
  }
};

export const createReferralCode = async (req, res, next) => {
  try {
    const code = await referralService.generateReferralCode(req.user.uid);
    return apiResponse.success(res, 201, 'Referral code generated', code);
  } catch (error) {
    next(error);
  }
};