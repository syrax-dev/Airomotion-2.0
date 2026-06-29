import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, className = '', animation = 'reveal-on-scroll', delay = '', isHero = false }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    // Reset visibility state on mount (critical for SPA navigation)
    setVisible(false);

    // Check if screen is small (mobile) - disable lazy load on small screens except for hero
    const isSmallScreen = window.innerWidth < 768;
    
    // If small screen and NOT a hero section, show immediately (no animation)
    if (isSmallScreen && !isHero) {
      setVisible(true);
      return;
    }

    // Small delay to ensure DOM is ready after route transition
    const initTimeout = setTimeout(() => {
      const currentRef = domRef.current;
      
      if (!currentRef) return;

      // Check if element is already in viewport on mount
      const rect = currentRef.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInViewport) {
        setVisible(true);
        return;
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            // Once visible, we can stop observing
            if (currentRef) {
              observer.unobserve(currentRef);
            }
          }
        });
      }, {
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before it enters fully
        threshold: 0.05
      });

      if (currentRef) {
        observer.observe(currentRef);
      }

      // Cleanup function
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, 50);

    return () => {
      clearTimeout(initTimeout);
    };
  }, []); // Empty dependency array ensures fresh setup on each mount

  return (
    <div
      ref={domRef}
      className={`${animation} ${delay} ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
