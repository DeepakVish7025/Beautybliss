import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

export default function Footer() {
  const { admin } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Beauty Bliss Nad</h3>
              <p>Your destination for luxury beauty treatments. We believe every woman deserves to feel beautiful and confident.</p>
              <div className="footer-social">
                <a href="#" aria-label="Instagram"><FiInstagram /></a>
                <a href="#" aria-label="Facebook"><FiFacebook /></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/booking">Book Appointment</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><Link to="/services">Hair Treatment</Link></li>
                <li><Link to="/services">Facial & Skincare</Link></li>
                <li><Link to="/services">Bridal Makeup</Link></li>
                <li><Link to="/services">Nail Art</Link></li>
                <li><Link to="/services">Waxing & Threading</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="footer-contact">
                <li><FiMapPin />Dharmapur Market Jaunpur Uttar Pradesh India</li>
                <li><FiPhone /><a href="tel:+919876543210">+91 98765 43210</a></li>
                <li><FiMail /><a href="mailto:hello@beautyblissnad.com">hello@beautyblissnad.com</a></li>
              </ul>
              <div className="footer-hours">
                <p><strong>Mon–Sat:</strong> 9:00 AM – 8:00 PM</p>
                <p><strong>Sunday:</strong> 10:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Beauty Bliss Nad. All rights reserved.</p>
          {admin && (
            <p>
              <Link to="/admin">Admin Dashboard</Link>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}