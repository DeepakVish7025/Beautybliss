import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './Booking.css';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
];

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default function Booking() {
  const [services, setServices] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', date: getTodayStr(), timeSlot: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.date) {
      api.get(`/bookings/slots/${form.date}`)
        .then(r => setBookedSlots(r.data))
        .catch(() => setBookedSlots([]));
    }
  }, [form.date]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.timeSlot) return toast.error('Please select a time slot');
    if (!form.service) return toast.error('Please select a service');
    setLoading(true);
    try {
      await api.post('/bookings', form);
      setSuccess(true);
      toast.success('🎉 Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <div className="page-hero"><h1>Book Appointment</h1></div>
        <div className="section-pad">
          <div className="container">
            <div className="booking-success">
              <div className="success-icon">🎀</div>
              <h2>Booking Confirmed!</h2>
              <p>Thank you for booking with Beauty Bliss Nad! We will call you to confirm your appointment.</p>
              <p><strong>Date:</strong> {form.date} &nbsp;|&nbsp; <strong>Time:</strong> {form.timeSlot}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => { setSuccess(false); setForm({ ...form, timeSlot: '', message: '' }); }}>Book Another</button>
                <a href="tel:+919876543210" className="btn btn-outline">📞 Call Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-hero">
        <h1>Book Appointment</h1>
        <p>Schedule your beauty session with our experts</p>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="booking-layout">
            <div className="booking-form-wrap">
              <form onSubmit={submit} className="booking-form">
                <h2>Your Details</h2>
                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" required value={form.name} onChange={handle} placeholder="Enter your name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input name="phone" required value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" type="tel" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email (Optional)</label>
                  <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Select Service *</label>
                  <select name="service" required value={form.service} onChange={handle}>
                    <option value="">Choose a service...</option>
                    {services.map(s => (
                      <option key={s._id} value={s._id}>{s.name} — ₹{s.price} ({s.duration})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input name="date" type="date" required value={form.date} onChange={handle} min={getTodayStr()} />
                </div>
                <div className="form-group">
                  <label>Select Time Slot *</label>
                  <div className="time-slots-grid">
                    {TIME_SLOTS.map(slot => {
                      const booked = bookedSlots.includes(slot);
                      return (
                        <button
                          type="button" key={slot}
                          className={`time-slot ${form.timeSlot === slot ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                          onClick={() => !booked && setForm(f => ({ ...f, timeSlot: slot }))}
                          disabled={booked}
                        >
                          {slot}
                          {booked && <span className="slot-taken">Taken</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label>Special Message (Optional)</label>
                  <textarea name="message" value={form.message} onChange={handle} placeholder="Any special requests or notes..." rows={3} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }} disabled={loading}>
                  {loading ? 'Booking...' : '✨ Confirm Appointment'}
                </button>
              </form>
            </div>

            <div className="booking-info">
              <div className="booking-info-card card">
                <h3>📍 Find Us</h3>
                <p>123, Main Market, Your City<br />State - 000000</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: '12px', fontSize: '0.85rem' }}>View on Map</a>
              </div>
              <div className="booking-info-card card">
                <h3>🕐 Working Hours</h3>
                <ul>
                  <li><span>Monday – Saturday</span><span>9:00 AM – 8:00 PM</span></li>
                  <li><span>Sunday</span><span>10:00 AM – 6:00 PM</span></li>
                </ul>
              </div>
              <div className="booking-info-card card">
                <h3>📞 Quick Call</h3>
                <p>Prefer to book by phone? Call us directly!</p>
                <a href="tel:+919876543210" className="btn btn-primary" style={{ marginTop: '12px', fontSize: '0.9rem' }}>+91 98765 43210</a>
              </div>
              <div className="booking-note">
                <p>🌸 <strong>Note:</strong> Bookings are confirmed via phone call. Please ensure your number is reachable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}