const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/gst/calculate
router.post('/calculate', verifyToken, async (req, res) => {
  const { amount, rate, transactionType } = req.body;
  const gstAmount = (amount * rate) / 100;

  let result;
  if (transactionType === 'intra') {
    result = { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0, total: amount + gstAmount, taxableAmount: amount };
  } else {
    result = { cgst: 0, sgst: 0, igst: gstAmount, total: amount + gstAmount, taxableAmount: amount };
  }

  res.json(result);
});

// GET /api/gst/report
router.get('/report', verifyToken, async (req, res) => {
  const { period } = req.query;

  if (!db) {
    return res.json({
      period: period || 'current',
      totalSales: 455000, totalPurchases: 72000,
      outputTax: 65480, itcAvailable: 12960, netPayable: 52520,
      gstEntries: [],
    });
  }

  const salesSnap = await db.collection('gstEntries')
    .where('userId', '==', req.user.uid)
    .where('entryType', '==', 'sale')
    .get();

  const purchaseSnap = await db.collection('gstEntries')
    .where('userId', '==', req.user.uid)
    .where('entryType', '==', 'purchase')
    .get();

  const sales = salesSnap.docs.map(d => d.data());
  const purchases = purchaseSnap.docs.map(d => d.data());

  const totalSales = sales.reduce((a, s) => a + s.amount, 0);
  const totalPurchases = purchases.reduce((a, p) => a + p.amount, 0);
  const outputTax = sales.reduce((a, s) => a + (s.amount * s.rate / 100), 0);
  const itcAvailable = purchases.reduce((a, p) => a + (p.amount * p.rate / 100), 0);

  res.json({ period, totalSales, totalPurchases, outputTax, itcAvailable, netPayable: Math.max(0, outputTax - itcAvailable), entries: sales.length + purchases.length });
});

// POST /api/gst/entry
router.post('/entry', verifyToken, async (req, res) => {
  const { partyName, gstin, amount, rate, transactionType, entryType, invoiceNo, date } = req.body;

  if (!db) return res.json({ id: uuidv4(), message: 'Entry saved (demo mode)' });

  const ref = await db.collection('gstEntries').add({
    userId: req.user.uid,
    partyName, gstin, amount: Number(amount), rate: Number(rate),
    transactionType, entryType, invoiceNo, date,
    createdAt: new Date(),
  });

  res.json({ id: ref.id, message: 'GST entry saved' });
});

// GET /api/gst/entries
router.get('/entries', verifyToken, async (req, res) => {
  const { type } = req.query; // 'sale' or 'purchase'
  if (!db) return res.json([]);

  let q = db.collection('gstEntries').where('userId', '==', req.user.uid);
  if (type) q = q.where('entryType', '==', type);

  const snap = await q.orderBy('createdAt', 'desc').get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

module.exports = router;
