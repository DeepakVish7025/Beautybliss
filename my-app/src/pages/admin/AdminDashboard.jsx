import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUserPlus } from 'react-icons/fi';
import api from '../../utils/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ services: 0, gallery: 0, products: 0, bookings: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/services/admin/all'),
      api.get('/gallery/admin/all'),
      api.get('/products/admin/all'),
      api.get('/bookings/admin/all'),
    ]).then(([s, g, p, b]) => {
      const bookings = b.data;
      setStats({
        services: s.data.length,
        gallery: g.data.length,
        products: p.data.length,
        bookings: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
      });
      setRecentBookings(bookings.slice(0, 6));
    }).catch(() => {});
  }, []);

  const STATUS_COLOR = { pending: 'badge-yellow', confirmed: 'badge-green', completed: 'badge-rose', cancelled: 'badge-red' };

  return (
    <div>
      <div className="dashboard-greeting">
        <div className="greeting-text">
          <h1 className="admin-page-title">Welcome back, {admin?.name || 'Admin'}! 👋</h1>
          <p>Here's what's happening with Beauty Bliss today.</p>
        </div>
        <Link to="/admin/register" className="btn btn-primary register-admin-btn">
          <FiUserPlus /> Register New Admin
        </Link>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Services', value: stats.services, icon: '✂️', link: '/admin/services' },
          { label: 'Gallery Items', value: stats.gallery, icon: '🖼️', link: '/admin/gallery' },
          { label: 'Products', value: stats.products, icon: '🧴', link: '/admin/products' },
          { label: 'Total Bookings', value: stats.bookings, icon: '📅', link: '/admin/bookings' },
          { label: 'Pending Bookings', value: stats.pending, icon: '⏳', link: '/admin/bookings', highlight: true },
        ].map((s, i) => (
          <Link to={s.link} className={`stat-card ${s.highlight ? 'highlight' : ''}`} key={i}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="ds-header">
          <h2>Recent Bookings</h2>
          <Link to="/admin/bookings">View All →</Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="no-data">No bookings yet.</p>
        ) : (
          <div className="recent-bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.name}</td>
                    <td><a href={`tel:${b.phone}`}>{b.phone}</a></td>
                    <td>{b.service?.name || '—'}</td>
                    <td>{b.date} · {b.timeSlot}</td>
                    <td><span className={`badge ${STATUS_COLOR[b.status]}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="quick-links-grid">
        {[
          { to: '/admin/services', label: 'Add New Service', desc: 'Create a service listing with price and description', icon: '✂️' },
          { to: '/admin/gallery', label: 'Add Gallery Photo', desc: 'Upload your latest work to the gallery', icon: '📸' },
          { to: '/admin/products', label: 'Add New Product', desc: 'List a product for customers to see', icon: '🧴' },
          { to: '/admin/bookings', label: 'Manage Bookings', desc: 'View and update appointment statuses', icon: '📅' },
        ].map((q, i) => (
          <Link to={q.to} className="quick-link-card" key={i}>
            <span>{q.icon}</span>
            <div>
              <strong>{q.label}</strong>
              <p>{q.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}