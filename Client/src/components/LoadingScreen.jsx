import './LoadingScreen.css';

const LoadingScreen = () => (
  <section className="loading-screen" role="status" aria-live="polite" aria-label="Loading AIROMOTION">
    <div className="loading-screen__content">
      <div className="loading-screen__mark" aria-hidden="true">
        <span className="loading-screen__ring loading-screen__ring--outer" />
        <span className="loading-screen__ring loading-screen__ring--inner" />
        <span className="loading-screen__core" />
      </div>
      <span className="loading-screen__brand">AIROMOTION</span>
    </div>
  </section>
);

export default LoadingScreen;
