import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './Product.css';

const CATEGORIES = ['All', 'Hair Care', 'Skin Care', 'Makeup', 'Nail Care', 'Body Care', 'Other'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products')
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="page-hero">
        <h1>Beauty Products</h1>
        <p>Premium beauty products available at our parlour</p>
      </div>

      <section className="section-pad">
        <div className="container">
          {/* Search */}
          <div className="products-search">
            <input
              type="text" placeholder="🔍 Search products..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>🧴 No products found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid-4">
              {filtered.map(p => (
                <div className="product-card card" key={p._id}>
                  <div className="product-img">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <div className="product-img-placeholder">🧴</div>
                    )}
                    <span className="badge badge-rose product-cat">{p.category}</span>
                  </div>
                  <div className="product-body">
                    {p.brand && <span className="product-brand">{p.brand}</span>}
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="product-footer">
                      <span className="product-price">₹{p.price}</span>
                      <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <a href="tel:+919876543210" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '14px', fontSize: '0.85rem' }}>
                      📞 Call to Order
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="products-note">
            <p>💡 All products are available at our parlour. Call us or visit in-person to purchase.</p>
          </div>
        </div>
      </section>
    </div>
  );
}