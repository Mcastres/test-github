---
name: fimo
description: >-
  How to write code in a Fimo project — the npm package surface. Load when
  writing JSX that renders schema content, defining schemas or forms (JSON),
  using `t()` for labels, plugging media into `fimo/ui` components,
  or applying the project's code conventions. CLI commands and workflows
  (push, deploy, sync, etc.) live in the `fimo-cli` skill.
fimoVersion: 0.3.5
---

# Fimo

You are writing code in a Fimo project — a content + media + forms + analytics platform for React websites with a CMS dashboard. This skill describes the **`fimo` npm package surface** as installed in this specific project: what's exported from `fimo`, `fimo/ui`, `fimo/vite`; the JSON shapes you write; the generated React Query hooks and Zod schemas you import; and the code conventions for using them.

This skill is version-locked to this project's installed `fimo` package — the shapes here match what your code can actually use.

For CLI commands and workflows (creating a project, pushing schemas/forms, deploying, managing labels, etc.), the **`fimo-cli`** skill is the source of truth. Run every CLI command as `npx fimo@latest <command>` (always the latest, no global install). If `fimo-cli` isn't loaded for your AI tool, register it with `npx fimo@latest skills install --mode=copy`.

## Critical: NEVER hardcode user-facing things

This is the load-bearing rule for every code change. **Fimo's whole point is that content editors edit content in the dashboard, not in code.** Anything hardcoded breaks that.

- **Content** (posts, products, pages, lists, anything structured) → declare a schema, render with the generated `useGet()` hook + `fimo/ui` components. **Never** write `const posts = [...]` in JSX.
- **Strings** (labels, CTAs, headings, descriptions, any visible text) → wrap in `t('key')` and create the default-locale value with `fimo labels set`. Use `--locale <locale>` only when intentionally writing a non-default locale. **Never** write `<h1>Welcome</h1>` directly — write `<Text value={t('home.title')} as="h1" />`.
- **Media** (images, videos, files) → use `<Image>` / `<Video>` from `fimo/ui` for schema media, `<StaticImage>` for hard-coded URLs. **Never** use `<img src={...}>`.
- **Forms** → use the generated Zod schema + `submitX` helper from `@/forms/<name>`. Never hand-roll fetch or validation.

If you find yourself about to hardcode anything user-facing, **stop and use the appropriate Fimo primitive instead.** For pushing the schema/form/asset to the backend, that's CLI territory — see the `fimo-cli` skill.

## When starting code work, load these references up front

These define the package surface for the load-bearing primitives. **Read all six before generating significant code:**

- `references/content.md` — schema JSON shape, field types, Tiptap nodes, generated React Query hooks
- `references/forms.md` — form JSON spec, generated Zod + `submitX` helper
- `references/assets.md` — `FimoMedia` shape, how to render assets
- `references/labels.md` — `t()` helper, `useLabels()`, wrap rules
- `references/locales.md` — locale routing helpers, `FimoLink`, custom-framework contract
- `references/ui.md` — `fimo/ui` components + JSX code conventions + app code rules

Workflow / CLI-side concerns (pushing schemas, generating images, managing labels, deploying) live in the **`fimo-cli`** skill's matching references.

## Decision Tree (specific tasks)

- **Setting up Fimo in a new project** — pick the framework:
  - React Router 7 framework mode → `references/setup-react-router.md`
  - Plain Vite + React (or upgrading a legacy v3 project) → `references/setup-plain-vite.md`
- Writing schema JSON / picking field types / Tiptap richtext → `references/content.md`
- Writing form JSON / generated form client / form code → `references/forms.md`
- Plugging media into a component / `FimoMedia` shape → `references/assets.md`
- ANY user-facing string in code → `references/labels.md`
- Locale-aware routes, links, or framework adapters → `references/locales.md`
- ANY JSX rendering schema content or `t()` output → `references/ui.md`
- Major visual / redesign / hero section / brand → `references/design.md`

## Anti-Patterns

- **Hardcoding content in JSX** — `<h1>My Blog</h1>` + an array of posts in code. Use schemas + entries + `t()`.
- **Raw HTML for schema content** — `<img src={post.coverImage.url}>` instead of `<Image value={post.coverImage}>`. The `fimo/ui` components carry metadata for inline editing in the admin.
- **Raw `<a href>` for internal navigation** — causes full page reloads. Use `<FimoLink>` for locale-aware internal links or React Router `<Link>` when intentionally bypassing locale helpers. Reserve `<a>` for external links.
- **Pulling stock photos from external URLs** — editors can't manage them. Use `fimo generate` (CLI).
- **Editing generated `.ts` files** under `src/schemas/` or `src/forms/` — regenerated on every build.
- **Writing raw HTML in `richtext` fields** — must be Tiptap JSONContent.
- **Calling `t()` with a dynamic first argument** — the key must be a string literal so the extractor finds it.
- **Decorating the disposable starter** — `src/pages/Index.tsx` is throwaway scaffolding. On first real generation, replace it entirely.
- **Skipping legal pages** — `Privacy.tsx` + `Terms.tsx` are required for public sites; the template ships them.
- **Showing Fimo branding** in the generated site unless the user explicitly asks for it.
