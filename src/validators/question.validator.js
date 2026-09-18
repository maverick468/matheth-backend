// src/validators/question.validator.js
import Joi from 'joi';

export const questionValidator = {
  create: Joi.object({
    subject: Joi.string().required(),
    questionText: Joi.string().required(),
    options: Joi.array().items(Joi.string()).min(2).required(),
    correctAnswer: Joi.string().required(),
    explanation: Joi.string().optional(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
  }),
};