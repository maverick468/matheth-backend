// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import admin from './config/firebaseAdmin.js'; // Imports pre-initialized admin from serviceAccount.js
import { GoogleGenAI, Type } from '@google/genai';

// Import modular routers
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import questionRoutes from './routes/question.routes.js';
import aiRoutes from './routes/ai.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import referralRoutes from './routes/referral.routes.js';
import badgeRoutes from './routes/badge.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();
process.on('uncaughtException', (err) => {
  console.error('FATAL UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('FATAL UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Initialize Google Gen AI SDK
const ai = new GoogleGenAI();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure Multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[Backend Incoming] ${req.method} ${req.url}`);
  next();
});
  
const PORT = process.env.PORT || 5001;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Root API Endpoint (Prevents HTML 404 responses on base /api requests)
app.get('/api', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Matheth Backend API is running successfully!',
    endpoints: ['/api/health', '/api/debug-status', '/api/auth', '/api/games', '/api/questions', '/api/ai'] 
  });
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', service: 'Matheth Backend API' });
});

// Comprehensive Diagnostics Route
app.get('/api/debug-status', async (req, res) => {
  const status = {
    gemini: 'CONNECTED',
    groq: 'BYPASSED',
    cloudinary: 'PENDING',
    firebase: 'PENDING'
  };

  try {
    await cloudinary.api.ping();
    status.cloudinary = 'CONNECTED';
  } catch (err) {
    status.cloudinary = `FAILED: ${err.message}`;
  }

  try {
    if (admin.apps.length > 0) {
      status.firebase = 'CONNECTED';
    } else {
      status.firebase = 'FAILED: Not initialized';
    }
  } catch (err) {
    status.firebase = `FAILED: ${err.message}`;
  }

  res.status(200).json({ success: true, integrations: status });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/admin', adminRoutes);

// AI Question Generation Endpoint with Automatic Model Quota Failover
app.post('/api/generate-quiz', upload.single('file'), async (req, res) => {
  const fallbackModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let currentModelIndex = 0;
  let success = false;
  let finalResult = null;
  let lastError = null;

  const uploadedFile = req.file;
  const { sourceText, questionCount = 10, difficulty = 'Medium', grade = '11' } = req.body;

  if (!uploadedFile && (!sourceText || !sourceText.trim())) {
    return res.status(400).json({ error: 'Source text or document content is required.' });
  }

  const prompt = `You are an expert AI educational assistant. Analyze the provided study material, notes, or document content thoroughly and generate exactly ${questionCount} high-quality, specific 4-choice multiple-choice questions directly grounded in the text. 
  Difficulty Level: ${difficulty}
  Target Grade Level: ${grade}`;

  const contents = [prompt];

  if (uploadedFile) {
    contents.push({
      inlineData: {
        data: uploadedFile.buffer.toString("base64"),
        mimeType: uploadedFile.mimetype
      }
    });
  }

  if (sourceText && sourceText.trim()) {
    contents.push(`Additional Source Text/Content:\n${sourceText.trim()}`);
  }

  while (currentModelIndex < fallbackModels.length && !success) {
    const activeModel = fallbackModels[currentModelIndex];
    let attempt = 0;
    const maxRetries = 2;

    while (attempt < maxRetries && !success) {
      try {
        attempt++;
        console.log(`[AI Gen] Trying model: ${activeModel} (Attempt ${attempt})`);

        const response = await ai.models.generateContent({
          model: activeModel,
          contents: contents,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      choices: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "choices", "correctIndex", "explanation"]
                  }
                }
              },
              required: ["questions"]
            }
          }
        });

        const rawText = response.text;
        if (!rawText) {
          throw new Error('Received empty text payload from Gemini model.');
        }

        finalResult = JSON.parse(rawText);
        success = true;

      } catch (err) {
        lastError = err;
        console.warn(`[Model: ${activeModel}] Warning: ${err.message}`);
        
        const isQuotaExceeded = err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('Quota exceeded');
        const isUnavailable = err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('404');

        if (isQuotaExceeded || isUnavailable) {
          console.log(`[Failover] Switching to next model from list...`);
          break; 
        }

        if (attempt < maxRetries) {
          const delay = 2000 * attempt;
          console.log(`Retrying in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    currentModelIndex++;
  }

  if (success && finalResult) {
    return res.status(200).json({ success: true, questions: finalResult.questions });
  } else {
    console.error('Quiz Generation Final Failure across all models:', lastError?.message);
    return res.status(429).json({ 
      success: false, 
      error: 'All active model quotas are exhausted or models are unavailable. Please try again later or check billing details.',
      details: lastError?.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Matheth backend server running on port ${PORT}`);
});