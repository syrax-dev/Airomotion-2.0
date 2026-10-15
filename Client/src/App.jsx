import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import LoadingScreen from './components/LoadingScreen';
import Seo from './components/Seo';

import './App.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Catalogue = lazy(() => import('./pages/Catalogue/Catalogue'));

function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <Router>
      <LoadingScreen
        onComplete={() => setShowLoading(false)}
      />

      <div
        className={showLoading ? 'app app--hidden' : 'app'}
      >
        <Seo />

        <Header />

        <main>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <FloatingActions />
      </div>
    </Router>
  );
}

export default App;