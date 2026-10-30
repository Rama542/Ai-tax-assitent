const express = require('express');
const router = express.Router();
const multer = require('multer');
const { db, storage } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/documents/upload
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  const { type } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  if (!db || !storage) {
    // Demo mode
    return res.json({
      id: uuidv4(),
      name: file.originalname,
      type: type || 'other',
      size: file.size,
      status: 'processed',
      fileUrl: 'https://example.com/demo-file.pdf',
      extractedData: { demo: true },
      message: 'File received (demo mode - Firebase Storage not configured)',
    });
  }

  try {
    // Upload to Firebase Storage
    const fileName = `documents/${req.user.uid}/${Date.now()}_${file.originalname}`;
    const bucket = storage.bucket();
    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype, metadata: { userId: req.user.uid } },
    });

    await fileRef.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Save metadata to Firestore
    const docRef = await db.collection('documents').add({
      userId: req.user.uid,
      name: file.originalname,
      type: type || 'other',
      size: file.size,
      fileUrl,
      status: 'processing',
      extractedData: null,
      uploadDate: new Date(),
    });

    // Simulate OCR processing (in production: call AI service)
    setTimeout(async () => {
      await db.collection('documents').doc(docRef.id).update({
        status: 'processed',
        extractedData: { extractedAt: new Date(), method: 'OCR+AI' },
      });
    }, 3000);

    res.json({ id: docRef.id, name: file.originalname, type, size: file.size, fileUrl, status: 'processing' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/documents
router.get('/', verifyToken, async (req, res) => {
  if (!db) {
    return res.json([
      { id: '1', name: 'Form_16_2024-25.pdf', type: 'form_16', status: 'processed', size: 245120, uploadDate: new Date() },
      { id: '2', name: 'GST_Invoice_July.pdf', type: 'gst_invoice', status: 'processed', size: 89034, uploadDate: new Date() },
    ]);
  }
  const snap = await db.collection('documents')
    .where('userId', '==', req.user.uid)
    .orderBy('uploadDate', 'desc')
    .get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

// DELETE /api/documents/:id
router.delete('/:id', verifyToken, async (req, res) => {
  if (!db) return res.json({ message: 'Deleted (demo mode)' });
  const docRef = db.collection('documents').doc(req.params.id);
  const snap = await docRef.get();
  if (!snap.exists || snap.data().userId !== req.user.uid) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  await docRef.delete();
  res.json({ message: 'Document deleted' });
});

module.exports = router;
