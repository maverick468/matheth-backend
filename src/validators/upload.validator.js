// src/validators/upload.validator.js
import Joi from 'joi';

export const uploadValidator = Joi.object({
  fileType: Joi.string().optional(),
});