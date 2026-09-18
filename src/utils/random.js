// src/utils/random.js
import crypto from 'crypto';

export const random = {
  string(length = 6) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  },
  number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};