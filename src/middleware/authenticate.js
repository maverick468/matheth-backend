// backend/src/middleware/authenticate.js
import { auth } from '../config/firebaseAdmin.js';

export const authenticate = async (req, res, next) => {
  console.log("🔍 [Middleware] Starting authentication check...");
  try {
    const authHeader = req.headers.authorization;
    console.log("🔍 [Middleware] Header check passed. Extracting token...");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ [Middleware] Malformed or missing auth header.");
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log("🔍 [Middleware] Token extracted. Calling Firebase Admin verifyIdToken...");

    // This is the line that is likely hanging or throwing silently
    const decodedToken = await auth.verifyIdToken(token);
    
    console.log("✅ [Middleware] Token successfully verified for UID:", decodedToken.uid);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("🔥 FIREBASE TOKEN VERIFICATION FAILED CAUGHT:");
    console.error("🔥 Error Message:", error.message);
    console.error("🔥 Error Code:", error.code);
    
    return res.status(401).json({ 
      success: false, 
      message: `Unauthorized: ${error.message}` 
    });
  }
};