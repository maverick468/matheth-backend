// src/middleware/validateRequest.js
import { apiResponse } from '../utils/apiResponse.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return apiResponse.error(res, 400, `Validation Error: ${errorMessage}`);
    }
    req.body = value;
    next();
  };
};