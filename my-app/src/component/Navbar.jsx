import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/products', label: 'Products' },
  { to: '/booking', label: 'Book Now' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { admin } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Beauty Bliss </span>
          <span className="logo-tagline">Premium Beauty Parlour</span>
        </Link>

        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
                {l.to === '/booking' ? <span className="nav-cta">{l.label}</span> : l.label}
              </NavLink>
            </li>
          ))}
          <li className="nav-phone">
            <a href="tel:+919876543210">
              <FiPhone size={14} />
              +91 98765 43210
            </a>
          </li>
          <li className="nav-admin-profile">
            <Link to={admin ? "/admin" : "/admin/login"} className={admin ? "profile-link" : "login-link"}>
              <FiUser size={18} />
              <span>{admin ? admin.name : "Admin Login"}</span>
            </Link>
          </li>
        </ul>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </nav>
  );
}