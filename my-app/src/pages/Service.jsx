import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Service.css';

const CATEGORIES = ['All', 'Hair', 'Skin & Facial', 'Makeup', 'Nail', 'Waxing & Threading', 'Bridal', 'Other'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/services')
      .then(r => setServices(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  return (
    <div>
      <div className="page-hero">
        <h1>Our Services</h1>
        <p>Premium beauty treatments for every occasion</p>
      </div>

      <section className="section-pad">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>✨ No services found in this category yet.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.6 }}>Please check back soon or contact us directly.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(s => (
                <div className="service-item card" key={s._id}>
                  <div className="si-image">
                    {s.image ? (
                      <img src={s.image} alt={s.name} />
                    ) : (
                      <div className="si-placeholder">💅</div>
                    )}
                    <div className="si-overlay">
                      <Link to="/booking" className="btn btn-primary">Book This Service</Link>
                    </div>
                    <span className="badge badge-rose si-cat">{s.category}</span>
                  </div>
                  <div className="si-body">
                    <div className="si-header">
                      <h3>{s.name}</h3>
                      <span className="si-price">₹{s.price}</span>
                    </div>
                    <p>{s.description}</p>
                    <div className="si-footer">
                      <span className="si-duration">⏱ {s.duration}</span>
                      <Link to="/booking" className="si-book-link">Book Now →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call CTA */}
          <div className="services-cta">
            <div className="services-cta-inner">
              <h3>Can't find what you're looking for?</h3>
              <p>Call us and we'll help you with a customized beauty package just for you!</p>
              <a href="tel:+919876543210" className="btn btn-primary">📞 +91 98765 43210</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}