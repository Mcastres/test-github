# Locales: Routing And Navigation

Fimo provides locale utilities that follow the Fimo standard, but they are helpers, not a mandatory app architecture. A project may use a custom Next, Astro, domain, middleware, or hand-rolled routing strategy as long as it passes the active locale into Fimo and keeps Fimo route metadata canonical.

## Configuration

`fimo-config.json` owns the locale list and routing strategy. Keep one locale unless the user asks for multilingual or localized output.

```jsonc
{
  "i18n": {
    "defaultLocale": "en",
    "locales": ["en"],
    "routing": {
      "strategy": "path-prefix", // only supported strategy: /es/about for Spanish; default locale can stay /about
      "prefixDefaultLocale": false, // when false, omit /en for the default locale
    },
  },
}
```

- `defaultLocale` is the source/default locale.
- `locales` lists enabled locales and must include `defaultLocale`. Do not add non-default locales unless the user asks for multiple languages, localized routes, translations, or a specific locale.
- `routing.strategy` currently supports `path-prefix`.
- If multiple locales are configured, create or update labels and content for every configured locale.

Locale tags should be structurally valid, for example `en`, `es`, `pt-BR`, or `zh-Hans`.

## Canonical Routes

Keep `fimo-config.json#routes` canonical and unlocalized:

```json
{
  "routes": {
    "pricing": {
      "label": "Pricing",
      "path": "/pricing"
    }
  }
}
```

Do not add separate route metadata for `/es/pricing`. Locale prefixes such as `/es` are reserved when `path-prefix` is enabled, and `fimo validate` reports collisions.

## React Router Standard Helper

For React Router framework mode, write one canonical route list and wrap it:

```ts
import type { RouteConfig } from '@react-router/dev/routes';
import { index, route } from '@react-router/dev/routes';
import { fimoRoutes } from 'fimo/react-router/routes';

const routes = [
  index('./pages/Index.tsx', { id: 'home' }),
  route('pricing', './pages/Pricing.tsx', { id: 'pricing' }),
  route('blog/:slug', './pages/BlogPost.tsx', { id: 'blog-post' }),
] satisfies RouteConfig;

export default fimoRoutes(routes) satisfies RouteConfig;
```

`fimoRoutes()` expands concrete locale-prefixed aliases from the configured locale list while reusing the same page modules. For `locales: ["en", "es"]` and `prefixDefaultLocale: false`, it adds routes like `/es`, `/es/pricing`, and `/es/blog/:slug`.

This helper exists so the Fimo UI route selector, preview navigation, labels, and content queries all agree on the same URL shape. It is not required if the project deliberately implements a custom routing strategy.

Copyable examples live in `assets/react-router-locales/routes.ts` and `assets/react-router-locales/navigation.tsx`.

## Links

Use `FimoLink` for internal links that should preserve or switch locale:

```tsx
import { FimoLink } from 'fimo/react-router';

<FimoLink to="/pricing">Pricing</FimoLink>
<FimoLink to="/pricing" locale="es">Spanish pricing</FimoLink>
```

`FimoLink` localizes absolute internal paths according to `fimo-config.json#i18n.routing`. It leaves relative, hash, query-only, and external URLs alone. Use React Router's raw `Link` only when you intentionally want to bypass Fimo's locale behavior.

Read the active locale with `useLocale()` when component logic needs it:

```tsx
import { useLocale } from 'fimo/ui';

const { locale, defaultLocale, locales, routePath, dir } = useLocale();
```

`locales` lists every configured locale, so a language switcher needs no API call and no extra component:

```tsx
const { locale, locales, routePath } = useLocale();

locales.map((code) => (
  <FimoLink key={code} to={routePath} locale={code} aria-current={code === locale ? 'true' : undefined}>
    {new Intl.DisplayNames([code], { type: 'language' }).of(code)}
  </FimoLink>
));
```

## Custom Frameworks

For Next, Astro, plain Vite, or custom routers, the same contract applies:

- The framework owns URL matching.
- The app resolves the active locale from the request, path, domain, middleware, cookie, or user preference.
- The app passes that locale to Fimo:

```tsx
<FimoProviders locale={locale}>{children}</FimoProviders>
```

When using custom routing, also provide localized internal-link helpers in that framework's style. Fimo's DB labels and localized content will follow the locale passed to `FimoProviders`.

## What Not To Do

- Do not create `src/pages/__localized/*` copies just for locales.
- Do not duplicate every route in `fimo-config.json` per locale.
- Do not use `/es` as a normal canonical route when `es` is an enabled locale.
