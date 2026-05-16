const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/Authmiddleware');
const upload = require('../middleware/Uploadmiddleware');

// Public: GET all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Public: GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: GET all (including inactive)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: POST create service
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const service = await Service.create({ name, description, price, duration, category, image });
    res.status(201).json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: PUT update service
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(service);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: DELETE service
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;