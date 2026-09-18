import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File size exceeds the 10MB limit.' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  
  // Standard error fallback
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};