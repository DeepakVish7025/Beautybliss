const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public: GET all active products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: GET all
router.get('/admin/all', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: POST create product
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const product = await Product.create({ name, description, price, category, brand, stock, image });
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: PUT update product
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: DELETE product
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;