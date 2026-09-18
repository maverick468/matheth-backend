// src/services/groq.service.js
import Groq from 'groq-sdk';
import { config } from '../config/environment.js';

const groq = new Groq({ apiKey: config.ai.groqApiKey });

export const groqService = {
  async chatCompletion(data) {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: data.prompt }],
    });
    return { response: completion.choices[0]?.message?.content || '' };
  },

  async quickHint(data) {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: 'Provide a brief, helpful hint for a student solving a math problem.' }, { role: 'user', content: data.question }],
    });
    return { hint: completion.choices[0]?.message?.content || '' };
  }
};