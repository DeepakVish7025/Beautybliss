import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './Gallery.css';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/gallery')
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div>
      <div className="page-hero">
        <h1>Our Gallery</h1>
        <p>A showcase of our finest work and transformations</p>
      </div>

      <section className="section-pad">
        <div className="container">
          {/* Filter */}
          {categories.length > 1 && (
            <div className="category-filters" style={{ marginBottom: '36px' }}>
              {categories.map(c => (
                <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>📸 No gallery images yet. Check back soon!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((item, i) => (
                <div
                  key={item._id}
                  className={`gallery-item ${i % 5 === 0 ? 'tall' : ''}`}
                  onClick={() => setLightbox(item)}
                >
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="gallery-overlay">
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                    {item.category && <span className="badge badge-rose">{item.category}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image} alt={lightbox.title} />
            <div className="lightbox-info">
              <h3>{lightbox.title}</h3>
              {lightbox.description && <p>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}