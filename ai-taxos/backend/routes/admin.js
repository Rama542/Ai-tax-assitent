const express = require('express');
const router = express.Router();
const { db, authAdmin } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

// All admin routes require auth (add requireRole('admin') for strict control)

// GET /api/admin/users
router.get('/users', verifyToken, async (req, res) => {
  if (!db) {
    return res.json([
      { uid: '1', name: 'Demo User', email: 'demo@taxos.ai', role: 'business', createdAt: new Date() },
    ]);
  }
  const snap = await db.collection('users').orderBy('createdAt', 'desc').limit(100).get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// GET /api/admin/stats
router.get('/stats', verifyToken, async (req, res) => {
  if (!db) {
    return res.json({ users: 1482, cas: 87, docs: 24583, apiCalls: 18924 });
  }
  const [usersSnap, docsSnap] = await Promise.all([
    db.collection('users').get(),
    db.collection('documents').get(),
  ]);
  res.json({
    totalUsers: usersSnap.size,
    totalDocuments: docsSnap.size,
    timestamp: new Date(),
  });
});

// GET /api/admin/logs
router.get('/logs', verifyToken, async (req, res) => {
  if (!db) return res.json([]);
  const snap = await db.collection('auditLogs').orderBy('timestamp', 'desc').limit(100).get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// PUT /api/admin/users/:uid/status
router.put('/users/:uid/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  if (!db) return res.json({ message: 'Updated (demo mode)' });
  await db.collection('users').doc(req.params.uid).update({ status, updatedAt: new Date() });
  res.json({ message: `User status updated to ${status}` });
});

// PUT /api/admin/ca/:uid/verify
router.put('/ca/:uid/verify', verifyToken, async (req, res) => {
  const { verified } = req.body;
  if (!db) return res.json({ message: 'CA verified (demo mode)' });
  await db.collection('users').doc(req.params.uid).update({
    status: verified ? 'verified' : 'rejected',
    caVerifiedAt: verified ? new Date() : null,
    updatedAt: new Date(),
  });
  // Set custom claim for CA role
  if (authAdmin && verified) {
    await authAdmin.setCustomUserClaims(req.params.uid, { role: 'ca', caVerified: true }).catch(() => {});
  }
  res.json({ message: `CA ${verified ? 'verified' : 'rejected'}` });
});

module.exports = router;
