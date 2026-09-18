import { aiService } from '../services/ai.service.js';

export const uploadController = {
  async handleUpload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const questions = await aiService.generateQuestionsFromFile(req.file.path, req.file.mimetype);
      res.status(200).json({ success: true, questions });
    } catch (error) {
      console.error('AI Generation Error:', error);
      res.status(500).json({ message: 'Failed to generate questions from document.', error: error.message });
    }
  }
};