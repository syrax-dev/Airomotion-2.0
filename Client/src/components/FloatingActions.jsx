import { useEffect, useState } from 'react';
import './FloatingActions.css';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.04 2a9.83 9.83 0 0 0-8.33 15.06L2 22l5.08-1.66A9.95 9.95 0 1 0 12.04 2Zm0 17.95a8.12 8.12 0 0 1-4.14-1.13l-.3-.18-3.01.98.99-2.94-.2-.3a8.13 8.13 0 1 1 6.66 3.57Zm4.46-6.1c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.62 6.62 0 0 1-1.94-1.2 7.27 7.27 0 0 1-1.35-1.68c-.14-.24-.01-.37.1-.49l.36-.42c.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42l-.78-1.86c-.19-.46-.39-.4-.53-.4h-.45c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.5.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);

const UpArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 5 7 7-1.4 1.4-4.6-4.6V19h-2V8.8l-4.6 4.6L5 12l7-7Z" />
  </svg>
);

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const updateScrollTopVisibility = () => setShowScrollTop(window.scrollY > 250);
    updateScrollTopVisibility();
    window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollTopVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="floating-actions" aria-label="Quick actions">
      <button
        type="button"
        className={`floating-action floating-action--top${showScrollTop ? ' is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showScrollTop ? 0 : -1}
      >
        <UpArrowIcon />
      </button>
      <a
        href="https://wa.me/919712925077"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-action floating-action--whatsapp"
        aria-label="Chat with AIROMOTION on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
};

export default FloatingActions;
