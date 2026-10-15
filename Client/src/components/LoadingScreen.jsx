import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1600);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <section
      className={`loading-screen ${
        isExiting ? 'loading-screen--exit' : ''
      }`}
      aria-hidden="true"
    >
      <div className="loading-screen__content">

        <img
          className="loading-screen__logo"
          src="/airomotion_loading.webp"
          alt="AIROMOTION"
        />

        <div className="loading-screen__brand">
          AIROMOTION
        </div>

      </div>
    </section>
  );
};

export default LoadingScreen;