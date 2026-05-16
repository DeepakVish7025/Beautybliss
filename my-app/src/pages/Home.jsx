import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiArrowRight, FiPhone, FiCheck } from 'react-icons/fi';
import api from '../utils/api';
import './Home.css';

const FEATURES = [
  { icon: '✨', title: 'Expert Stylists', desc: 'Trained professionals with years of experience' },
  { icon: '🌿', title: 'Premium Products', desc: 'Only the finest beauty brands and products' },
  { icon: '💆', title: 'Relaxing Ambiance', desc: 'A serene space designed for your comfort' },
  { icon: '⏰', title: 'Flexible Timings', desc: 'Open 7 days a week for your convenience' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', rating: 5, text: 'Absolutely loved my bridal makeup! The team was professional and made me feel like a queen on my special day.' },
  { name: 'Anjali Singh', rating: 5, text: 'Best facial I have ever had. My skin has never felt this good. Will definitely be coming back!' },
  { name: 'Meera Patel', rating: 5, text: 'The hair treatment transformed my dry, frizzy hair. Highly recommend Beauty Bliss Salon to everyone!' },
];

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">✦ Welcome to Beauty Bliss Salon</span>
            <h1>
              Where Beauty<br />
              <em>Meets Bliss</em>
            </h1>
            <p>Discover a world of luxury beauty treatments tailored just for you. From hair to nails, we bring out your best self.</p>
            <div className="hero-actions">
              <Link to="/booking" className="btn btn-primary">
                Book Appointment <FiArrowRight />
              </Link>
              <a href="tel:+919876543210" className="btn btn-outline hero-call">
                <FiPhone /> Call Now
              </a>
            </div>
            <div className="hero-stats">
              <div><strong>500+</strong><span>Happy Clients</span></div>
              <div className="stat-divider"></div>
              <div><strong>50+</strong><span>Services</span></div>
              <div className="stat-divider"></div>
              <div><strong>8+</strong><span>Years Experience</span></div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-video-wrapper">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="hero-video"
                poster="https://images.pexels.com/photos/3985338/pexels-photo-3985338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              >
                <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=231da6557876c6665042861e6955a1ee4f37f378&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
              
              <div className="hero-float-card card-top">
                <div className="card-icon-box pink">✨</div>
                <div>
                  <strong>Premium Care</strong>
                  <span>Luxury Treatments</span>
                </div>
              </div>

              <div className="hero-float-card card-bottom">
                <FiStar className="star-icon" />
                <div>
                  <strong>4.9/5 Rating</strong>
                  <span>500+ Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section-pad-sm">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i}>
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-pad" style={{ background: 'white' }}>
        <div className="container">
          <div className="text-center">
            <p className="section-subtitle">What We Offer</p>
            <h2 className="section-title">Our Services</h2>
            <div className="section-divider"></div>
          </div>
          {services.length > 0 ? (
            <div className="grid-3">
              {services.map(s => (
                <div className="service-card card" key={s._id}>
                  <div className="service-card-img">
                    {s.image ? (
                      <img src={s.image} alt={s.name} />
                    ) : (
                      <div className="service-img-placeholder">💅</div>
                    )}
                    <span className="service-category badge badge-rose">{s.category}</span>
                  </div>
                  <div className="service-card-body">
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <div className="service-meta">
                      <span className="service-price">₹{s.price}</span>
                      <span className="service-duration">⏱ {s.duration}</span>
                    </div>
                    <Link to="/booking" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="services-placeholder">
              <div className="grid-3">
                {['Hair Treatment', 'Bridal Makeup', 'Facial & Skin'].map((s, i) => (
                  <div className="service-card card" key={i}>
                    <div className="service-img-placeholder">💄</div>
                    <div className="service-card-body">
                      <h3>{s}</h3>
                      <p>Professional {s.toLowerCase()} services by our expert team with premium products.</p>
                      <div className="service-meta">
                        <span className="service-price">₹ ---</span>
                        <span className="service-duration">⏱ --- mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link to="/services" className="btn btn-outline">View All Services <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="about-strip section-pad">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <p className="section-subtitle">About Us</p>
              <h2 className="section-title">Beauty is Our<br /><em>Passion</em></h2>
              <div className="section-divider left"></div>
              <p>At Beauty Bliss Salon, we believe that every woman deserves to look and feel her absolute best. Our team of skilled professionals is dedicated to providing you with the highest quality beauty services in a warm, welcoming environment.</p>
              <ul className="about-points">
                {['Certified & experienced beauty professionals', 'Hygienic and sanitized environment', 'Personalized beauty consultations', 'Premium global beauty products'].map((p, i) => (
                  <li key={i}><FiCheck className="check-icon" />{p}</li>
                ))}
              </ul>
              <Link to="/contact" className="btn btn-dark" style={{ marginTop: '28px' }}>
                Get In Touch <FiArrowRight />
              </Link>
            </div>
            <div className="about-image">
              <div className="about-img-box">
                <div className="about-badge-float">
                  <strong>8+</strong>
                  <span>Years of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials section-pad" style={{ background: 'white' }}>
        <div className="container">
          <div className="text-center">
            <p className="section-subtitle">Client Love</p>
            <h2 className="section-title">What They Say</h2>
            <div className="section-divider"></div>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="stars">{[...Array(t.rating)].map((_, j) => <FiStar key={j} className="star-filled" />)}</div>
                <p>"{t.text}"</p>
                <strong>{t.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>Ready to Transform Your Look?</h2>
          <p>Book your appointment today and experience the Beauty Bliss difference.</p>
          <div className="cta-actions">
            <Link to="/booking" className="btn btn-primary">Book Appointment <FiArrowRight /></Link>
            <a href="tel:+919876543210" className="btn btn-outline">
              <FiPhone /> +91 98765 43210
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}