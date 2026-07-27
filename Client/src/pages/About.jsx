import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import './About.css';

const About = () => {
  const studioStats = [
    {
      value: '1000+',
      label: 'Product Delivered'
    },
    {
      value: '5Yrs',
      label: 'In Operation'
    },
    {
      value: '98%',
      label: 'Client Retention'
    },
    {
      value: '24/7',
      label: 'Support Available'
    }
  ];

  const partners = ['Residential', 'Commercial', 'Hotel & Resorts', 'Office', 'Builder Project', 'Govt. Project'];

  return (
    <div className="about-page-container">
      <section className="bw-page-header">
        <div className="lx-container">
          <span className="bw-eyebrow">Airomotion</span>
          <h1>
            <em>AIROMOTION</em> moves innovation with intelligence.
          </h1>
          <p>
            Reflects a promise of efficiency, creativity, and forward momentum in every venture.
          </p>
        </div>
      </section>

      {/* 1. OUR STORY HERO */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-split">
            <ScrollReveal animation="reveal-on-scroll" className="about-story-image">
              <img src="/src/assets/images/sections/about-story.webp" alt="AIROMOTION Story" />
            </ScrollReveal>
            <ScrollReveal animation="reveal-on-scroll" delay="delay-1" className="about-story-text">
              <span className="about-story-eyebrow">Our Story</span>
              <h2 className="about-story-headline">Designed by the people who live with it.</h2>
              <p className="about-story-desc">
                We started as a startup in Gandhinagar in 2024, offering electronics products r&d and manufacuring focused solely on electronics products. We expanded our services to a complete wireless automation solution, including curtain motorization, smart switches, sensors.
              </p>
              <p className="about-story-desc">
                Airomotion provide smart IOT automation, smart Security, Energy Management products and solutions on the Indian market. we offer complete categories of smart devices, integrating advanced IoT technologies and form the base of both smart home solutions and other industrial solutions.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="section" style={{ padding: 0, borderBottom: '1px solid var(--border-black)' }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="mv-grid architectural-grid">
            {/* Mission */}
            <ScrollReveal animation="reveal-on-scroll" delay="delay-1" className="mv-card architectural-grid-item">
              <span className="text-uppercase-badge">Mission</span>
              <h3 className="mv-title">The standard of the category.</h3>
              <p className="mv-desc">
                To be the brand that architects, developers and private clients trust by name when only one outcome is acceptable — a system that looks beautiful, runs reliably, and stays modern for a decade.
              </p>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal animation="reveal-on-scroll" delay="delay-2" className="mv-card architectural-grid-item">
              <span className="text-uppercase-badge">Vision</span>
              <h3 className="mv-title">Technology, finally at rest.</h3>
              <p className="mv-desc">
                We design environments that read your intent and respond quietly — never demanding attention, never crashing the conversation. Intelligent systems should feel less like devices and more like a well-trained staff.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {studioStats.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                animation="reveal-on-scroll"
                delay={`delay-${index % 3 + 1}`}
                className="about-stat-card"
              >
                <span className="about-stat-num">
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className="about-stat-label">{stat.label}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PARTNERS SECTION */}
      <section className="about-partners-section">
        <div className="container">
          <ScrollReveal animation="reveal-on-scroll" className="about-partners-head">
            <span className="about-partners-eyebrow">What we automate</span>
            <h2>Smart Ways to transform your place</h2>
            <p>
              Smart Automation - Smart Security - Energy Management
            </p>
          </ScrollReveal>

          <div className="about-partners-grid">
            {partners.map((partner, index) => (
              <ScrollReveal
                key={partner}
                animation="reveal-on-scroll"
                delay={`delay-${index % 3 + 1}`}
                className="about-partner-card"
              >
                {partner}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;
