import React, { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import './CatalogueFlipbook.css';

const PAGE_COUNT = 22;
const PAGE_WIDTH = 520;
const PAGE_HEIGHT = 735;
const pageSource = (page) => `/catalogue/page-${String(page).padStart(3, '0')}.webp`;

const CataloguePage = React.forwardRef(({ page }, ref) => (
  <div className="catalogue-flip-page" ref={ref}>
    <img src={pageSource(page)} alt={`Catalogue page ${page + 1}`} draggable={false} />
  </div>
));
CataloguePage.displayName = 'CataloguePage';

export default function CatalogueFlipbook() {
  const bookRef = useRef(null);
  const stageRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPortrait, setIsPortrait] = useState(() => window.innerWidth < 900);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerWidth < 900);
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') bookRef.current?.pageFlip()?.flipNext();
      if (event.key === 'ArrowLeft') bookRef.current?.pageFlip()?.flipPrev();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, []);

  const goPrevious = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);
  const goNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await stageRef.current?.requestFullscreen?.();
    else await document.exitFullscreen?.();
  };

  return (
    <section className={`flipbook-viewer${fullscreen ? ' flipbook-viewer--fullscreen' : ''}`} ref={stageRef} aria-label="Product catalogue">
      <div className="flipbook-book-frame">
        <HTMLFlipBook
          ref={bookRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          size="stretch"
          minWidth={220}
          maxWidth={PAGE_WIDTH}
          minHeight={311}
          maxHeight={PAGE_HEIGHT}
          drawShadow
          maxShadowOpacity={0.42}
          showCover
          usePortrait={isPortrait}
          mobileScrollSupport
          flippingTime={850}
          useMouseEvents
          clickEventForward
          swipeDistance={24}
          showPageCorners
          className="catalogue-flipbook"
          onFlip={(event) => setCurrentPage(event.data)}
        >
          {Array.from({ length: PAGE_COUNT }, (_, page) => (
            <CataloguePage key={page} page={page} />
          ))}
        </HTMLFlipBook>
      </div>

      <div className="flipbook-controls">
        <button className="flipbook-arrow" onClick={goPrevious} aria-label="Previous page" disabled={currentPage === 0}>
          <ChevronLeft size={20} strokeWidth={1.7} />
        </button>
        <span className="flipbook-page-count"><b>{String(currentPage + 1).padStart(2, '0')}</b><i />{String(PAGE_COUNT).padStart(2, '0')}</span>
        <button className="flipbook-arrow" onClick={goNext} aria-label="Next page" disabled={currentPage >= PAGE_COUNT - 1}>
          <ChevronRight size={20} strokeWidth={1.7} />
        </button>
        <button className="flipbook-fullscreen" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>

      <a className="flipbook-download" href="/Airomotion.pdf" download="AIROMOTION-Catalogue.pdf">
        <Download size={16} strokeWidth={1.8} />
        <span>Download Catalogue</span>
      </a>
    </section>
  );
}
