import { useMemo, useState } from "react";
import { findings, outcomeLabels, type RetestOutcome } from "../data/demo";
import { downloadSampleReport } from "../lib/exportReport";

const initialFinding = findings[0];

export function PremiumDemo() {
  const [findingId, setFindingId] = useState(initialFinding.id);
  const [selectedSources, setSelectedSources] = useState<string[]>([initialFinding.sources[0].id]);
  const [redacted, setRedacted] = useState(false);
  const [outcome, setOutcome] = useState<RetestOutcome>("not-recorded");
  const [prepared, setPrepared] = useState(false);
  const [message, setMessage] = useState("The report preview updates as you work.");
  const [error, setError] = useState("");

  const finding = useMemo(
    () => findings.find((item) => item.id === findingId) ?? initialFinding,
    [findingId],
  );

  const completedItems = Number(selectedSources.length > 0) + Number(redacted) + Number(outcome !== "not-recorded");

  const markDraftChanged = (nextMessage: string) => {
    setPrepared(false);
    setError("");
    setMessage(nextMessage);
  };

  const selectFinding = (nextId: string) => {
    const nextFinding = findings.find((item) => item.id === nextId) ?? initialFinding;
    setFindingId(nextFinding.id);
    setSelectedSources([nextFinding.sources[0].id]);
    setRedacted(false);
    setOutcome("not-recorded");
    markDraftChanged(`${nextFinding.id} loaded. Its first source result is connected.`);
  };

  const toggleSource = (sourceId: string) => {
    const isSelected = selectedSources.includes(sourceId);
    const nextSources = isSelected
      ? selectedSources.filter((id) => id !== sourceId)
      : [...selectedSources, sourceId];
    setSelectedSources(nextSources);
    markDraftChanged(
      nextSources.length === 1
        ? "1 source result is connected."
        : `${nextSources.length} source results are connected.`,
    );
  };

  const setProtection = (nextValue: boolean) => {
    setRedacted(nextValue);
    markDraftChanged(
      nextValue
        ? "Private details are covered in the client copy. The original stays unchanged."
        : "The report is using the original image. Protect private details before delivery.",
    );
  };

  const setRetest = (nextOutcome: RetestOutcome) => {
    setOutcome(nextOutcome);
    markDraftChanged(`Retest outcome changed to ${outcomeLabels[nextOutcome].toLowerCase()}.`);
  };

  const loadCompletedExample = () => {
    setSelectedSources(finding.sources.map((source) => source.id));
    setRedacted(true);
    setOutcome("fixed");
    setPrepared(true);
    setError("");
    setMessage("Completed example loaded. The sample report is ready to export.");
  };

  const reset = () => {
    setFindingId(initialFinding.id);
    setSelectedSources([initialFinding.sources[0].id]);
    setRedacted(false);
    setOutcome("not-recorded");
    setPrepared(false);
    setError("");
    setMessage("Sample reset. The report preview updates as you work.");
  };

  const prepareReport = () => {
    const missing: string[] = [];
    if (selectedSources.length === 0) missing.push("connect at least one result");
    if (!redacted) missing.push("protect the client copy");
    if (outcome === "not-recorded") missing.push("record the retest");

    if (missing.length > 0) {
      const nextError = `Before export, ${missing.join(", ")}.`;
      setError(nextError);
      setMessage(nextError);
      return;
    }

    setPrepared(true);
    setError("");
    setMessage("Sample report prepared. You can now download the standalone HTML file.");
  };

  const exportReport = () => {
    downloadSampleReport({ finding, selectedSources, redacted, outcome });
    setMessage("Sample report downloaded. It opens in any modern browser.");
  };

  return (
    <div className="product-demo" aria-describedby="demo-instructions">
      <div className="demo-topbar">
        <div>
          <strong>Riverbank checkout review</strong>
          <span>Interactive sample project</span>
        </div>
        <div className="demo-topbar-actions">
          <button type="button" className="text-button" onClick={loadCompletedExample}>
            Load completed example
          </button>
          <button type="button" className="text-button" onClick={reset}>
            Reset sample
          </button>
        </div>
      </div>

      <p id="demo-instructions" className="visually-hidden">
        Choose a finding, connect source results, protect the screenshot, and record a retest. The report preview updates after each choice.
      </p>

      <div className="demo-workspace">
        <aside className="demo-findings" aria-label="Example findings">
          <div className="demo-pane-heading">
            <span>Findings</span>
            <span>{findings.length} examples</span>
          </div>
          <fieldset>
            <legend className="visually-hidden">Choose an example finding</legend>
            {findings.map((item) => (
              <label className="finding-choice" key={item.id} data-selected={item.id === findingId}>
                <input
                  type="radio"
                  name="finding"
                  value={item.id}
                  checked={item.id === findingId}
                  onChange={() => selectFinding(item.id)}
                />
                <span className="finding-code">{item.id}</span>
                <strong>{item.title}</strong>
                <span>{item.criterion}</span>
              </label>
            ))}
          </fieldset>
        </aside>

        <div className="demo-controls">
          <div className="demo-pane-heading">
            <span>Build the evidence chain</span>
            <span>{completedItems} of 3 ready</span>
          </div>

          <section className="control-group" aria-labelledby="connect-title">
            <div className="control-title-row">
              <div>
                <h3 id="connect-title">Connect source results</h3>
                <p>Keep every occurrence without making the client read the same issue three times.</p>
              </div>
              <span className="control-state">{selectedSources.length} connected</span>
            </div>
            <fieldset className="source-options">
              <legend className="visually-hidden">Source results for {finding.id}</legend>
              {finding.sources.map((source) => (
                <label key={source.id}>
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.id)}
                    onChange={() => toggleSource(source.id)}
                  />
                  <span>
                    <strong>{source.label}</strong>
                    <small>{source.detail}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          </section>

          <section className="control-group" aria-labelledby="protect-title">
            <div className="control-title-row">
              <div>
                <h3 id="protect-title">Protect the client copy</h3>
                <p>Cover private details for reporting. The captured original stays unchanged.</p>
              </div>
              <label className="switch-control">
                <input
                  type="checkbox"
                  role="switch"
                  aria-label="Protect the client copy"
                  checked={redacted}
                  onChange={(event) => setProtection(event.target.checked)}
                />
                <span>{redacted ? "Protected" : "Original"}</span>
              </label>
            </div>
            <figure className="evidence-sample">
              <img
                src={redacted ? "./assets/evidence-redacted.webp" : "./assets/evidence-original.webp"}
                alt={
                  redacted
                    ? "Checkout evidence with email and payment details covered by solid redaction blocks"
                    : "Original checkout evidence with test data and recorded browser conditions"
                }
                width={redacted ? 1180 : 1164}
                height={redacted ? 740 : 639}
              />
              <figcaption>
                {redacted
                  ? "Client copy protected. The local original remains available to the auditor."
                  : "Original selected. Protect the client copy before report delivery."}
              </figcaption>
            </figure>
          </section>

          <section className="control-group" aria-labelledby="retest-title">
            <div className="control-title-row">
              <div>
                <h3 id="retest-title">Record the retest</h3>
                <p>Keep the decision beside the finding and the proof used to reach it.</p>
              </div>
              <span className="control-state">{outcomeLabels[outcome]}</span>
            </div>
            <fieldset className="outcome-options">
              <legend className="visually-hidden">Choose the retest outcome</legend>
              {(["fixed", "partly-fixed", "still-present"] as RetestOutcome[]).map((value) => (
                <label key={value} data-selected={outcome === value}>
                  <input
                    type="radio"
                    name="outcome"
                    value={value}
                    checked={outcome === value}
                    onChange={() => setRetest(value)}
                  />
                  <span>{outcomeLabels[value]}</span>
                </label>
              ))}
            </fieldset>
          </section>
        </div>

        <aside className="report-preview" aria-label="Live sample report preview">
          <div className="report-paper">
            <header>
              <span>Evidence Studio sample</span>
              <strong>Accessibility review</strong>
              <p>Riverbank checkout</p>
            </header>

            <div className="report-meta">
              <div><span>Finding</span><strong>{finding.id}</strong></div>
              <div><span>Impact</span><strong>{finding.impact}</strong></div>
            </div>

            <article>
              <p className="report-criterion">{finding.criterion}</p>
              <h3>{finding.title}</h3>
              <p>{finding.summary}</p>

              <div className="report-evidence-row">
                <span>Connected evidence</span>
                <strong>{selectedSources.length}</strong>
              </div>
              <div className="report-evidence-row">
                <span>Client copy</span>
                <strong>{redacted ? "Protected" : "Original"}</strong>
              </div>

              <div className="report-outcome">
                <span>Retest outcome</span>
                <strong>{outcomeLabels[outcome]}</strong>
              </div>
            </article>
          </div>

          <div className="report-actions">
            {error ? <p className="demo-error" role="alert">{error}</p> : null}
            <button type="button" className="button button-primary button-wide" onClick={prepareReport}>
              Prepare sample report
            </button>
            {prepared ? (
              <button type="button" className="button button-secondary button-wide" onClick={exportReport}>
                Download HTML report
              </button>
            ) : null}
          </div>
        </aside>
      </div>

      <div className="demo-announcement" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </div>
  );
}
