// backend/src/controllers/admin.controller.js
import { adminService } from '../services/admin.service.js';

export const adminController = {
  async addLevelBatch(req, res) {
    try {
      const result = await adminService.addQuestionBatch(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error adding level batch:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Internal server error while saving level batch.' 
      });
    }
  },

  async getLevels(req, res) {
    try {
      const levels = await adminService.getAllLevels();
      return res.status(200).json(levels);
    } catch (error) {
      console.error('Error fetching levels:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error while fetching levels.' 
      });
    }
  },

  async updateLevelBatch(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.updateQuestionBatch(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error updating level batch:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Internal server error while updating level batch.' 
      });
    }
  },

  async deleteLevel(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteLevel(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting level:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error while deleting level.' 
      });
    }
  }
};