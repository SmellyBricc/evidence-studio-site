import { buildReviewBody, buildReviewEmailHref, ReviewAnswers } from "./review";

const completeReview: ReviewAnswers = {
  role: "independent",
  frequency: "weekly",
  painPoints: ["duplicates", "retests"],
  currentWorkflow: "I use a spreadsheet, screenshots, and a separate document.",
  price: "99",
  purchaseCondition: "The exported report must work well with a screen reader.",
};

describe("review email", () => {
  it("builds a plain-language summary from the selected answers", () => {
    const body = buildReviewBody(completeReview);

    expect(body).toContain("Independent accessibility specialist");
    expect(body).toContain("Combining repeated issues");
    expect(body).toContain("€99 one-time");
    expect(body).toContain("not a purchase or commitment");
  });

  it("encodes the completed review in a mailto link", () => {
    const href = buildReviewEmailHref(completeReview);

    expect(href).toMatch(/^mailto:/);
    expect(decodeURIComponent(href)).toContain("Evidence Studio specialist review");
    expect(decodeURIComponent(href)).toContain("What would make it worth buying");
  });
});
