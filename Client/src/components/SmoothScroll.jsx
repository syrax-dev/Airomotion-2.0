import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const SmoothScroll = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 1.5,
      smoothWheel: true,
      anchors: true,
    });

    const handleMotionPreferenceChange = (event) => {
      if (event.matches) lenis.stop();
      else lenis.start();
    };

    prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionPreferenceChange);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
