const express = require('express');
const router = express.Router();
const { authAdmin, db } = require('../firebase');

// POST /api/auth/register (optional - Firebase handles client-side)
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!authAdmin) {
    return res.json({ message: 'Registration handled client-side (demo mode)' });
  }
  try {
    const user = await authAdmin.createUser({ email, password, displayName: name });
    await authAdmin.setCustomUserClaims(user.uid, { role: role || 'individual' });
    if (db) {
      await db.collection('users').doc(user.uid).set({
        uid: user.uid, name, email, role: role || 'individual',
        createdAt: new Date(), onboardingComplete: false,
      });
    }
    res.json({ uid: user.uid, message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/logout (optional - client handles Firebase signOut)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
