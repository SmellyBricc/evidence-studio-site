# Evidence Studio website

Production marketing site and interactive premium product sample for Evidence Studio.

## What is real

- Responsive landing page with light and dark themes
- Interactive evidence workflow with three sample findings
- Live report preview and downloadable standalone HTML report
- Guided six-question specialist review with a live answer brief
- Structured email handoff that sends nothing without the reviewer’s choice
- Plain-language founding offer, privacy page, and pre-launch terms
- Local self-hosted fonts and optimized AVIF and WebP product media
- GitHub Pages deployment workflow

The sample data is clearly labelled. The site contains no invented customers, sales, reviews, or market claims.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Verify

```bash
npm run check
```

This runs strict TypeScript checks, interaction tests, export safety tests, and the production build.

## Commercial configuration

Copy `.env.example` to `.env.local` when needed.

```bash
VITE_REVIEW_EMAIL=kuba.opoczka@gmail.com
VITE_CHECKOUT_URL=
```

Leave `VITE_CHECKOUT_URL` empty during specialist review. The main commercial action opens the guided review page. A completed review can be copied or opened in the reviewer’s email app, but the website does not transmit or store the answers. Add the Lemon Squeezy checkout URL only after the paid validation gate passes.

## Deployment

The included GitHub Actions workflow verifies the project and publishes `dist` to GitHub Pages after every push to `main`.

In the repository settings, choose **GitHub Actions** as the Pages source.
