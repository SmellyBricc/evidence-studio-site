import type { Finding } from "../data/demo";
import { buildSampleReport } from "./exportReport";

const finding: Finding = {
  id: "F-999",
  title: "Unsafe <script>alert(1)</script> title",
  criterion: "1.1.1 Non-text Content",
  page: "Example",
  impact: "High",
  summary: "A summary with <strong>untrusted markup</strong>.",
  recommendation: "Add a useful alternative.",
  sources: [{ id: "one", label: "Logo <img>", detail: "Header" }],
};

describe("buildSampleReport", () => {
  it("escapes report content and includes the chosen state", () => {
    const report = buildSampleReport({
      finding,
      selectedSources: ["one"],
      redacted: true,
      outcome: "fixed",
    });

    expect(report).toContain("Unsafe &lt;script&gt;alert(1)&lt;/script&gt; title");
    expect(report).toContain("Logo &lt;img&gt;");
    expect(report).toContain("Fixed");
    expect(report).not.toContain("<script>alert(1)</script>");
  });
});
