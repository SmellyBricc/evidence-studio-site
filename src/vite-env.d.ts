/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REVIEW_EMAIL?: string;
  readonly VITE_CHECKOUT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
