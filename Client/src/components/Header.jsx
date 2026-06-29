import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  const location = useLocation();

  // Scroll event listener to add blur/transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and unlock body scroll on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsExpanded(false);
    document.body.classList.remove('menu-open');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProductsExpanded(false);
    document.body.classList.remove('menu-open');
  };

  const toggleProductsAccordion = (e) => {
    e.preventDefault();
    setIsProductsExpanded(!isProductsExpanded);
  };

  return (
    <>
      <header className={`main-header ${isScrolled ? 'scrolled' : ''} ${location.pathname === '/about' ? 'about-header' : ''}`}>
        <div className="header-container">
          {/* Logo Mark + Wordmark */}
          <Link to="/" className="logo" aria-label="AIROMOTION Home">
            AIROMOTION
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <div className="nav-item-container">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
            </div>
            
            <div className="nav-item-container">
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
            </div>

            <div className="nav-item-container">
              <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Products</NavLink>
              
              {/* Mega-Dropdown Menu */}
              <div className="products-dropdown-wrapper">
                <div>
                  <h4 className="dropdown-col-title">Smart Automation</h4>
                  <div className="dropdown-list">
                    <Link to="/products?cat=automation#switches" className="dropdown-item">Smart Switches</Link>
                    <Link to="/products?cat=automation#lighting" className="dropdown-item">Smart Lighting</Link>
                    <Link to="/products?cat=automation#sensors" className="dropdown-item">Sensors</Link>
                    <Link to="/products?cat=automation#hub" className="dropdown-item">Smart Hub</Link>
                    <Link to="/products?cat=automation#shading" className="dropdown-item">Shading Solutions</Link>
                  </div>
                </div>
                <div>
                  <h4 className="dropdown-col-title">Smart Security</h4>
                  <div className="dropdown-list">
                    <Link to="/products?cat=security#lock" className="dropdown-item">Smart Door Lock</Link>
                    <Link to="/products?cat=security#cctv" className="dropdown-item">HD CCTV System</Link>
                    <Link to="/products?cat=security#doorbell" className="dropdown-item">Smart Video Bell</Link>
                    <Link to="/products?cat=security#gate" className="dropdown-item">Gate Automation</Link>
                  </div>
                </div>
                <div>
                  <h4 className="dropdown-col-title">Smart Energy</h4>
                  <div className="dropdown-list">
                    <Link to="/products?cat=energy#ups" className="dropdown-item">Solar Hybrid UPS</Link>
                    <Link to="/products?cat=energy#panels" className="dropdown-item">Solar Panels</Link>
                    <Link to="/products?cat=energy#battery" className="dropdown-item">Solar Battery</Link>
                    <Link to="/products?cat=energy#wiring" className="dropdown-item">Wiring Solutions</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-item-container">
              <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Services</NavLink>
            </div>

            <div className="nav-item-container">
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
            </div>
          </nav>

          {/* Primary CTA Button (Desktop) */}
          <a
            href="/e-catalogue-placeholder.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn btn-outline-white btn-sm btn-download"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}
          >
            E-CATALOGUE&nbsp;<span className="btn-download-icon" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 19h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>

          {/* Hamburger Menu Trigger (Mobile) */}
          <button 
            className={`hamburger-trigger ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay Menu */}
      <div 
        className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`} 
        id="mobile-navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <button
          type="button"
          className="mobile-menu-close"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          ×
        </button>

        <div className="mobile-nav-list">
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/about" className="mobile-nav-link">About</Link>
          
          {/* Mobile Accordion */}
          <div>
            <div className="mobile-nav-link mobile-accordion-header" onClick={toggleProductsAccordion}>
              <span>Products</span>
              <span className={`accordion-arrow ${isProductsExpanded ? 'open' : ''}`}>↓</span>
            </div>
            <div className={`mobile-accordion-content ${isProductsExpanded ? 'open' : ''}`}>
              <Link to="/products?cat=automation" className="mobile-sub-link">Smart Automation</Link>
              <Link to="/products?cat=security" className="mobile-sub-link">Smart Security</Link>
              <Link to="/products?cat=energy" className="mobile-sub-link">Smart Energy</Link>
              <a href="/e-catalogue-placeholder.pdf" target="_blank" rel="noopener noreferrer" download className="mobile-sub-link">
                E-Catalogue&nbsp;<span className="btn-download-icon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 19h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <Link to="/services" className="mobile-nav-link">Services</Link>
          <Link to="/contact" className="mobile-nav-link">Contact</Link>
        </div>

        <div className="mobile-menu-footer">
          <div className="mobile-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mobile-social-link">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mobile-social-link">Instagram</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="mobile-social-link">X</a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="mobile-social-link">WhatsApp</a>
          </div>
          <div style={{ color: 'var(--text-grey-light)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} AIROMOTION
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
