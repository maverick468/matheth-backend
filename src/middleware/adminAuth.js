// backend/src/middleware/adminAuth.js
export const requireAdminPasscode = (req, res, next) => {
  const adminSecret = 'admin321'; // Hardcoded passcode
  const headerPasscode = req.headers['x-admin-passcode'];

  if (!headerPasscode || headerPasscode !== adminSecret) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or missing admin passcode' });
  }

  next();
};