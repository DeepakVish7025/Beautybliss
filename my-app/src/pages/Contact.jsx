import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiClock } from 'react-icons/fi';
import './Contact.css';

export default function Contact() {
  return (
    <div>
      <div className="page-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions or want to know more about our services? Reach out to us and we'll get back to you shortly.</p>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="cc-icon"><FiMapPin /></div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>Dharmapur Jaunpur Uttar Pradesh India</p>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><FiPhone /></div>
                  <div>
                    <h4>Call Us</h4>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                    <br /><a href="tel:+919876543211">+91 98765 43211</a>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><FiMail /></div>
                  <div>
                    <h4>Email Us</h4>
                    <a href="mailto:hello@beautyblissnad.com">hello@beautyblissnad.com</a>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon"><FiClock /></div>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Mon–Sat: 9 AM – 8 PM<br />Sunday: 10 AM – 6 PM</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="#" className="social-link"><FiInstagram />Instagram</a>
                  <a href="#" className="social-link"><FiFacebook />Facebook</a>
                </div>
              </div>
            </div>

            <div className="contact-map-box">
              <div className="map-placeholder">
                <div className="map-content">
                  <FiMapPin size={40} />
                  <h3>Beauty Bliss Nad</h3>
                  <p>Dharmapur Jaunpur Uttar Pradesh India</p>
                  <a
                    href="https://www.google.com/maps/place/Beauty+Bliss+Salon+and+Academy/@25.7486082,82.7532571,17z/data=!3m1!4b1!4m6!3m5!1s0x3990310d4fe044db:0x2488b8e1c859cd26!8m2!3d25.7486082!4d82.755832!16s%2Fg%2F11yf4n7tgh?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank" rel="noreferrer"
                    className="btn btn-primary"
                    style={{ marginTop: '16px' }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
              <div className="contact-cta-card">
                <h3>Ready to Book?</h3>
                <p>Skip the wait — book your appointment online and we'll confirm within the hour.</p>
                <a href="/booking" className="btn btn-primary">Book Appointment Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}