// src/validators/game.validator.js
import Joi from 'joi';

export const gameValidator = {
  start: Joi.object({
    subject: Joi.string().required(),
  }),
  submit: Joi.object({
    sessionId: Joi.string().required(),
    answers: Joi.array().items(
      Joi.object({
        questionId: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
        points: Joi.number().optional(),
      })
    ).required(),
  }),
};