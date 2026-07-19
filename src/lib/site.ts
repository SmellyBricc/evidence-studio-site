export const reviewEmail = import.meta.env.VITE_REVIEW_EMAIL || "kuba.opoczka@gmail.com";

const reviewSubject = encodeURIComponent("Evidence Studio specialist review");
const reviewBody = encodeURIComponent(
  "Hi Kuba,\n\nI audit accessibility and would like to review Evidence Studio.\n\nMy typical audit workflow is:\n\nThe reporting problem I most want solved is:\n",
);

export const contactHref = `mailto:${reviewEmail}?subject=${reviewSubject}&body=${reviewBody}`;

export const specialistReviewHref = "./review.html";

export const checkoutHref = import.meta.env.VITE_CHECKOUT_URL || specialistReviewHref;

export const checkoutIsLive = Boolean(import.meta.env.VITE_CHECKOUT_URL);
