import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCommon.css';

const CATS = ['Hair', 'Skin & Facial', 'Makeup', 'Nail', 'Waxing & Threading', 'Bridal', 'Other'];
const BLANK = { name: '', description: '', price: '', duration: '', category: 'Hair', isActive: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/services/admin/all').then(r => setServices(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(BLANK); setEditId(null); setImageFile(null); setShowForm(true); };
  const openEdit = s => { setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, isActive: s.isActive }); setEditId(s._id); setImageFile(null); setShowForm(true); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editId) await api.put(`/services/${editId}`, fd);
      else await api.post('/services', fd);
      toast.success(editId ? 'Service updated!' : 'Service added!');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving service');
    } finally { setLoading(false); }
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    toast.success('Service deleted');
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Services</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowForm(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={submit} encType="multipart/form-data">
              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label>Service Name *</label>
                  <input name="name" required value={form.name} onChange={handle} placeholder="e.g. Classic Facial" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handle}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" required value={form.price} onChange={handle} placeholder="500" />
                </div>
                <div className="form-group">
                  <label>Duration *</label>
                  <input name="duration" required value={form.duration} onChange={handle} placeholder="45 mins" />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" required value={form.description} onChange={handle} placeholder="Describe the service..." rows={3} />
              </div>
              <div className="form-group">
                <label>Service Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  Active (visible to public)
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>No services yet. Add your first service!</td></tr>
            ) : services.map(s => (
              <tr key={s._id}>
                <td>
                  {s.image ? <img src={s.image} alt={s.name} className="table-thumb" /> : <div className="table-thumb-placeholder">💅</div>}
                </td>
                <td><strong>{s.name}</strong></td>
                <td><span className="badge badge-rose">{s.category}</span></td>
                <td>₹{s.price}</td>
                <td>{s.duration}</td>
                <td><span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>{s.isActive ? 'Active' : 'Hidden'}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="act-btn edit" onClick={() => openEdit(s)}>Edit</button>
                    <button className="act-btn delete" onClick={() => deleteService(s._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}