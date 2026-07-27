import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ImageFader from '../components/ImageFader';
import './Home.css';

// Section images
import AutomationHall from '../assets/images/sections/Automation/Automation_Hall.webp';
import AutomationKitchen from '../assets/images/sections/Automation/Automation_Kitchen.webp';
import SecurityVideoBell from '../assets/images/sections/Security/Security_Video-Bell.webp';
import SecurityDoorLock from '../assets/images/sections/Security/Security_Door-Lock.webp';
import EnergySolar from '../assets/images/sections/Energy/Energy_Solar.webp';
import EnergyUPS from '../assets/images/sections/Energy/Energy_UPS.webp';
import heroVideo from '../assets/videos/HeroVideo.webm';

const Home = () => {
  const clientStories = [
    {
      cat: 'Smart Home Technology',
      q: 'Our home now responds to us — not the other way around. The switches alone changed how the kids interact with light.',
      a: 'Aarav & Meera S., 4BHK Villa'
    },
    {
      cat: 'Smart Security',
      q: 'The boom barrier and CCTV package was installed in two days. The app view is sharp and the night vision is the real deal.',
      a: 'Neel Desai, Appartment'
    },
    {
      cat: 'Energy Solution',
      q: 'Our solar hybrid UPS has paid for itself in peace of mind alone. Two power cuts last week — we never noticed.',
      a: 'Dr. Kavitha, Clinic'
    }
  ];

  return (
    <div className="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <video className="hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src={heroVideo} type="video/webm" />
        </video>
        <div className="hero-overlay"></div>

        <div className="container">
          <div className="hero-content">
            <ScrollReveal animation="reveal-on-scroll" isHero={true} className="hero-text-block">
              <span className="text-uppercase-badge" style={{ color: 'var(--text-white)' }}>
                Connecting your world, Seamlessly
              </span>
              <h1 className="hero-title">
                Connect, Control <br />
                &amp; Relax.
              </h1>
              <p className="hero-desc">
                Intelligent automation, connected security, and reliable energy solutions—designed to make every space work beautifully.
              </p>
              
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-solid-white">
                  Explore Products
                </Link>
                <Link to="/contact" className="btn btn-outline-white">
                  Free Consultation
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT MARQUEE */}
      <div className="marquee-container" role="marquee">
        <div className="marquee-content">
          {[...Array(4)].map((_, groupIndex) => (
            <React.Fragment key={groupIndex}>
              <span className="marquee-item"><span className="marquee-dot"></span> Smart Switches</span>
              <span className="marquee-item"><span className="marquee-dot"></span> Ambient Lighting</span>
              <span className="marquee-item"><span className="marquee-dot"></span> Motion Sensors</span>
              <span className="marquee-item"><span className="marquee-dot"></span> Video Security</span>
              <span className="marquee-item"><span className="marquee-dot"></span> Motorized Blinds</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. WHAT WE DO SECTION */}
      <section className="section">
        <div className="container">
          <ScrollReveal animation="reveal-on-scroll" className="what-we-do-head">
            <p className="eyebrow">What We Do</p>
            <h2 className="what-we-do-title">
              Every system, <strong>one experience.</strong>
            </h2>
            <p className="what-we-do-desc">
              Light, climate and security designed as a single composition — controlled by a touch, a voice, or simply by being present.
            </p>
          </ScrollReveal>
        </div>

        <div className="container" style={{ marginTop: '70px' }}>
          <div className="cat-grid">
            {/* Pillar 01: Smart Automation */}
            <ScrollReveal animation="reveal-on-scroll" className="cat-card">
              <div className="cat-media">
                  <ImageFader images={[AutomationHall, AutomationKitchen]} alt="Smart Automation" interval={5500} />
                </div>
              <div className="cat-body">
                <p className="eyebrow">01 — SMART AUTOMATION</p>
                <h3 className="h2 cat-title">Spaces that move with you.</h3>
                <p className="cat-desc">
                  Smart switches, intelligent lighting scenes, motion-aware sensors and silent motorized shading — orchestrated by a single hub.
                </p>
                <ul className="cat-list">
                  <li>Smart Switches</li>
                  <li>Smart Lighting</li>
                  <li>Sensors & Hubs</li>
                  <li>Curtains & Shades</li>
                </ul>
                <Link to="/products?category=automation" className="cat-link">
                  Explore Range <span className="cat-link-arrow">→</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Pillar 02: Smart Security */}
            <ScrollReveal animation="reveal-on-scroll" delay="delay-2" className="cat-card">
              <div className="cat-media">
                  <ImageFader images={[SecurityVideoBell, SecurityDoorLock]} alt="Smart Security" interval={5500} />
                </div>
              <div className="cat-body">
                <p className="eyebrow">02 — SMART SECURITY</p>
                <h3 className="h2 cat-title">Protection, made invisible.</h3>
                <p className="cat-desc">
                  Biometric door locks, 4K cloud CCTV, AI video doorbells and gate automation working as one quiet, watchful layer.
                </p>
                <ul className="cat-list">
                  <li>Smart Door Locks</li>
                  <li>4K CCTV Systems</li>
                  <li>Smart Video Bells</li>
                  <li>Gate Automation</li>
                </ul>
                <Link to="/products?category=security" className="cat-link">
                  Explore Range <span className="cat-link-arrow">→</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Pillar 03: Energy Management */}
            <ScrollReveal animation="reveal-on-scroll" delay="delay-3" className="cat-card">
              <div className="cat-media">
                  <ImageFader images={[EnergySolar, EnergyUPS]} alt="Energy Management" interval={5500} />
                </div>
              <div className="cat-body">
                <p className="eyebrow">03 — ENERGY MANAGEMENT</p>
                <h3 className="h2 cat-title">Power on your terms.</h3>
                <p className="cat-desc">
                  Solar hybrid UPS, rooftop panels, lithium batteries and live energy monitoring — designed for uptime and efficiency.
                </p>
                <ul className="cat-list">
                  <li>Solar Hybrid UPS</li>
                  <li>Solar Panels</li>
                  <li>Solar Batteries</li>
                  <li>Energy Monitoring</li>
                </ul>
                <Link to="/products?category=energy" className="cat-link">
                  Explore Range <span className="cat-link-arrow">→</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. WHY AIROMOTION - COMPLETELY REFACTORED WITH UNIQUE CLASSES */}
      <section className="why-airomotion-section">
        <div className="why-airomotion-container">
          <ScrollReveal animation="reveal-on-scroll" className="why-airomotion-header">
            <p className="why-airomotion-eyebrow">Why AIROMOTION</p>
            <h2 className="why-airomotion-title">
              Considered to the <em>last detail.</em>
            </h2>
            <p className="why-airomotion-description">
              We don't sell components. We design systems that hold up visually,
              technically.
            </p>
          </ScrollReveal>

          <div className="why-airomotion-grid">
            <ScrollReveal animation="reveal-on-scroll" delay="delay-1" className="why-airomotion-card">
              <span className="why-airomotion-card-number">01</span>
              <h4 className="why-airomotion-card-title">Single Platform</h4>
              <p className="why-airomotion-card-text">Switches, lighting, climate, security and shading  orchestrated from one interface.</p>
            </ScrollReveal>

            <ScrollReveal animation="reveal-on-scroll" delay="delay-2" className="why-airomotion-card">
              <span className="why-airomotion-card-number">02</span>
              <h4 className="why-airomotion-card-title">Architect-Grade</h4>
              <p className="why-airomotion-card-text">Hardware finishes designed to disappear into the architecture, not interrupt it.</p>
            </ScrollReveal>

            <ScrollReveal animation="reveal-on-scroll" delay="delay-3" className="why-airomotion-card">
              <span className="why-airomotion-card-number">03</span>
              <h4 className="why-airomotion-card-title">Engineered Reliability</h4>
              <p className="why-airomotion-card-text">Wireless Freedom with Trusted Performance, redundant power, local logic that runs without the extra wiring.</p>
            </ScrollReveal>

            <ScrollReveal animation="reveal-on-scroll" delay="delay-1" className="why-airomotion-card">
              <span className="why-airomotion-card-number">04</span>
              <h4 className="why-airomotion-card-title">Lifetime Support</h4>
              <p className="why-airomotion-card-text">Dedicated engineers, maintenance and remote diagnostics.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <ScrollReveal animation="reveal-on-scroll">
              <span className="eyebrow">Clients</span>
              <h2 className="section-title">
                Trusted by people that <strong>set the standard.</strong>
              </h2>
            </ScrollReveal>
          </div>

          <div className="reviews">
            {clientStories.map((e, t) => (
              <ScrollReveal 
                key={e.cat} 
                animation="reveal-on-scroll" 
                delay={`delay-${(t % 3) + 1}`} 
                className="review"
              >
                <p className="review-cat eyebrow">{e.cat}</p>
                <p className="review-q">"{e.q}"</p>
                <p className="review-a">— {e.a}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="home-cta-section">
        {/* Dark background image with overlay */}
        <div className="home-cta-bg" style={{ backgroundImage: 'url(/src/assets/images/sections/cta-bg.webp)' }} />
        <div className="home-cta-overlay" />

        {/* Content */}
        <div className="home-cta-content">
          <ScrollReveal animation="reveal-on-scroll">
            <span className="home-cta-eyebrow">BEGIN</span>
            <h2 className="home-cta-title">Schedule a <em>private consultation.</em></h2>
            <p className="home-cta-desc">
              Meet our design team at our studio, on-site, or virtually. We'll walk through your space, your routines, and what intelligent living should feel like for you.
            </p>
            <Link to="/contact" className="home-cta-btn">
              Get Consultation <span className="home-cta-arrow">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default Home;
