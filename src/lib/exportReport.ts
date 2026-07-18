import type { Finding, RetestOutcome } from "../data/demo";
import { outcomeLabels } from "../data/demo";

type SampleReportInput = {
  finding: Finding;
  selectedSources: string[];
  redacted: boolean;
  outcome: RetestOutcome;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const buildSampleReport = ({ finding, selectedSources, redacted, outcome }: SampleReportInput) => {
  const sources = finding.sources.filter((source) => selectedSources.includes(source.id));
  const evidenceRows = sources
    .map(
      (source) => `
        <li>
          <strong>${escapeHtml(source.label)}</strong>
          <span>${escapeHtml(source.detail)}</span>
        </li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(finding.id)} sample accessibility report</title>
    <style>
      :root{font-family:Arial,sans-serif;color:#18201b;background:#f5f6f0}body{margin:0}main{max-width:760px;margin:auto;padding:48px 24px 80px}header{border-bottom:4px solid #18201b;padding-bottom:28px;margin-bottom:48px}.sample{font-size:14px;font-weight:700;color:#52605a}h1{font-size:42px;line-height:1.05;margin:10px 0 14px}h2{margin-top:36px;font-size:22px}p,li{font-size:17px;line-height:1.6}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:24px}.meta div{border-left:3px solid #73a51d;padding-left:12px}.meta span,li span{display:block;color:#52605a;font-size:14px}.outcome{display:inline-block;border:2px solid #18201b;padding:8px 12px;font-weight:700}li{margin-bottom:14px}@media(max-width:560px){.meta{grid-template-columns:1fr}h1{font-size:32px}}@media print{body{background:#fff}main{padding-top:20px}}
    </style>
  </head>
  <body>
    <main>
      <header>
        <div class="sample">Interactive Evidence Studio sample</div>
        <h1>Accessibility review</h1>
        <p>Riverbank checkout</p>
        <div class="meta">
          <div><span>Finding</span>${escapeHtml(finding.id)}</div>
          <div><span>Page</span>${escapeHtml(finding.page)}</div>
          <div><span>Impact</span>${escapeHtml(finding.impact)}</div>
        </div>
      </header>
      <article>
        <h2>${escapeHtml(finding.title)}</h2>
        <p><strong>${escapeHtml(finding.criterion)}</strong></p>
        <p>${escapeHtml(finding.summary)}</p>
        <h2>Retest outcome</h2>
        <p class="outcome">${escapeHtml(outcomeLabels[outcome])}</p>
        <h2>Connected evidence</h2>
        <ul>${evidenceRows}</ul>
        <p>${redacted ? "The client copy uses redacted evidence. The original remains unchanged in the local project." : "This sample still uses the original evidence. Redact private content before client delivery."}</p>
        <h2>Recommended change</h2>
        <p>${escapeHtml(finding.recommendation)}</p>
      </article>
    </main>
  </body>
</html>`;
};

export const downloadSampleReport = (input: SampleReportInput) => {
  const blob = new Blob([buildSampleReport(input)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `evidence-studio-${input.finding.id.toLowerCase()}-sample.html`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
