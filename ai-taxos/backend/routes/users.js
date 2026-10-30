const express = require('express');
const router = express.Router();
const { db, authAdmin } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/users/profile
router.get('/profile', verifyToken, async (req, res) => {
  if (!db) {
    return res.json({ uid: req.user.uid, name: 'Demo User', email: req.user.email, role: 'business', pan: 'ABCDE1234F', gstin: '27AABCT1332L1ZV', onboardingComplete: true });
  }
  const snap = await db.collection('users').doc(req.user.uid).get();
  if (!snap.exists) return res.status(404).json({ error: 'User not found' });
  res.json(snap.data());
});

// PUT /api/users/profile
router.put('/profile', verifyToken, async (req, res) => {
  const { name, phone, pan, gstin, city, state, businessName, industry } = req.body;
  if (!db) return res.json({ message: 'Profile updated (demo mode)' });

  await db.collection('users').doc(req.user.uid).update({
    name, phone, pan, gstin, city, state, businessName, industry,
    updatedAt: new Date(),
  });

  // Update audit log
  await db.collection('auditLogs').add({
    userId: req.user.uid,
    action: 'Profile Updated',
    timestamp: new Date(),
    ip: req.ip,
  });

  res.json({ message: 'Profile updated successfully' });
});

// GET /api/users/notifications
router.get('/notifications', verifyToken, async (req, res) => {
  if (!db) {
    return res.json([
      { id: '1', type: 'gst', message: 'GSTR-3B due in 3 days', time: new Date(), read: false },
      { id: '2', type: 'ai', message: 'AI detected ₹12,400 in deductions', time: new Date(), read: false },
    ]);
  }
  const snap = await db.collection('notifications')
    .where('userId', '==', req.user.uid)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

module.exports = router;
