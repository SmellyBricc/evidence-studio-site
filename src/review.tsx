import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/manrope/wght.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpecialistReviewForm } from "./components/SpecialistReviewForm";
import { ThemeToggle } from "./components/ThemeToggle";
import { contactHref } from "./lib/site";
import "./styles.css";

function ReviewPage() {
  return (
    <>
      <a className="skip-link" href="#review-main">Skip to specialist review</a>
      <header className="site-header">
        <nav className="site-nav shell" aria-label="Specialist review navigation">
          <a className="brand" href="./index.html" aria-label="Evidence Studio home">
            <img src="./assets/icon.png" alt="" width="34" height="34" />
            <span>Evidence Studio</span>
          </a>
          <div className="nav-actions">
            <a className="review-demo-link" href="./index.html#demo">Try the demo</a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="review-main" tabIndex={-1}>
        <section className="review-hero shell-wide" aria-labelledby="review-title">
          <div className="review-hero-copy">
            <h1 id="review-title">
              <span>Tell us where audit</span>
              <span>reporting breaks.</span>
            </h1>
            <p>Answer six practical questions. Nothing leaves this page until you prepare an email.</p>
          </div>
          <figure className="review-hero-media">
            <picture>
              <source
                srcSet="./assets/campaign-still-768.avif 768w, ./assets/campaign-still-1200.avif 1200w, ./assets/campaign-still.avif 1536w"
                sizes="(max-width: 900px) calc(100vw - 20px), 48vw"
                type="image/avif"
              />
              <img
                src="./assets/campaign-still.jpg"
                alt="Layered accessibility evidence and redaction material on a dark archival table"
                width="1536"
                height="1024"
                fetchPriority="high"
              />
            </picture>
            <picture className="review-hero-slice">
              <source srcSet="./assets/evidence-redacted.webp" type="image/webp" />
              <img
                src="./assets/evidence-redacted.png"
                alt="Protected client evidence with private details covered"
                width="1440"
                height="900"
              />
            </picture>
          </figure>
        </section>

        <section className="review-section shell-wide" aria-label="Evidence Studio specialist review form">
          <SpecialistReviewForm />
        </section>
      </main>

      <footer className="site-footer review-footer">
        <div className="footer-inner shell">
          <a className="brand footer-brand" href="./index.html" aria-label="Evidence Studio home">
            <img src="./assets/icon.png" alt="" width="34" height="34" />
            <span>Evidence Studio</span>
          </a>
          <p>Critical feedback is welcome.</p>
          <div className="footer-links">
            <a href={contactHref}>Contact</a>
            <a href="./privacy.html">Privacy</a>
            <a href="./terms.html">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReviewPage />
  </StrictMode>,
);
