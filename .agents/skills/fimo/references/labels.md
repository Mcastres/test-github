# Labels — package surface

> For the CLI workflow (`fimo validate`, `fimo labels set`, bulk updates), see **`fimo-cli/references/labels.md`**.
> For locale-aware routing and links (`fimoRoutes`, `FimoLink`, custom framework contract), see **`references/locales.md`**.

This file covers the **package surface**: the `t()` helper, the `useLabels()` hook, and the code-side rules for wrapping strings.

## The rule

Every piece of **user-facing static text** in the app (page titles, button labels, nav items, form placeholders, empty-state copy, alt text, meta tags) MUST be wrapped in `t('key')`.

Raw string literals in JSX are a bug — they won't show up in the Fimo admin as editable content and won't be translatable. **Hard-coded JSX text (`<h1>Welcome</h1>`) skips the entire i18n + inline-editing pipeline and becomes invisible to the editor.**

## Setup (already wired)

Labels are wired automatically by the `fimo/vite` build plugin. `useLabels()` reads DB-backed label values for the active locale — there's no provider to add or remove. The app entry is `src/root.tsx`, which wraps the app in `<FimoProviders>` from `fimo/react-router`. Pages and components call `useLabels()`.

`useTranslations()` is kept as a legacy alias for older projects. Use `useLabels()` in new code.

In development, the generated app reloads when DB label values change. In production, the build embeds the DB-backed label bundle.

## Locale behavior

The default label locale is `i18n.defaultLocale` in `fimo-config.json`, falling back to `en` when it is not set. `fimo validate`, the generated app runtime, and `fimo labels set` without `--locale` all use that default locale.

For non-default locales, create explicit DB values with `fimo labels set --locale <locale>` or `fimo labels set-many --locale <locale>`. Keep the code shape the same for every locale: `t('hero.title')` declares the key, and the DB decides which locale value is shown.

`fimo-config.json` owns the locale list:

```json
{
  "i18n": {
    "defaultLocale": "en",
    "locales": ["en"]
  }
}
```

- `locales` is the enabled locale list and must include `defaultLocale`. Do not add non-default locales unless the user asks for multiple languages, localized routes, translations, or a specific locale.
- If multiple locales are configured, create or update label values for every configured locale.
- Public locale routing is project/framework code. In React Router projects, prefer `fimoRoutes()` plus `FimoLink`; for custom frameworks, pass the active locale to `FimoProviders`. See `references/locales.md`.

## Usage

```tsx
import { useLabels, Text } from 'fimo/ui';

export function Hero() {
  const { t } = useLabels();
  return (
    <section>
      <h1>
        <Text value={t('hero.title')} />
      </h1>
      <p>
        <Text value={t('hero.subtitle')} />
      </p>
      <input placeholder={String(t('hero.emailPlaceholder'))} />
      <img alt={String(t('hero.imageAlt'))} src="..." />
    </section>
  );
}
```

- `t(key)` returns a `FimoString` (wrapped for source tracking). Render it via `<Text value={...} />` inside JSX.
- For HTML attributes (`placeholder`, `alt`, `title`, `aria-label`) cast with `String(t(...))` — the attribute can't accept a `FimoString` object directly.
- If a key is missing from the DB, it renders empty. Run `fimo validate` and add missing values with `fimo labels set`.

## Hard rules (enforced by the pre-build linter)

**The first argument to `t()` MUST be a string literal.** Dynamic keys break source tracking and fail the lint step.

```tsx
// ❌ BAD — variable key
t(item.key);

// ❌ BAD — template with expression
t(`nav.${page}`);

// ✅ GOOD — put the t() call where the literal lives
const items = [{ label: t('nav.home') }, { label: t('nav.about') }];
items.map((item) => <li>{item.label}</li>);
```

## Key naming

- Dot-namespaced, lowercase, kebab or camelCase leaves: `hero.title`, `nav.signIn`, `footer.copyright`, `errors.required`.
- Namespace by **page/section/component**, not by feature (`contact.form.submitLabel`, not `forms.contactSubmit`).
- Values live in the DB. Do not put user-visible fallback copy in code.

## What NOT to translate

- Dynamic content from entries or forms — that's already stored in the DB (content via schemas, submissions via forms).
- Content-type field values rendered via `fimo/ui` primitives (`<Text>`, `<RichText>`, …) — those carry their own admin-editing metadata.
- Purely decorative / non-text (icons, logos).
- Developer-only strings (`console.log`, error messages thrown for debugging).

## Rule of thumb

If a human reader sees the text AND the project owner might want to reword it in the admin, it goes through `t()`. When in doubt: wrap it.

After adding or changing `t()` calls, run `fimo validate`, then fill missing values with `fimo labels set` or `fimo labels set-many`. See `fimo-cli/references/labels.md`.
