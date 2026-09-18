// backend/src/controllers/auth.controller.js
import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res) {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await authService.loginUser(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  },

  async getProfile(req, res) {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No user ID in session' });
      }
      
      let profile;
      try {
        profile = await authService.getUserProfile(uid);
      } catch (dbErr) {
        console.log("⚠️ Profile not found for UID, auto-creating database record...");
        profile = await authService.registerUser({
          firebaseUid: uid,
          email: req.user.email || 'player@matheth.app',
          name: req.user.name || req.user.email?.split('@')[0] || 'Player',
        }).catch(() => ({
          email: req.user.email,
          name: req.user.email?.split('@')[0] || 'Player',
          gamesPlayed: 0,
          totalLevels: 0
        }));
      }
      
      res.status(200).json({ success: true, user: profile });
    } catch (err) {
      console.error("🔥 Error fetching profile:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No user ID in session' });
      }
      
      const updated = await authService.updateUserProfile(uid, req.body);
      res.status(200).json({ success: true, user: updated });
    } catch (err) {
      console.error("🔥 Error updating profile:", err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Alias for backwards compatibility with getMe
  async getMe(req, res) {
    return authController.getProfile(req, res);
  }
};

export const register = authController.register;
export const login = authController.login;
export const getProfile = authController.getProfile;
export const updateProfile = authController.updateProfile;
export const getMe = authController.getMe;