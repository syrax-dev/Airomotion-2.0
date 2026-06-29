import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Lazy loading components for code splitting & performance optimization (Lighthouse 95+ target)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

// Premium minimal loading state for lazy loaded sections
const LoadingFallback = () => (
  <div style={{
    backgroundColor: '#ffffff',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    width: '100vw',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    fontSize: '0.85rem',
    fontWeight: 500
  }}>
    AIROMOTION
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Immersive navigation header */}
        <Header />
        
        {/* Main page content content area */}
        <main style={{ flex: 1, position: 'relative' }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              {/* Fallback routing */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Premium footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
