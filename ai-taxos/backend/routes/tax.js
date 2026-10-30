const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');

// POST /api/tax/calculate
router.post('/calculate', verifyToken, async (req, res) => {
  const { grossIncome, regime = 'new', deductions = {}, fy = '2025-26' } = req.body;

  let taxableIncome = grossIncome;

  if (regime === 'old') {
    const stdDed = 50000;
    const totalDed = Object.values(deductions).reduce((a, b) => a + (Number(b) || 0), 0);
    taxableIncome = Math.max(0, grossIncome - stdDed - totalDed);
  } else {
    taxableIncome = Math.max(0, grossIncome - 75000);
  }

  let tax = 0;
  if (regime === 'old') {
    if (taxableIncome > 1000000) tax = 112500 + (taxableIncome - 1000000) * 0.3;
    else if (taxableIncome > 500000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else if (taxableIncome > 250000) tax = (taxableIncome - 250000) * 0.05;
    if (taxableIncome <= 500000) tax = 0; // Rebate 87A
  } else {
    if (taxableIncome > 2400000) tax = 300000 + (taxableIncome - 2400000) * 0.3;
    else if (taxableIncome > 2000000) tax = 200000 + (taxableIncome - 2000000) * 0.25;
    else if (taxableIncome > 1600000) tax = 120000 + (taxableIncome - 1600000) * 0.2;
    else if (taxableIncome > 1200000) tax = 60000 + (taxableIncome - 1200000) * 0.15;
    else if (taxableIncome > 800000) tax = 20000 + (taxableIncome - 800000) * 0.1;
    else if (taxableIncome > 400000) tax = (taxableIncome - 400000) * 0.05;
    if (taxableIncome <= 700000) tax = 0; // Rebate 87A
  }

  const surcharge = taxableIncome > 5000000 ? tax * 0.1 : 0;
  const cess = (tax + surcharge) * 0.04;
  const totalTax = Math.round(tax + surcharge + cess);
  const effectiveRate = grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(2) : 0;

  const result = {
    grossIncome, taxableIncome, regime, fy,
    baseTax: Math.round(tax), surcharge: Math.round(surcharge), cess: Math.round(cess),
    totalTax, effectiveRate: Number(effectiveRate),
    monthlyTax: Math.round(totalTax / 12),
    refund: 0,
    advanceTax: {
      q1: Math.round(totalTax * 0.15),
      q2: Math.round(totalTax * 0.45),
      q3: Math.round(totalTax * 0.75),
      q4: totalTax,
    },
  };

  // Save calculation to Firestore
  if (db) {
    await db.collection('taxRecords').add({
      userId: req.user.uid,
      ...result,
      calculatedAt: new Date(),
    }).catch(() => {});
  }

  res.json(result);
});

// GET /api/tax/report
router.get('/report', verifyToken, async (req, res) => {
  if (!db) {
    return res.json({ calculations: [], latestTax: null });
  }
  const snap = await db.collection('taxRecords')
    .where('userId', '==', req.user.uid)
    .orderBy('calculatedAt', 'desc')
    .limit(10)
    .get();
  res.json({ calculations: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
});

module.exports = router;
