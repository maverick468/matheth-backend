// src/services/storage.service.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const storageService = {
  async uploadAsset(file) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'matheth_assets' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
};