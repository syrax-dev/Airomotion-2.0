import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Products.css';

// SVG Icons
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Custom Reveal component matching the reference site's lx-reveal behavior
const Reveal = ({ children, delay = 0, className = '' }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.05 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`lx-reveal ${isVisible ? 'in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
};

// Data Schema
const productCategories = {
  automation: {
    hero: "/cat-automation.jpg",
    groups: [
      { title: 'Switches', items: ['Smart Touch Switches', 'Smart Control Panel', 'Retrofit Switches Module'] },
      { title: 'Smart Lighting', items: ['Smart LED Panel', 'Ambient Strip Lights', 'Smart Downlights', 'Track Spot Light', 'LED Bulb & Strip Light'] },
      { title: 'Sensors', items: ['Motion Sensor', 'Door / Window Sensor', 'Environment Sensor', 'Presence Sensor', 'Vibration Sensor', 'Water Leak Sensor', 'Smart Gas Detector', 'Smoke Detector'] },
      { title: 'Hub', items: ['Smart Hub Controller'] },
      {
        title: 'Shading', items: [
          { sub: 'Curtain Controller', items: ['Lite', 'Deluxe', 'Premium'] },
          { sub: 'Roller Shade Controller', items: ['Mechanical Limit', 'Electronic Limit'] },
          { sub: 'Remote', items: ['Handheld Transmitter', 'Wall Mount Transmitter', 'Premium Handheld Transmitter'] },
          { sub: 'Curtain Driver', items: ['Track Version', 'Rod Version'] },
          { sub: 'Roller Shade Driver', items: ['Windproof Exterior Blind', 'Skylight Blinds'] }
        ]
      }
    ],
    products: [
      { img: "/prod-switch.jpg", name: 'Smart Touch Switch', desc: 'Black-glass capacitive panel.', cat: 'Switches' },
      { img: "/cat-automation.jpg", name: 'Smart Control Panel', desc: 'Wall-mounted scene controller.', cat: 'Switches' },
      { img: "/prod-switch.jpg", name: 'Ambient Strip Light', desc: 'Tunable architectural strip.', cat: 'Lighting' },
      { img: "/prod-switch.jpg", name: 'Smart Downlight', desc: 'Dimmable recessed downlight.', cat: 'Lighting' },
      { img: "/prod-switch.jpg", name: 'Motion Sensor', desc: 'Ceiling-mount PIR sensor.', cat: 'Sensors' },
      { img: "/prod-switch.jpg", name: 'Curtain Driver', desc: 'Whisper-quiet track motor.', cat: 'Shading' }
    ]
  },
  security: {
    hero: "/cat-security.jpg",
    groups: [
      { title: 'Smart Door Lock', items: ['Fingerprint', 'PIN & RFID', 'Auto-Lock Timer', 'Tamper Alerts'] },
      { title: 'HD CCTV System', items: ['4K Resolution', 'Night Vision', 'Cloud Storage', 'Live App View'] },
      { title: 'Smart Video Bell', items: ['Two-Way Audio', 'Motion Detection', 'Cloud Recording', 'Face Recognition'] },
      { title: 'Gate Automation', items: ['Boom Barrier', 'Sliding Gate Controller'] }
    ],
    products: [
      { img: "/prod-lock.jpg", name: 'Smart Door Lock', desc: 'Fingerprint + PIN + RFID.', cat: 'Locks' },
      { img: "/prod-cctv.jpg", name: '4K Dome Camera', desc: 'Night vision, cloud storage.', cat: 'CCTV' },
      { img: "/prod-cctv.jpg", name: 'Bullet Camera', desc: 'Long-range surveillance.', cat: 'CCTV' },
      { img: "/prod-lock.jpg", name: 'Smart Video Bell', desc: 'Two-way audio, face recognition.', cat: 'Video Bell' },
      { img: "/prod-lock.jpg", name: 'Sliding Gate Controller', desc: 'Heavy-duty gate automation.', cat: 'Gate' },
      { img: "/prod-cctv.jpg", name: 'Boom Barrier', desc: 'Commercial access control.', cat: 'Gate' }
    ]
  },
  energy: {
    hero: "/cat-energy.jpg",
    groups: [
      { title: 'Solar Hybrid UPS', items: ['LT-300VA', 'LT-350VA', 'LT-550VA', 'LT-850VA', 'LT-1250VA', 'LT-2000VA', 'LT-2500VA', 'LT-3000VA'] },
      { title: 'Solar Panels', items: ['Monocrystalline', 'Bifacial Modules'] },
      { title: 'Solar Battery', items: ['Lithium-Ion', 'Deep-Cycle'] },
      { title: 'Wiring', items: ['Solar DC Cabling', 'Conduit & Hardware'] }
    ],
    products: [
      { img: "/prod-ups.jpg", name: 'LT-1250VA Hybrid UPS', desc: 'Mid-range residential backup.', cat: 'UPS' },
      { img: "/prod-ups.jpg", name: 'LT-3000VA Hybrid UPS', desc: 'Whole-home solar backup.', cat: 'UPS' },
      { img: "/prod-ups.jpg", name: 'LT-550VA Hybrid UPS', desc: 'Compact apartment unit.', cat: 'UPS' },
      { img: "/cat-energy.jpg", name: 'Monocrystalline Panel', desc: 'High-efficiency PV module.', cat: 'Panels' },
      { img: "/cat-energy.jpg", name: 'Lithium Battery', desc: 'Long-cycle home battery.', cat: 'Battery' },
      { img: "/cat-energy.jpg", name: 'Solar DC Cabling', desc: 'UV-rated solar wiring.', cat: 'Wiring' }
    ]
  }
};

const tabs = [
  { id: 'automation', label: 'Smart Automation' },
  { id: 'security', label: 'Smart Security' },
  { id: 'energy', label: 'Smart Energy' }
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = ['automation', 'security', 'energy'].includes(searchParams.get('category'))
    ? searchParams.get('category')
    : 'automation';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [openGroups, setOpenGroups] = useState({ Switches: true });
  const catalogRef = useRef(null);

  const categoryData = productCategories[activeCategory];

  const handleCategoryChange = (categoryId) => {
    if (categoryId === activeCategory) return;

    setActiveCategory(categoryId);

    requestAnimationFrame(() => {
      if (!catalogRef.current) return;

      const offset = window.matchMedia('(max-width: 480px)').matches
        ? 120
        : window.matchMedia('(max-width: 900px)').matches
          ? 130
          : 150;

      const catalogTop = catalogRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(catalogTop - offset, 0),
        behavior: 'smooth'
      });
    });
  };

  const toggleGroup = (title) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="lx-page">
      <section className="bw-page-header">
        <div className="lx-container">
          <Reveal>
            <span className="bw-eyebrow">Catalogue</span>
            <h1>
              The <em>AIROMOTION</em> Collection.
            </h1>
            <p>
              Hardware engineered to disappear into the architecture and last as long as it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="lx-section" style={{ paddingTop: 80 }}>
        <Reveal>
          <div className="lx-container">
            <div className="lx-tabs" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeCategory === tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`lx-tab ${activeCategory === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lx-catalog" ref={catalogRef}>
            <aside className="lx-side">
              {categoryData.groups.map(group => {
                const isOpen = openGroups[group.title];
                return (
                  <div className={`lx-side__group ${isOpen ? 'open' : ''}`} key={group.title}>
                    <button className="lx-side__head" onClick={() => toggleGroup(group.title)}>
                      <span>{group.title}</span>
                      <span className="chev">
                        <PlusIcon />
                      </span>
                    </button>
                    <div className="lx-side__list">
                      <ul>
                        {group.items.map(item => (
                          typeof item === 'string' ? (
                            <li key={item}>{item}</li>
                          ) : (
                            <li key={item.sub} style={{ listStyle: 'none', paddingLeft: 0 }}>
                              <div className="lx-side__sub">{item.sub}</div>
                              <ul>
                                {item.items.map(subItem => (
                                  <li key={subItem}>{subItem}</li>
                                ))}
                              </ul>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </aside>

            <div className="lx-grid">
              {categoryData.products.map((product, idx) => (
                <Reveal key={product.name + idx} delay={idx * 50}>
                  <article className="lx-prod">
                    <div className="lx-prod__img">
                      <img src={product.img} alt={product.name} loading="lazy" />
                    </div>
                    <div className="lx-prod__body">
                      <div className="lx-prod__cat">{product.cat}</div>
                      <h3 className="lx-prod__name">{product.name}</h3>
                      <p className="lx-prod__desc">{product.desc}</p>
                      <Link to="/contact" className="lx-prod__link">
                        Enquire{' '}
                        <span>
                          <ArrowIcon />
                        </span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Products;
