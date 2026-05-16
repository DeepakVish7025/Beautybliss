import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCommon.css';
import './AdminBookings.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_COLOR = { pending: 'badge-yellow', confirmed: 'badge-green', completed: 'badge-rose', cancelled: 'badge-red' };
const STATUS_EMOJI = { pending: '⏳', confirmed: '✅', completed: '🎀', cancelled: '❌' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/bookings/admin/all')
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      load();
      if (selected?._id === id) setSelected(b => ({ ...b, status }));
    } catch { toast.error('Failed to update status'); }
  };

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking?')) return;
    await api.delete(`/bookings/${id}`);
    toast.success('Booking deleted');
    setSelected(null);
    load();
  };

  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchDate = !filterDate || b.date === filterDate;
    return matchStatus && matchDate;
  });

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Bookings</h1>
        <button className="btn btn-outline" onClick={load} style={{ fontSize: '0.85rem' }}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div className="booking-stats-row">
        {[
          { label: 'Total', value: stats.total, color: '#6b4c35' },
          { label: 'Pending', value: stats.pending, color: '#d97706' },
          { label: 'Confirmed', value: stats.confirmed, color: '#16a34a' },
          { label: 'Completed', value: stats.completed, color: '#c8956c' },
          { label: 'Cancelled', value: stats.cancelled, color: '#dc2626' },
        ].map(s => (
          <div
            key={s.label}
            className={`booking-stat-pill ${filterStatus === s.label.toLowerCase() || (s.label === 'Total' && filterStatus === 'all') ? 'active-pill' : ''}`}
            onClick={() => setFilterStatus(s.label === 'Total' ? 'all' : s.label.toLowerCase())}
            style={{ '--pill-color': s.color }}
          >
            <strong style={{ color: s.color }}>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="booking-filters">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="status-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '10px 14px' }}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <input
            type="date"
            className="status-select"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{ padding: '10px 14px' }}
          />
          {(filterStatus !== 'all' || filterDate) && (
            <button className="act-btn edit" onClick={() => { setFilterStatus('all'); setFilterDate(''); }}>
              ✕ Clear Filters
            </button>
          )}
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Main Layout: Table + Detail Panel */}
      <div className={`bookings-layout ${selected ? 'with-panel' : ''}`}>
        {/* Table */}
        <div className="bookings-table-wrap">
          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div className="empty-admin-state">
              <span>📅</span>
              <h3>No bookings found</h3>
              <p>No appointments match your current filters.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Quick Update</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr
                      key={b._id}
                      className={selected?._id === b._id ? 'selected-row' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelected(b)}
                    >
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">{b.name[0]}</div>
                          <div>
                            <strong>{b.name}</strong>
                            <small>{b.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>{b.service?.name || '—'}</td>
                      <td>
                        <div>
                          <strong>{b.date}</strong>
                          <small>{b.timeSlot}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_COLOR[b.status]}`}>
                          {STATUS_EMOJI[b.status]} {b.status}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <select
                          className="status-select"
                          value={b.status}
                          onChange={e => updateStatus(b._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="table-actions">
                          <a href={`tel:${b.phone}`} className="act-btn confirm">📞 Call</a>
                          <button className="act-btn delete" onClick={() => deleteBooking(b._id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="booking-detail-panel">
            <div className="bdp-header">
              <h3>Booking Details</h3>
              <button onClick={() => setSelected(null)} className="modal-close">✕</button>
            </div>

            <div className="bdp-status-badge">
              <span className={`badge ${STATUS_COLOR[selected.status]}`} style={{ fontSize: '0.9rem', padding: '8px 18px' }}>
                {STATUS_EMOJI[selected.status]} {selected.status.toUpperCase()}
              </span>
            </div>

            <div className="bdp-section">
              <h4>👤 Customer</h4>
              <div className="bdp-row"><span>Name</span><strong>{selected.name}</strong></div>
              <div className="bdp-row">
                <span>Phone</span>
                <a href={`tel:${selected.phone}`} style={{ color: 'var(--rose)', fontWeight: 600 }}>
                  {selected.phone}
                </a>
              </div>
              {selected.email && <div className="bdp-row"><span>Email</span><strong>{selected.email}</strong></div>}
            </div>

            <div className="bdp-section">
              <h4>✂️ Appointment</h4>
              <div className="bdp-row"><span>Service</span><strong>{selected.service?.name || '—'}</strong></div>
              {selected.service?.price && <div className="bdp-row"><span>Price</span><strong>₹{selected.service.price}</strong></div>}
              <div className="bdp-row"><span>Date</span><strong>{selected.date}</strong></div>
              <div className="bdp-row"><span>Time</span><strong>{selected.timeSlot}</strong></div>
            </div>

            {selected.message && (
              <div className="bdp-section">
                <h4>💬 Message</h4>
                <p className="bdp-message">{selected.message}</p>
              </div>
            )}

            <div className="bdp-section">
              <h4>🔄 Update Status</h4>
              <div className="bdp-status-grid">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    className={`status-update-btn ${selected.status === s ? 'active' : ''}`}
                    onClick={() => updateStatus(selected._id, s)}
                    data-status={s}
                  >
                    {STATUS_EMOJI[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bdp-actions">
              <a href={`tel:${selected.phone}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}>
                📞 Call Customer
              </a>
              <button className="btn btn-outline" style={{ color: '#dc2626', borderColor: '#dc2626', fontSize: '0.9rem' }} onClick={() => deleteBooking(selected._id)}>
                🗑 Delete
              </button>
            </div>

            <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>
              Booked on {new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}