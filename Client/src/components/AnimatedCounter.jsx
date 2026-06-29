import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter counts up from 0 to the numeric prefix of a given value string
 * once the element enters the viewport.
 */
const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.1 
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    // Matches the leading digits (including decimal points)
    const numericMatch = value.match(/^([\d.]+)/);
    if (!numericMatch) {
      setCount(value);
      return;
    }

    const target = parseFloat(numericMatch[1]);
    const start = 0;
    const end = target;
    
    if (start === end) {
      setCount(target);
      return;
    }

    // Determine the number of decimal places in the target value
    const decimalPlaces = (numericMatch[1].split('.')[1] || '').length;

    const totalSteps = 60;
    const stepTime = Math.max(10, duration / totalSteps);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      // easeOutQuad easing function
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentRaw = start + (end - start) * easeProgress;
      
      // Keep decimal places if they exist, otherwise round to integer
      const current = decimalPlaces > 0 
        ? parseFloat(currentRaw.toFixed(decimalPlaces)) 
        : Math.floor(currentRaw);
      
      setCount(current);

      if (step >= totalSteps) {
        clearInterval(timer);
        setCount(target);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, hasStarted]);

  // Extract the suffix (anything after the leading numbers)
  const numericMatch = value.match(/^([\d.]+)/);
  const suffix = numericMatch ? value.slice(numericMatch[0].length) : '';

  return (
    <span ref={elementRef}>
      {hasStarted 
        ? (typeof count === 'number' ? count.toLocaleString(undefined, { minimumFractionDigits: 0 }) : count) 
        : '0'}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
