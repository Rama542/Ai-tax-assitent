const { authAdmin } = require('../firebase');

// Verify Firebase ID token on every request
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Demo mode: no Firebase configured
  if (!authAdmin) {
    req.user = { uid: 'demo-user', email: 'demo@taxos.ai', role: 'business' };
    return next();
  }

  try {
    const decoded = await authAdmin.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  // Role stored in Firestore or custom claims
  const userRole = req.user.role || req.user.customClaims?.role || 'individual';
  if (!roles.includes(userRole)) {
    return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
  }
  next();
};

module.exports = { verifyToken, requireRole };
