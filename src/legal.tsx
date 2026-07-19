import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/manrope/wght.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeToggle } from "./components/ThemeToggle";
import { contactHref } from "./lib/site";
import "./styles.css";

type LegalPage = "privacy" | "terms";

function LegalHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav shell" aria-label="Legal page navigation">
        <a className="brand" href="./index.html" aria-label="Evidence Studio home">
          <img src="./assets/icon.png" alt="" width="34" height="34" />
          <span>Evidence Studio</span>
        </a>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="nav-cta" href="./index.html#founding">Founding offer</a>
        </div>
      </nav>
    </header>
  );
}

function LegalFooter() {
  return (
    <footer className="site-footer legal-footer">
      <div className="footer-inner shell">
        <a className="brand footer-brand" href="./index.html" aria-label="Evidence Studio home">
          <img src="./assets/icon.png" alt="" width="34" height="34" />
          <span>Evidence Studio</span>
        </a>
        <div className="footer-links">
          <a href={contactHref}>Contact</a>
          <a href="./privacy.html">Privacy</a>
          <a href="./terms.html">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function PrivacyPage() {
  return (
    <article className="legal-page shell" aria-labelledby="legal-title">
      <header className="legal-title-block">
        <p>Privacy</p>
        <h1 id="legal-title">Your audit evidence is not marketing data.</h1>
        <span>Last updated 19 July 2026</span>
      </header>

      <div className="legal-content">
        <section>
          <h2>The website</h2>
          <p>This website build contains no analytics scripts, advertising trackers, or marketing cookies.</p>
          <p>The guided specialist review keeps answers on the page until you prepare an email. The website does not transmit or store those answers. Your email provider handles the message after you choose to open your email app.</p>
        </section>

        <section>
          <h2>The planned Chrome extension</h2>
          <p>Evidence Studio is designed to keep project content in browser storage on the reviewer’s device. Project content includes imported results, notes, screenshots, redactions, retests, and report drafts.</p>
          <p>Reports and backups leave the browser only when the reviewer chooses to export them. Anyone who receives an exported file may be able to read its contents.</p>
        </section>

        <section>
          <h2>Licence activation</h2>
          <p>The commercial release may contact a licence service to check a key and activation status. That request will not include audit projects, screenshots, findings, report content, or tested page content.</p>
          <p>The final activation fields and retention period will be listed here before paid sales begin.</p>
        </section>

        <section>
          <h2>Browser storage and backups</h2>
          <p>Local storage is not a guaranteed backup. Browser cleanup, profile loss, device damage, or an extension removal can remove local data. Evidence Studio provides an explicit project backup so reviewers can store a recoverable copy somewhere they trust.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about this privacy notice can be sent through the <a href={contactHref}>Evidence Studio contact email</a>.</p>
        </section>
      </div>
    </article>
  );
}

function TermsPage() {
  return (
    <article className="legal-page shell" aria-labelledby="legal-title">
      <header className="legal-title-block">
        <p>Pre-launch terms</p>
        <h1 id="legal-title">Plain terms before a paid release.</h1>
        <span>Last updated 19 July 2026</span>
      </header>

      <div className="legal-content">
        <section>
          <h2>Current status</h2>
          <p>Evidence Studio is in specialist review. The website demo uses sample data and does not prove market demand, audit accuracy, or product availability.</p>
        </section>

        <section>
          <h2>Proposed founding licence</h2>
          <p>The proposed founding price is €99 one-time for one specialist user. It includes perpetual access to version 1, unlimited local projects and reports, and 12 months of product updates.</p>
          <p>The first offer is planned for 25 licences. No purchase is complete until a checkout clearly shows the final product, price, tax, licence scope, refund terms, and seller details.</p>
        </section>

        <section>
          <h2>Updates</h2>
          <p>A version 1 licence will keep working after the included update period. Future major versions or optional update plans may be priced separately. Existing buyers will see the terms before choosing any paid update.</p>
        </section>

        <section>
          <h2>Refunds before delivery</h2>
          <p>If a paid founding offer opens before the promised product is delivered, buyers can request a refund. The final checkout terms will state the process and any additional consumer rights that apply.</p>
        </section>

        <section>
          <h2>Professional responsibility</h2>
          <p>Evidence Studio organizes testing evidence and reports. It does not certify legal compliance, replace professional judgment, or provide legal advice. Reviewers remain responsible for their testing decisions and client deliverables.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about the planned licence can be sent through the <a href={contactHref}>Evidence Studio contact email</a>.</p>
        </section>
      </div>
    </article>
  );
}

function LegalApp({ page }: { page: LegalPage }) {
  return (
    <>
      <a className="skip-link" href="#legal-main">Skip to legal content</a>
      <LegalHeader />
      <main id="legal-main" tabIndex={-1}>{page === "privacy" ? <PrivacyPage /> : <TermsPage />}</main>
      <LegalFooter />
    </>
  );
}

const page = document.body.dataset.legal === "terms" ? "terms" : "privacy";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LegalApp page={page} />
  </StrictMode>,
);
