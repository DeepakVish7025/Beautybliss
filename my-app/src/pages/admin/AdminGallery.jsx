import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCommon.css';

const CATS = ['General', 'Hair', 'Makeup', 'Bridal', 'Skin', 'Nail', 'Before & After'];
const BLANK = { title: '', description: '', category: 'General' };

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const load = () => api.get('/gallery/admin/all').then(r => setItems(r.data)).catch(() => {});
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

  const openAdd = () => { setForm(BLANK); setImageFile(null); setPreview(null); setShowForm(true); };

  const submit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error('Please select an image');
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('image', imageFile);
    try {
      await api.post('/gallery', fd);
      toast.success('Photo added to gallery!');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  const toggleVisibility = async (id) => {
    try {
      await api.patch(`/gallery/${id}/toggle`);
      toast.success('Visibility updated');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this gallery photo?')) return;
    await api.delete(`/gallery/${id}`);
    toast.success('Photo deleted');
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gallery</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Upload Photo</button>
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Gallery Photo</h2>
              <button onClick={() => setShowForm(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={submit}>
              {/* Drop Zone */}
              <div className="upload-zone" onClick={() => document.getElementById('gallery-file').click()}>
                {preview ? (
                  <img src={preview} alt="preview" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>📸</span>
                    <p>Click to select image</p>
                    <small>JPG, PNG, WEBP — max 5MB</small>
                  </div>
                )}
                <input id="gallery-file" type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>

              <div className="form-group" style={{ marginTop: 20 }}>
                <label>Title *</label>
                <input name="title" required value={form.title} onChange={handle} placeholder="e.g. Bridal Makeup Transformation" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handle}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea name="description" value={form.description} onChange={handle} placeholder="Brief description of this work..." rows={2} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading || !imageFile}>
                  {loading ? 'Uploading...' : '📤 Upload Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <div style={{ position: 'relative', maxWidth: 700, width: '100%' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontSize: '1rem', cursor: 'pointer' }} onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image} alt={lightbox.title} style={{ width: '100%', borderRadius: 16, maxHeight: '80vh', objectFit: 'contain' }} />
            <div style={{ background: 'white', borderRadius: '0 0 16px 16px', padding: '16px 20px' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{lightbox.title}</strong>
              {lightbox.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: 4 }}>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="gallery-stats-bar">
        <div className="gsb-item">
          <strong>{items.length}</strong>
          <span>Total Photos</span>
        </div>
        <div className="gsb-item">
          <strong>{items.filter(i => i.isActive).length}</strong>
          <span>Visible</span>
        </div>
        <div className="gsb-item">
          <strong>{items.filter(i => !i.isActive).length}</strong>
          <span>Hidden</span>
        </div>
        {[...new Set(items.map(i => i.category))].map(cat => (
          <div className="gsb-item" key={cat}>
            <strong>{items.filter(i => i.category === cat).length}</strong>
            <span>{cat}</span>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty-admin-state">
          <span>📸</span>
          <h3>No photos yet</h3>
          <p>Upload your first gallery photo to showcase your work!</p>
          <button className="btn btn-primary" onClick={openAdd}>+ Upload First Photo</button>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {items.map(item => (
            <div key={item._id} className={`admin-gallery-item ${!item.isActive ? 'hidden-item' : ''}`}>
              <div className="agi-image" onClick={() => setLightbox(item)}>
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="agi-overlay">
                  <span>🔍 View</span>
                </div>
                {!item.isActive && <div className="hidden-badge">Hidden</div>}
                <span className="agi-cat badge badge-rose">{item.category}</span>
              </div>
              <div className="admin-gallery-info">
                <h4>{item.title}</h4>
                {item.description && <small>{item.description}</small>}
                <div style={{ marginTop: 6 }}>
                  <small style={{ color: 'var(--text-light)' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </small>
                </div>
              </div>
              <div className="admin-gallery-actions">
                <button
                  className={`act-btn ${item.isActive ? 'edit' : 'confirm'}`}
                  onClick={() => toggleVisibility(item._id)}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  {item.isActive ? '👁 Hide' : '👁 Show'}
                </button>
                <button className="act-btn delete" onClick={() => deleteItem(item._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}