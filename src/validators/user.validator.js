// backend/src/validators/user.validator.js
import Joi from 'joi';

export const userValidator = {
  register: Joi.object({
    firebaseUid: Joi.string().required(), // 👈 Must be allowed/required
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    // ❌ Do NOT put password here, because Firebase handles passwords on the client!
  }),

  login: Joi.object({
    // Login uses the Firebase Bearer token in the header, 
    // so body validation can be empty or allowed to have unknown fields:
  }).unknown(true),

  update: Joi.object({
    name: Joi.string().optional(),
    bio: Joi.string().optional(),
    avatarUrl: Joi.string().uri().optional(),
  }),
};