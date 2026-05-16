import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Layout from './component/Layout';
import Home from './pages/Home';
import Services from './pages/Service';
import Gallery from './pages/Gallery';
import Products from './pages/Product';
import Booking from './pages/Booking';
import Contact from './pages/Contact';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBookings from './pages/admin/AdminBookings';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="products" element={<Products />} />
        <Route path="booking" element={<Booking />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Login & Register */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Admin Protected */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: { fontFamily: "'Jost', sans-serif", fontSize: '0.9rem' }
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}