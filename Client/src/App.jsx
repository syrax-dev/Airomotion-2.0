import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import LoadingScreen from './components/LoadingScreen';
import Seo from './components/Seo';
import './App.css';

// Lazy loading components for code splitting & performance optimization (Lighthouse 95+ target)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <Seo />
        {/* Immersive navigation header */}
        <Header />
        
        {/* Main page content content area */}
        <main style={{ flex: 1, position: 'relative' }}>
          <Suspense fallback={<LoadingScreen />}>
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
        <FloatingActions />
      </div>
    </Router>
  );
}

export default App;
