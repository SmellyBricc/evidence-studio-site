export type Finding = {
  id: string;
  title: string;
  criterion: string;
  page: string;
  impact: "High" | "Medium";
  summary: string;
  recommendation: string;
  sources: Array<{
    id: string;
    label: string;
    detail: string;
  }>;
};

export const findings: Finding[] = [
  {
    id: "F-014",
    title: "Payment dialog does not move focus",
    criterion: "2.4.3 Focus Order",
    page: "Checkout",
    impact: "High",
    summary:
      "Keyboard focus remains behind the payment dialog, so users can interact with hidden page controls.",
    recommendation:
      "Move focus to the dialog heading when it opens, keep focus inside it, then return focus to the trigger when it closes.",
    sources: [
      { id: "checkout-dialog", label: "Checkout dialog", detail: "Desktop at 125% zoom" },
      { id: "saved-card-dialog", label: "Saved card dialog", detail: "Keyboard-only retest" },
      { id: "retry-dialog", label: "Payment retry dialog", detail: "Error state" },
    ],
  },
  {
    id: "F-021",
    title: "Card errors are not announced",
    criterion: "4.1.3 Status Messages",
    page: "Payment",
    impact: "High",
    summary:
      "The card error appears visually, but assistive technology receives no status update.",
    recommendation:
      "Expose the error through a persistent text message and an appropriate live region without moving focus.",
    sources: [
      { id: "empty-card", label: "Empty card number", detail: "Required-field error" },
      { id: "declined-card", label: "Declined card", detail: "Processor response" },
      { id: "expired-card", label: "Expired card", detail: "Inline validation" },
    ],
  },
  {
    id: "F-027",
    title: "Address fields lose visible labels",
    criterion: "3.3.2 Labels or Instructions",
    page: "Delivery address",
    impact: "Medium",
    summary:
      "Placeholder text disappears after entry, leaving several address fields without a visible label.",
    recommendation:
      "Keep a visible text label for every field before, during, and after entry.",
    sources: [
      { id: "address-line", label: "Address line", detail: "Completed form" },
      { id: "postal-code", label: "Postal code", detail: "Validation state" },
      { id: "country-select", label: "Country selector", detail: "Expanded state" },
    ],
  },
];

export type RetestOutcome = "not-recorded" | "fixed" | "partly-fixed" | "still-present";

export const outcomeLabels: Record<RetestOutcome, string> = {
  "not-recorded": "Not recorded",
  fixed: "Fixed",
  "partly-fixed": "Partly fixed",
  "still-present": "Still present",
};
