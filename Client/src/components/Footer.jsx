import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5 3.66 9.12 8.44 9.93v-7.03H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.77l-.44 2.9h-2.33v7.03C18.34 21.19 22 17.07 22 12.07Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52 3.48A11.84 11.84 0 0 0 12.02 0C5.39 0 .02 5.37.02 12c0 2.12.56 4.2 1.62 6.03L0 24l6.15-1.61A11.95 11.95 0 0 0 12.02 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.5-8.52zM12.02 21.82a9.77 9.77 0 0 1-4.98-1.37l-.36-.21-3.65.96.97-3.56-.24-.37A9.8 9.8 0 1 1 12.02 21.82zm5.39-7.35c-.29-.15-1.72-.85-1.98-.95-.27-.1-.46-.15-.66.15-.19.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.15-1.21-.44-2.31-1.41-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.14-.14.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.17-.24-.58-.49-.49-.66-.5h-.56c-.19 0-.49.07-.75.37-.26.29-.99.97-.99 2.36s1.01 2.73 1.15 2.92c.15.19 1.98 3.02 4.79 4.24.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.56.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.16 21 3 14.84 3 7a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1c0 1.23.2 2.44.57 3.56a1 1 0 0 1-.24 1.01l-2.2 2.2Z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.1 7-10.5A7 7 0 0 0 5 10.5C5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.5" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container">
        {/* Footer Main Grid */}
        <div className="footer-grid">
          {/* Column 01 — Brand */}
          <div className="footer-col">
            <Link to="/" className="footer-brand-logo-link" aria-label="AIROMOTION Home">
              <span className="footer-brand-logo">AIROMOTION</span>
            </Link>
            <p className="footer-brand-subtitle">Connecting your world, Seamlessly</p>
            <p className="footer-desc">
              Intelligent automation, security, and energy solutions engineered for modern living and connected spaces.
            </p>
            {/* Social Links */}
            <div className="footer-socials">
              <a href="https://www.facebook.com/airomotion" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/airomotion" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://x.com/airomotion" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="X (formerly Twitter)">
                <XIcon />
              </a>
              <a href="https://wa.me/919712925077" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Column 02 — Explore */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link-item">Home</Link>
              <Link to="/about" className="footer-link-item">About</Link>
              <Link to="/products" className="footer-link-item">Products</Link>
              <Link to="/services" className="footer-link-item">Services</Link>
              <Link to="/contact" className="footer-link-item">Contact</Link>
            </div>
          </div>

          {/* Column 03 — Solutions */}
          <div className="footer-col">
            <h4 className="footer-heading">Solutions</h4>
            <div className="footer-links">
              <Link to="/products?category=automation#category-start" className="footer-link-item">Smart Automation</Link>
              <Link to="/products?category=security#category-start" className="footer-link-item">Smart Security</Link>
              <Link to="/products?category=energy#category-start" className="footer-link-item">Energy Management</Link>
            </div>
          </div>

          {/* Column 04 — Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><EmailIcon /></span>
                <span>connect@airomotion.com</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><PhoneIcon /></span>
                <span>(+91) 97129 25077</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><LocationIcon /></span>
                <span>Gandhinagar, Gujarat, India 382610</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {currentYear} <em>AIROMOTION.</em> All rights reserved.
          </div>
          <div className="footer-credit">
            Designed &amp; Developed by <a href="https://syraxdev.vercel.app/" target="_blank" rel="noopener noreferrer">SyraxDev</a>
          </div>
          <div className="footer-tagline">Connect, Control & Relax.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
