// backend/src/services/ai.service.js
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY });

export const aiService = {
  async generateQuestionsFromFile(filePath, mimeType, questionCount = 5, difficulty = 'Medium') {
    let uploadedFile = null;

    const systemPrompt = `You are an expert educational AI. 
CRITICAL INSTRUCTIONS:
1. Generate EXACTLY ${questionCount} multiple-choice questions with a difficulty level of '${difficulty}' based ENTIRELY on the actual educational, academic, or substantive topic content found within the attached file.
2. COMPLETELY IGNORE all technical metadata, file formats, PDF versions, software libraries, creators, producers, document properties, headers, or footers. Focus 100% on the core subject matter.
3. Each question must have exactly 4 choices (A, B, C, D), a clear correct answer matching one of the choices, and a short explanation.
4. Return ONLY valid JSON in this exact object format containing a "questions" array: {"questions": [{"question": "...", "choices": ["...", "...", "...", "..."], "correctIndex": 0, "explanation": "..."}]} where correctIndex is the integer index (0, 1, 2, or 3) of the correct choice.`;

    try {
      uploadedFile = await ai.files.upload({
        file: filePath,
        config: { mimeType: mimeType }
      });

      if (!uploadedFile || !uploadedFile.uri) {
        throw new Error('Failed to upload file or retrieve file URI from Gemini File API.');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          createUserContent([
            systemPrompt,
            createPartFromUri(uploadedFile.uri, uploadedFile.mimeType || mimeType)
          ])
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      let rawText = response.text ? response.text.trim() : '';
      if (rawText.startsWith('```json')) {
        rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(rawText);
      return parsed.questions || parsed;

    } catch (parseErr) {
      throw new Error(`Failed to generate or parse AI JSON response: ${parseErr.message}`);
    } finally {
      try {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {}

      if (uploadedFile && uploadedFile.name) {
        try {
          await ai.files.delete({ name: uploadedFile.name });
        } catch (e) {}
      }
    }
  }
};