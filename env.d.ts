/* eslint-disable */
import 'vue-router';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract';
    VUE_ROUTER_BASE: string;
  }
}

// --- ДОДАЄМО НАШІ ЗМІННІ СЮДИ ---
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  // додавай сюди інші змінні за потреби...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    onlyGuests?: boolean;
    roles?: string[];
    title?: string;
  }
}