// src/middleware/requireAdmin.js
import { apiResponse } from '../utils/apiResponse.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return apiResponse.error(res, 403, 'Forbidden: Admin access required');
  }
  next();
};