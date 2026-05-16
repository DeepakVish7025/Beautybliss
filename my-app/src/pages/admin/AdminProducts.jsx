import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCommon.css';

const CATS = ['Hair Care', 'Skin Care', 'Makeup', 'Nail Care', 'Body Care', 'Other'];
const BLANK = { name: '', description: '', price: '', category: 'Hair Care', brand: '', stock: '', isActive: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const load = () => api.get('/products/admin/all').then(r => setProducts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const openAdd = () => { setForm(BLANK); setEditId(null); setImageFile(null); setPreview(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, brand: p.brand || '', stock: p.stock, isActive: p.isActive });
    setEditId(p._id); setImageFile(null); setPreview(p.image || null); setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editId) await api.put(`/products/${editId}`, fd);
      else await api.post('/products', fd);
      toast.success(editId ? 'Product updated!' : 'Product added!');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally { setLoading(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    load();
  };

  const filtered = filterCat === 'All' ? products : products.filter(p => p.category === filterCat);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={submit}>
              {/* Image Upload */}
              <div className="upload-zone" onClick={() => document.getElementById('prod-file').click()}>
                {preview ? (
                  <img src={preview} alt="preview" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>🧴</span>
                    <p>Click to add product image</p>
                    <small>JPG, PNG, WEBP — max 5MB</small>
                  </div>
                )}
                <input id="prod-file" type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>

              <div className="grid-2" style={{ gap: 16, marginTop: 20 }}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input name="name" required value={form.name} onChange={handle} placeholder="e.g. Argan Oil Serum" />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handle} placeholder="e.g. L'Oréal" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handle}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" required value={form.price} onChange={handle} placeholder="299" />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input name="stock" type="number" value={form.stock} onChange={handle} placeholder="10" />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', marginBottom: 0, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    Active (visible to public)
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" required value={form.description} onChange={handle} placeholder="Describe the product, its benefits and usage..." rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="gallery-stats-bar">
        <div className="gsb-item"><strong>{products.length}</strong><span>Total</span></div>
        <div className="gsb-item"><strong>{products.filter(p => p.isActive).length}</strong><span>Active</span></div>
        <div className="gsb-item"><strong>{products.filter(p => p.stock > 0).length}</strong><span>In Stock</span></div>
        <div className="gsb-item"><strong>{products.filter(p => p.stock === 0).length}</strong><span>Out of Stock</span></div>
      </div>

      {/* Filter */}
      <div className="category-filters" style={{ marginBottom: 24 }}>
        {['All', ...CATS].map(c => (
          <button key={c} className={`filter-btn ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-admin-state">
          <span>🧴</span>
          <h3>No products yet</h3>
          <p>Add your first product to showcase what's available at your parlour!</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Add First Product</button>
        </div>
      ) : (
        <div className="admin-products-grid">
          {filtered.map(p => (
            <div key={p._id} className={`admin-product-item ${!p.isActive ? 'hidden-item' : ''}`}>
              <div className="api-image">
                {p.image ? (
                  <img src={p.image} alt={p.name} loading="lazy" />
                ) : (
                  <div className="api-img-placeholder">🧴</div>
                )}
                {!p.isActive && <div className="hidden-badge">Hidden</div>}
                <span className="agi-cat badge badge-rose">{p.category}</span>
              </div>
              <div className="admin-product-info">
                {p.brand && <small className="prod-brand-label">{p.brand}</small>}
                <h4>{p.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '4px 0 8px', lineHeight: 1.5 }}>
                  {p.description.length > 60 ? p.description.slice(0, 60) + '...' : p.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="price">₹{p.price}</span>
                  <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.72rem' }}>
                    {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="admin-product-actions">
                <button className="act-btn edit" onClick={() => openEdit(p)} style={{ flex: 1 }}>✏️ Edit</button>
                <button className="act-btn delete" onClick={() => deleteProduct(p._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}