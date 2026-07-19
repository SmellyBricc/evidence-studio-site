import { reviewEmail } from "./site";

export type ReviewOption = {
  value: string;
  label: string;
};

export type ReviewAnswers = {
  role: string;
  frequency: string;
  painPoints: string[];
  currentWorkflow: string;
  price: string;
  purchaseCondition: string;
};

export const roleOptions: ReviewOption[] = [
  { value: "independent", label: "Independent accessibility specialist" },
  { value: "agency", label: "Accessibility agency or consultancy" },
  { value: "in-house", label: "In-house accessibility or quality team" },
  { value: "developer", label: "Developer who delivers accessibility reviews" },
  { value: "other", label: "Another role" },
];

export const frequencyOptions: ReviewOption[] = [
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "A few times each month" },
  { value: "quarterly", label: "A few times each quarter" },
  { value: "less-often", label: "Less often" },
];

export const painOptions: ReviewOption[] = [
  { value: "duplicates", label: "Combining repeated issues" },
  { value: "context", label: "Keeping context beside evidence" },
  { value: "privacy", label: "Protecting client information" },
  { value: "retests", label: "Tracking fixes and retests" },
  { value: "reports", label: "Producing an accessible report" },
  { value: "no-slowdown", label: "Reporting does not seriously slow me down" },
];

export const priceOptions: ReviewOption[] = [
  { value: "49-69", label: "€49-69 one-time" },
  { value: "99", label: "€99 one-time" },
  { value: "149", label: "€149 one-time" },
  { value: "monthly", label: "€8-12 monthly, but only with ongoing services" },
  { value: "would-not-pay", label: "I would not pay for this" },
  { value: "not-sure", label: "I am not sure yet" },
];

export const emptyReviewAnswers = (): ReviewAnswers => ({
  role: "",
  frequency: "",
  painPoints: [],
  currentWorkflow: "",
  price: "",
  purchaseCondition: "",
});

const labelFor = (options: ReviewOption[], value: string) =>
  options.find((option) => option.value === value)?.label || "Not answered";

export function buildReviewBody(answers: ReviewAnswers) {
  const painLabels = answers.painPoints.map((value) => labelFor(painOptions, value));

  return [
    "Hi Kuba,",
    "",
    "Here is my Evidence Studio specialist review.",
    "",
    `My work: ${labelFor(roleOptions, answers.role)}`,
    `How often I deliver findings: ${labelFor(frequencyOptions, answers.frequency)}`,
    "",
    "Where reporting slows me down:",
    ...painLabels.map((label) => `- ${label}`),
    "",
    "What I use now:",
    answers.currentWorkflow.trim(),
    "",
    `A realistic price: ${labelFor(priceOptions, answers.price)}`,
    "",
    "What would make it worth buying:",
    answers.purchaseCondition.trim(),
    "",
    "I understand this is product validation, not a purchase or commitment.",
  ].join("\n");
}

export function buildReviewEmailHref(answers: ReviewAnswers) {
  const subject = encodeURIComponent("Evidence Studio specialist review");
  const body = encodeURIComponent(buildReviewBody(answers));
  return `mailto:${reviewEmail}?subject=${subject}&body=${body}`;
}
