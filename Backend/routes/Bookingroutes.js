const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');
const { notifyStatusUpdate, sendEmailNotification, sendSMSNotification } = require('../utils/notifications');

// Public: POST create booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, service, date, timeSlot, message } = req.body;
    // Check if slot already booked
    const existing = await Booking.findOne({ date, timeSlot, status: { $in: ['pending', 'confirmed'] } });
    if (existing) return res.status(400).json({ message: 'This time slot is already booked. Please choose another.' });
    const booking = await Booking.create({ name, phone, email, service, date, timeSlot, message });
    await booking.populate('service', 'name');

    // Notify user about new booking request
    const welcomeMsg = `Hi ${name}, thank you for booking ${booking.service.name} at Beauty Bliss Nad for ${date} at ${timeSlot}. Your request is currently PENDING confirmation.`;
    if (email) await sendEmailNotification(email, 'Booking Request Received - Beauty Bliss Nad', welcomeMsg);
    await sendSMSNotification(phone, welcomeMsg);

    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Public: GET booked slots for a date
router.get('/slots/:date', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      date: req.params.date, 
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');
    res.json(bookings.map(b => b.timeSlot));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: GET all bookings
router.get('/admin/all', protect, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service', 'name price').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: PATCH update booking status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    ).populate('service', 'name');

    if (booking) {
      await notifyStatusUpdate(booking);
    }

    res.json(booking);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: DELETE booking
router.delete('/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;