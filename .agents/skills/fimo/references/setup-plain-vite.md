# Setup Fimo on plain Vite + React

Use this recipe for a Vite + React SPA without React Router framework mode.
This is also the upgrade path for legacy Fimo v3 projects — v3 was plain Vite,
so this layout is what those projects look like now.

## When to use this vs. React Router

- **Plain Vite (this recipe):** simplest setup; client-side routing via a
  React Router library router (`BrowserRouter`, no framework-mode SSR/SSG);
  SEO via build-time HTML rewrite. Per-route SEO that crawlers see requires
  prerendering (SSG); without it, the SPA serves one `index.html` for every
  URL and crawlers see only the home SEO.
- **React Router (`setup-react-router.md`):** framework-mode SSR + per-route
  SEO via `meta` export; recommended when you want real per-route crawler SEO.

## Prerequisites

- Node 20+
- A Fimo project created via `fimo init`.

## Install

```
pnpm add fimo react react-dom react-router @tanstack/react-query
pnpm add -D vite @vitejs/plugin-react @types/react @types/react-dom typescript
```

## File: `package.json`

```json
{
  "name": "__PROJECT_SLUG__",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "vite build",
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
import { defineConfig } from 'vite';

import { fimo } from 'fimo/vite';

export default defineConfig(() => ({
  plugins: fimo({ seo: true }),
}));
```

Notes:

- `fimo({ seo: true })` opts in to the build-time SEO plugin
  (`transformIndexHtml`-based). This is the right tool for plain Vite — there's
  no framework `meta` export to plug into.
- Add `fimo({ seo: true, sitemap: true, robots: true })` to also emit
  `sitemap.xml` and `robots.txt` at build.

## File: `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>__PROJECT_SLUG__</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

The `seo` plugin rewrites `<title>`, og, twitter, canonical tags from
`fimo-config.json#seo` at build time. You can leave a placeholder title in
`index.html`; it'll be replaced.

## File: `src/main.tsx`

`FimoProviders` (and the runtime primitives it wraps) require **two** contexts:
a React Router `<Router>` ancestor (it reads `useLocation`/`useNavigate`) and a
`@tanstack/react-query` `<QueryClientProvider>` (its internal
`RefreshContentProvider` calls `useQueryClient`). Mount both around
`<FimoProviders>`:

```tsx
import { FimoProviders } from 'fimo/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FimoProviders>
          <App />
        </FimoProviders>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

`react-router` and `@tanstack/react-query` are peer dependencies of `fimo`;
both are in the install command above. `FimoProviders` is exported only from
the `fimo/react-router` adapter barrel — there is no router-free (or
react-query-free) provider surface in the package today.

## File: `src/App.tsx`

```tsx
import { Text } from 'fimo/ui';

export function App() {
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
  "version": "3",
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

Note: `"version": "3"` marks the legacy plain-Vite (no-RR-framework-mode)
shape. `fimo()` is version-agnostic — it composes a fixed set of build-time
plugins from the `seo`/`sitemap`/`robots` options you pass and never reads
this version field. It also never injects the React Router plugin: in a
framework-mode project that `reactRouter()` plugin is added by your own
`vite.config.ts`, not by `fimo/vite`.

## File: `.fimo.settings.json`

```json
{
  "projectId": "__PROJECT_ID__",
  "organizationId": "__ORG_ID__",
  "apiUrl": "__API_URL__"
}
```

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
    "types": ["vite/client"]
  },
  "include": ["src", "*.config.ts"]
}
```

## Verify and iterate

Run the app with the project's package-manager `dev` script (`pnpm dev` /
`npm run dev` / `yarn dev` / `bun dev` — match the lockfile). It serves the site
on localhost with live reload — this is your iteration loop: edit, see the change,
repeat with the developer. `fimo deploy` is on-demand (hosted preview / shareable
link / go live), run only on the developer's signal; the dashboard's preview iframe
shows the **deployed** app, not the localhost dev server.

## Known limitations vs. React Router

- **Per-route SEO that crawlers see** requires either (a) using React Router
  framework mode with prerender, (b) a Vite SSG plugin like `vite-plugin-ssg`,
  or (c) accepting that the crawler sees the home SEO for every URL.
- **Dashboard "live edit SEO" preview** requires a reload on plain Vite —
  there's no React-side head-mutation component yet. The static `seo` plugin
  bakes SEO at build time.
- **Routing**: `FimoProviders` requires a React Router context, so this recipe
  wires `BrowserRouter` from `react-router`. You can swap it for another
  React Router setup (e.g. a `createBrowserRouter` data router with
  `<RouterProvider>`), but a `<Router>` ancestor is mandatory — the runtime's
  preview bridge and pageview tracker call `useLocation`/`useNavigate`.

## What to do next

- Add a sitemap: pass `fimo({ seo: true, sitemap: true })` and set
  `fimo-config.json#seo.url` to your production base URL.
- Look up exports: see `references/ui.md`.
- Use schema content: see `references/content.md`.
