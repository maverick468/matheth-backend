import { aiService } from '../services/ai.service.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function generateQuizController(req, res, next) {
  try {
    console.log('=== GENERATE QUIZ DEBUG ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.files:', req.files);

    let uploadedFileObj = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    let filePath = uploadedFileObj ? uploadedFileObj.path : null;
    let mimeType = uploadedFileObj ? uploadedFileObj.mimetype : 'text/plain';

    // If multer is using memoryStorage, req.file.path will be undefined, but req.file.buffer will exist.
    // We need to write this buffer to a temporary file path so ai.files.upload can read it from disk.
    if (!filePath && uploadedFileObj && uploadedFileObj.buffer) {
      const tempDir = os.tmpdir();
      const ext = path.extname(uploadedFileObj.originalname || '.bin');
      filePath = path.join(tempDir, `upload-${Date.now()}${ext}`);
      fs.writeFileSync(filePath, uploadedFileObj.buffer);
    }

    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const questionCount = parseInt(body?.questionCount || req.query?.questionCount, 10) || 10;
    const difficulty = body?.difficulty || req.query?.difficulty || 'Medium';
    
    const sourceText = body?.sourceText || body?.manualText || body?.text || body?.content || req.query?.sourceText;

    if (!filePath && sourceText && typeof sourceText === 'string' && sourceText.trim()) {
      const tempDir = os.tmpdir();
      filePath = path.join(tempDir, `quiz-text-${Date.now()}.txt`);
      fs.writeFileSync(filePath, sourceText.trim(), 'utf8');
      mimeType = 'text/plain';
    }

    if (!filePath) {
      return res.status(400).json({ 
        error: 'Source text or document content is required.',
        debug: {
          receivedBodyKeys: Object.keys(body),
          hasFile: !!uploadedFileObj
        }
      });
    }

    const questions = await aiService.generateQuestionsFromFile(
      filePath,
      mimeType,
      questionCount,
      difficulty
    );

    return res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
}

export async function analyzeDocument(req, res, next) {
  return generateQuizController(req, res, next);
}

export async function generateQuestionsFromDoc(req, res, next) {
  return generateQuizController(req, res, next);
}

export const aiController = {
  analyzeDocument,
  generateQuestionsFromDoc,
  generateQuizController
};