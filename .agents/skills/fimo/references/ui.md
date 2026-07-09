# UI: components, JSX conventions, code rules

Everything about writing React code in a Fimo project: the `fimo/ui` component set, app code conventions (routing, components, loading states), and the JSX-side anti-patterns.

Load this for **any JSX work** that renders schema content, `t()` output, or media — and any time you're creating components, pages, or routes.

## `fimo/ui` components

Use these to render content-type field values consistently. They carry source metadata for inline editing in the Fimo admin — **always prefer them over raw HTML** when the value comes from a schema or `t()`.

| Component       | Use for                                                             | Example                                                       |
| --------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| `<Text>`        | Schema text fields + `t()` output                                   | `<Text value={post.title} as="h1" />`                         |
| `<RichText>`    | Schema `richtext` fields (Tiptap JSONContent)                       | `<RichText value={post.body} className="prose" />`            |
| `<Image>`       | Schema `media` image fields                                         | `<Image value={post.coverImage} width={1200} height={630} />` |
| `<StaticImage>` | Non-schema images (hard-coded decorative imagery, hero backgrounds) | `<StaticImage src="/hero.jpg" alt="..." width={1200} />`      |
| `<Video>`       | Schema `media` video fields                                         | `<Video value={post.heroVideo} />`                            |
| `<Date>`        | Schema date fields                                                  | `<Date value={post.publishDate} />`                           |
| `<Boolean>`     | Schema boolean fields                                               | `<Boolean value={product.inStock} />`                         |
| `` fimo`...` `` | Compose tracked values (mix `t()` + schema text)                    | ``<Text value={fimo`${t('by')} ${post.author}`} />``          |
| `useLabels()`   | `t('key')` hook                                                     | see `references/labels.md`                                    |
| `useLocale()`   | Active locale and route locale metadata                             | see `references/locales.md`                                   |

### Rules of thumb

1. **Schema text → `<Text>`**, never `<h1>{post.title}</h1>`.
2. **Schema media → `<Image>` / `<Video>`**, never `<img src={post.coverImage.url} />`. Provide `width` / `height` when known so Fimo can optimize and reserve layout space.
3. **Non-schema images** (decorative, hard-coded URLs, generated assets referenced directly) → `<StaticImage>`. Never hand-construct a `FimoMedia` to feed `<Image>`.
4. **Label text → `<Text value={t('key')} />`**, not `<h1>{t(...)}</h1>`. Label values live in the DB for `i18n.defaultLocale` from `fimo-config.json` unless a non-default locale is explicitly targeted. See `references/labels.md`.
5. **Mixed schema + translated text** → the `` fimo`...` `` template literal inside `<Text>`.
6. **Never hand-roll richtext rendering** — always `<RichText>`. To restyle a node, pass `components={{ heading: ..., link: ..., ... }}`.

## App code conventions

The template uses **Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui + react-router**. Keep generated code consistent.

### Component structure

- Components small and focused (< 50 lines where possible). Place page-specific components under `src/components/[pageName]/`; shared ones under `src/components/shared/`.
- Use shadcn/ui primitives from `src/components/ui/` rather than rolling your own.
- Split files when they grow past ~300 lines.

### Routing

- This template uses React Router v7 framework mode (file-based route config in `src/routes.ts`). Use `<FimoLink>` from `fimo/react-router` for locale-aware internal links, especially in projects with more than one configured locale. Use React Router `<Link>` / `<NavLink>` only when you intentionally do not want Fimo's locale behavior. Never raw `<a href="/...">` for internal navigation because it causes full page reloads.
- Reserve `<a>` for external links, with `target="_blank" rel="noreferrer"`.

### Loading states

- Skeletons > spinners > text placeholders. Never render the literal string "Loading…".
- Render a skeleton approximating the final layout (title bar, text lines, media aspect box).
- For images, reserve the aspect ratio with a skeleton — never a placeholder image. Layout must not jump.

### Tailwind v4

- Use utility classes with `cn()` from `@/lib/utils` for conditional classes.
- Prefer flexbox for 1D layouts and grid for 2D layouts; avoid floats and absolute positioning.
- Theme via shadcn CSS variables in `src/index.css` (`--background`, `--foreground`, `--primary`, `--accent`, `--ring`, etc.). Use semantic Tailwind classes (`bg-background`, `text-foreground`, `bg-primary`) instead of raw colors so light/dark stays coherent.
- Tailwind v4 syntax (e.g., `size-*`, container queries) — don't assume v3 conventions.

### Starter replacement

- `src/pages/Index.tsx` is disposable scaffold so a fresh `fimo init` project renders immediately.
- **On the first real website generation, replace that starter page's copy, layout, and visual system entirely** instead of decorating the existing Fimo-branded design.
- Reuse only the app shell, route contracts, and legal pages unless the user explicitly wants the starter aesthetic.

### Legal pages

- `src/pages/Privacy.tsx` and `src/pages/Terms.tsx` ship with the template but are not yet wired in `src/routes.ts` — add `route('privacy', './pages/Privacy.tsx')` and `route('terms', './pages/Terms.tsx')` when building a public site. They are required for public sites.
- Adapt their styling to match the project's visual language and translate their copy via `t()`.
- Use `privacy@fimo.ai` as the default legal contact email unless the user provides one.

### Branding

- **No Fimo branding** in the generated user-facing site unless the user explicitly asks for it.

## Anti-patterns (JSX-side)

- Raw `<a href>` for internal nav → use `<FimoLink>` for locale-aware paths or React Router `<Link>` / `<NavLink>` only when intentionally bypassing Fimo locale helpers.
- Raw `<img>` for schema media → use `<Image>` (with width/height).
- Hardcoded strings in JSX → wrap in `t('key')` and add the DB value with `fimo labels set`.
- Calling `t()` with a dynamic first argument → key must be a string literal.
- Editing generated `.ts` files under `src/schemas/` or `src/forms/` → regenerated on every build.
- Writing raw HTML into a `richtext` field → must be Tiptap JSONContent.
- Hand-constructing a `FimoMedia` object to pass into `<Image>` → use `<StaticImage>` for non-schema images.
- Decorating `src/pages/Index.tsx` → replace it on first real generation.
- "Loading…" text placeholder → render a skeleton matching the final layout.
