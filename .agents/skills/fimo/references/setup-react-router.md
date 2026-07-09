# Setup Fimo on React Router 7

This recipe describes the canonical Fimo + React Router framework-mode setup.
It mirrors what `fimo init` scaffolds today; you can also apply it to an
existing RR project.

## Prerequisites

- Node 20+
- A Fimo project created via `fimo init` (gives you `projectId`,
  `organizationId`, and an `apiUrl`).

## Install

```
pnpm add fimo react react-dom react-router @tanstack/react-query
pnpm add -D @react-router/dev @react-router/node @tailwindcss/vite tailwindcss vite @types/node @types/react @types/react-dom typescript
```

## File: `package.json`

```json
{
  "name": "__PROJECT_SLUG__",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "react-router dev --port 5173",
    "build": "react-router build && fimo export-static",
    "preview": "vite preview --host 0.0.0.0 --port 4173",
    "typecheck": "tsc --noEmit"
  }
}
```

Validate runs automatically during `fimo deploy` and API-side sandbox builds.
For a purely local build, run `fimo validate` manually first when you need to
regenerate schemas/forms or check missing labels before `pnpm build`.

## File: `vite.config.ts`

```ts
import { reactRouter } from '@react-router/dev/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import { fimo } from 'fimo/vite';

export default defineConfig({
  plugins: [reactRouter(), fimo({ sitemap: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
    },
  },
});
```

Notes:

- **You** call `reactRouter()`. `fimo/vite` no longer auto-injects it — the
  user's vite.config owns the framework plugin. This is the library-mode shape.
- `fimo()` is synchronous; it returns a `PluginOption[]` you drop straight into
  `plugins`. Don't `await` it or spread it.
- Do **not** add `fimo({ seo: true })` here. RR handles SEO via the `meta`
  export (see `src/root.tsx`); the build-time SEO plugin would conflict.
- `sitemap` is opt-in and off by default; pass `fimo({ sitemap: true })` to emit
  `sitemap.xml` (the canonical template does this). Omitting the option leaves
  it off.
- `fimo({ robots: true })` opt-in to emit `robots.txt`.

## File: `react-router.config.ts`

```ts
import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src',
  ssr: false,
  // Static-site generation is opt-in. By default this template builds as an
  // SPA (single index.html shell, client-side routing). To prerender routes at
  // build time — required for crawler-visible per-route SEO — add this line:
  //
  //   import { getFimoPaths } from 'fimo/paths';
  //   prerender: async () => (await getFimoPaths()).map((p) => p.path),
  //
  // `getFimoPaths()` expands dynamic routes (e.g. `/blog/:slug`) by fetching
  // schema entries from the content API. See `references/setup-react-router.md`
  // in the fimo skill for the full setup pattern.
  buildDirectory: 'dist',
} satisfies Config;
```

**SSG is opt-in now.** Default = SPA (one HTML shell). Add `prerender`
yourself if you want crawler-visible per-route HTML. The previous
"prerender everything by default" behavior was a website-builder opinion
that doesn't fit infrastructure mode — your call which routes to prerender,
when to render them, and how.

## File: `src/root.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FimoProviders, FimoScripts, loadFimoMetaData, buildFimoMeta, fimoHtmlProps } from 'fimo/react-router';
import type { MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

export async function loader(args: { request: Request }) {
  return loadFimoMetaData(args);
}

export const meta: MetaFunction = (args) => buildFimoMeta(args);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html {...fimoHtmlProps()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <FimoScripts />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <FimoProviders>
        <Outlet />
      </FimoProviders>
    </QueryClientProvider>
  );
}
```

## File: `src/routes.ts`

```ts
import type { RouteConfig } from '@react-router/dev/routes';
import { index } from '@react-router/dev/routes';
import { fimoRoutes } from 'fimo/react-router/routes';

const routes = [index('./pages/Index.tsx', { id: 'home' })] satisfies RouteConfig;

export default fimoRoutes(routes) satisfies RouteConfig;
```

Page filenames are your choice; the scaffold uses PascalCase (e.g. `Index.tsx`,
`Privacy.tsx`).

`fimoRoutes()` is Fimo's React Router helper for path-prefix locales. It is a no-op for single-locale projects and expands concrete locale aliases when `fimo-config.json#i18n.locales` contains more locales. Custom routers can ignore this helper and pass their own locale to `<FimoProviders locale={locale}>`; see `references/locales.md`.

## File: `src/pages/Index.tsx`

```tsx
import { Text } from 'fimo/ui';

export default function HomePage() {
  return (
    <main>
      <Text path="home.hero.title">Welcome</Text>
    </main>
  );
}
```

## File: `fimo-config.json`

```json
{
  "version": "4",
  "seo": {
    "title": "__PROJECT_SLUG__",
    "siteName": "__PROJECT_SLUG__"
  },
  "routes": {
    "home": {
      "label": "Home",
      "path": "/"
    }
  }
}
```

## File: `.fimo.settings.json`

```json
{
  "projectId": "__PROJECT_ID__",
  "organizationId": "__ORG_ID__",
  "apiUrl": "__API_URL__"
}
```

Replace the `__PROJECT_ID__` / `__ORG_ID__` / `__API_URL__` sentinels with the
values from `fimo init`'s output (or `fimo projects info`).

## File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": ["@react-router/node", "vite/client"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "*.config.ts"]
}
```

## File: `index.css`

```css
@import 'tailwindcss';
```

(Optional — only if using Tailwind. Tailwind is not required for Fimo to
function; it just ships with the canonical template.)

## Verify and iterate

Run the app with the project's package-manager `dev` script (`pnpm dev` /
`npm run dev` / `yarn dev` / `bun dev` — match the lockfile). It serves the site
on localhost with live reload — this is your iteration loop: edit, see the change,
repeat with the developer.

`fimo deploy` is on-demand, not part of this loop: run it only when the developer
wants a hosted preview, a shareable link, or to go live — and only on their signal.
The dashboard's preview iframe shows the **deployed** app, so it only reflects
changes after a `fimo deploy` (the local dev server is localhost-only).

## What you don't add

- **No `fimo({ seo: true })`** — React Router's `meta` export covers SEO via
  `loadFimoMetaData` + `buildFimoMeta`. The build-time SEO plugin is for
  framework-less plain-Vite setups (`setup-vite-plain.md`).
- **No `<FimoSeo />` component** — not part of the RR setup.
- **No manual `<script src="overlay-runtime.js">`** — `<FimoScripts />`
  handles preview-script + overlay loading.

## What to do next

- Add more routes: extend `src/routes.ts`, create matching `src/pages/*.tsx`,
  add route entries in `fimo-config.json#routes`.
- Add a sitemap: pass `fimo({ sitemap: true })` (opt-in, off by default; the
  canonical template enables it). To customize the base URL, set
  `fimo-config.json#seo.url`.
- Override SEO per route: see `references/seo-overrides.md`.
- Look up an export: see `references/api.md`.
