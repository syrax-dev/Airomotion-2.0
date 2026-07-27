import React, { useEffect, useState } from 'react';
import './ImageFader.css';

const ImageFader = ({ images = [], interval = 4000, alt = '' }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval]);

  return (
    <div
      className="image-fader"
      aria-hidden={images.length === 0}
      style={{ '--fader-duration': `${interval}ms` }}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={i === index ? alt : ''}
          className={`image-fader-img ${i === index ? 'active' : ''}`}
          loading="lazy"
          aria-hidden={i === index ? 'false' : 'true'}
        />
      ))}
    </div>
  );
};

export default ImageFader;
