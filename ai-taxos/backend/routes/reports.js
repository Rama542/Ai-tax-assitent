const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');

// GET /api/reports
router.get('/', verifyToken, async (req, res) => {
  if (!db) {
    return res.json([
      { id: '1', type: 'pl', name: 'P&L Report FY2025-26', createdAt: new Date(), downloadUrl: '#' },
      { id: '2', type: 'gst', name: 'GST Summary July 2025', createdAt: new Date(), downloadUrl: '#' },
    ]);
  }
  const snap = await db.collection('reports').where('userId', '==', req.user.uid).orderBy('createdAt', 'desc').limit(20).get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// POST /api/reports/export
router.post('/export', verifyToken, async (req, res) => {
  const { type, period, format } = req.body;

  // Save report record to Firestore
  if (db) {
    await db.collection('reports').add({
      userId: req.user.uid,
      type, period, format,
      createdAt: new Date(),
      downloadUrl: null,
    }).catch(() => {});
  }

  // In production: generate actual PDF/Excel and return URL
  res.json({
    message: `${type} report generated in ${format} format`,
    downloadUrl: null,
    generatedAt: new Date(),
  });
});

module.exports = router;
