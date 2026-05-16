const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public: GET all active gallery items
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: GET all
router.get('/admin/all', protect, async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: POST add gallery item
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const image = `/uploads/${req.file.filename}`;
    const item = await Gallery.create({ title, description, category, image });
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: DELETE gallery item
router.delete('/:id', protect, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Toggle visibility
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    item.isActive = !item.isActive;
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;