// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import questionRoutes from './routes/question.routes.js';
import aiRoutes from './routes/ai.routes.js';
import groqRoutes from './routes/groq.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import referralRoutes from './routes/referral.routes.js';
import badgeRoutes from './routes/badge.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Root Endpoint (Fixes 404 on bare Render domain)
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Matheth Backend API is online!',
    documentation: 'Use /health or /api/v1/... for available endpoints.' 
  });
});

// Base API Endpoint (Fixes 404 on /api requests)
app.get('/api', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Matheth Backend API Base',
    endpoints: {
      auth: '/api/v1/auth',
      games: '/api/v1/games',
      questions: '/api/v1/questions',
      ai: '/api/v1/ai',
      groq: '/api/v1/groq',
      upload: '/api/v1/upload',
      leaderboard: '/api/v1/leaderboard',
      referrals: '/api/v1/referrals',
      badges: '/api/v1/badges',
      admin: '/api/v1/admin',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/groq', groqRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/badges', badgeRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use('*', (req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use(errorHandler);

export default app;