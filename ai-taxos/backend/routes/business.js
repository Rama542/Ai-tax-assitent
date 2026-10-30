const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/business
router.get('/', verifyToken, async (req, res) => {
  if (!db) {
    return res.json([{ id: 'demo', name: 'Demo Business', gstin: '27AABCT1332L1ZV', industry: 'Technology', turnover: 3200000, city: 'Mumbai' }]);
  }
  const snap = await db.collection('businesses').where('ownerId', '==', req.user.uid).get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// POST /api/business
router.post('/', verifyToken, async (req, res) => {
  const { name, gstin, industry, turnover, city, state, type } = req.body;
  if (!name) return res.status(400).json({ error: 'Business name required' });

  if (!db) return res.json({ id: uuidv4(), name, message: 'Business created (demo mode)' });

  const ref = await db.collection('businesses').add({
    ownerId: req.user.uid,
    name, gstin, industry, turnover: Number(turnover) || 0,
    city, state, type: type || 'proprietorship',
    createdAt: new Date(),
  });

  res.json({ id: ref.id, name, message: 'Business created' });
});

// PUT /api/business/:id
router.put('/:id', verifyToken, async (req, res) => {
  if (!db) return res.json({ message: 'Updated (demo mode)' });
  await db.collection('businesses').doc(req.params.id).update({ ...req.body, updatedAt: new Date() });
  res.json({ message: 'Business updated' });
});

// DELETE /api/business/:id
router.delete('/:id', verifyToken, async (req, res) => {
  if (!db) return res.json({ message: 'Deleted (demo mode)' });
  await db.collection('businesses').doc(req.params.id).delete();
  res.json({ message: 'Business deleted' });
});

module.exports = router;
