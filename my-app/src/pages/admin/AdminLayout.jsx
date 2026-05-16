import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiScissors, FiImage, FiShoppingBag, FiCalendar, FiLogOut, FiMenu, FiX, FiUserPlus } from 'react-icons/fi';
import './AdminLayout.css';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/services', label: 'Services', icon: <FiScissors /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <FiImage /> },
  { to: '/admin/products', label: 'Products', icon: <FiShoppingBag /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span>✦</span>
            <div>
              <strong>Beauty Bliss Nad</strong>
              <small>Admin Panel</small>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setSideOpen(false)}><FiX /></button>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/admin'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSideOpen(false)}>
              {n.icon} {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">{admin?.name?.[0] || 'A'}</div>
            <div>
              <strong>{admin?.name || 'Admin'}</strong>
              <small>{admin?.email}</small>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn"><FiLogOut /></button>
        </div>
      </aside>
      {sideOpen && <div className="sidebar-overlay" onClick={() => setSideOpen(false)} />}

      <div className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSideOpen(true)}><FiMenu /></button>
          <a href="/" target="_blank" className="view-site-btn">View Website →</a>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}