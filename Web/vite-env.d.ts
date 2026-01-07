/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_API_URL: string;
  readonly VITE_AI_PROVIDER: string;
  readonly VITE_AWS_DRY_RUN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
