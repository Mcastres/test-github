# Content (schemas + entries) — package surface

> For the CLI workflow (`fimo schemas push`, `fimo entries create`, the "Add a blog" recipe), see **`fimo-cli/references/content.md`**.

This file covers the **package surface**: the JSON shape you write, the generated React Query hooks you import, the data types your code receives. All of this is version-locked to this project's installed `fimo` package.

## Schema JSON shape

```json
{
  "uid": "BlogPost",
  "name": "Blog Posts",
  "fields": {
    "title": { "type": "string" },
    "body": { "type": "richtext" },
    "publishDate": { "type": "string" },
    "featured": { "type": "boolean" },
    "coverImage": { "type": "media" },
    "metadata": { "type": "json" }
  }
}
```

**Required**: `uid` (PascalCase, matches filename), `name`, `fields`.

### Reserved field names — do NOT declare these in `fields`

Every entry already carries this metadata automatically. Declaring any of them as a
schema field is rejected by `fimo schemas push` with a 400 (e.g. `fields.slug: "slug" is
reserved entry metadata and cannot be used as a content field.`):

`id`, `documentId`, `slug`, `locale`, `createdAt`, `updatedAt`, `__fimo`.

In particular **do not add a `slug` field** — every entry gets a `slug` for free. You still
pass `slug` inside `data` when *creating an entry* (see "Entry body shape" below); it just
must not appear in the schema's `fields`. If you need an additional URL-ish string, name it
something else (e.g. `handle`, `permalink`).

## Field types

| Type       | `data` JSON shape                                                       | Use for                           |
| ---------- | ----------------------------------------------------------------------- | --------------------------------- |
| `string`   | `"..."`                                                                 | Titles, short text                |
| `richtext` | Tiptap JSONContent (see below)                                          | Blog body, descriptions, articles |
| `number`   | `42`                                                                    | Counts, quantities                |
| `boolean`  | `true` / `false`                                                        | Flags                             |
| `date`     | ISO date string, e.g. `"2026-06-03"`                                    | Publish dates, timestamps         |
| `media`    | `{ "source": "local"\|"external", "url": "https://...", "alt": "..." }` | Images, video                     |
| `json`     | any JSON                                                                | Structured metadata               |

A `date` field currently generates as `any` in the TS client, so for typed access (and the `<Date>` component) prefer a `string` field holding an ISO date — which is what the `publishDate` examples below do.

**Default to `richtext`** for fields named `body`, `content`, `description`, `summary`, `bio`, `intro`, `details`, `excerpt` — only use `string` when the field is explicitly short (e.g. a 160-char meta description).

## Tiptap JSONContent (richtext)

Richtext values MUST be Tiptap JSONContent — never raw HTML strings:

```json
{
  "type": "doc",
  "content": [
    { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Title" }] },
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Hello " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "world" }
      ]
    }
  ]
}
```

Available nodes: `doc`, `paragraph`, `heading` (levels 1-6; prefer 1-3 for hierarchy), `bulletList`, `orderedList`, `listItem`, `blockquote`, `codeBlock`, `horizontalRule`, `hardBreak` (renders as `<br/>`), `table`, `tableRow`, `tableHeader`, `tableCell`, `image` (`attrs.src`, `attrs.alt`), `iframe` (`attrs.src` — use embed URLs like `https://www.youtube.com/embed/<ID>`).

Marks: `bold`, `italic`, `underline`, `strike`, `code`, `link`.

**Use the full range of block types** when generating richtext — `<RichText>` styles them all out of the box:

- `codeBlock` for code snippets (bordered monospace container)
- `blockquote` for quotes and callouts (left-border accent)
- `horizontalRule` to visually separate sections
- `table` / `tableRow` / `tableHeader` / `tableCell` for structured data
- `bulletList` / `orderedList` for lists
- `heading` (levels 1-6; prefer 1-3) to build hierarchy — don't render long-form content as a single wall of `paragraph` nodes.

## Entry body shape

Entries are CLI-driven (see `fimo-cli/content.md`). The body shape passed to `fimo entries create --body '...'` is:

```json
{
  "data": {
    "slug": "my-first-post",
    "title": "My First Post",
    "body": { "type": "doc", "content": [...] },
    "coverImage": { "source": "local", "url": "...", "alt": "..." }
  }
}
```

**`slug` lives INSIDE `data`**, alongside every other field.

> The API validator strips any top-level keys other than `data` — if you put `slug` at the top level it is silently dropped and the backend generates a random one. Always nest it inside `data`.

## Slug rules

Always provide a meaningful `slug` when creating an entry — it appears in URLs. The server will `slugify()` whatever you send (lowercase, hyphen separators, strip special chars), so you can pass a clean candidate straight through.

- **Format**: lowercase, hyphen-separated, ASCII, no special characters (e.g. `my-first-blog-post`).
- **Derive from** the entry's main human-readable field: `title` for posts/pages, `name` for team members/products.
- **Concise and descriptive** — max 255 chars; aim for under 60 for readability.
- **Unique per content type** — two `BlogPost` entries can't share a slug. If seeding duplicates, suffix (`my-post`, `my-post-2`).
- **Stable** — once an entry is live, changing the slug breaks inbound links. Only update intentionally.
- If you omit `slug`, the backend generates a random one — never rely on this for content you want to link to.

For `media` fields, prefer `source: "local"` with assets uploaded via `fimo assets upload` or generated via `fimo generate` (see `fimo-cli/assets.md`).

## Generated React Query hooks

After pre-build (or `fimo deploy`), `src/schemas/{Uid}.ts` exports typed helpers. Import each schema from its own module, e.g. `import { useGet } from '@/schemas/BlogPost'` — there is no generated `src/schemas/index.ts` barrel.

**Entity shape — fields live at the top level of the entry**, not under a nested `data` key. The generated `BlogPost` interface looks like:

```ts
interface BlogPost {
  id: string;
  documentId: string;
  slug: FimoString;
  locale: string;
  createdAt: string;
  updatedAt: string;
  __fimo: {
    contentType: string;
    translationProgress: { state: 'queued' | 'translating'; fields?: string[] } | null;
  };
  title: FimoString;
  body: FimoRichText;
  coverImage: FimoMedia;
  publishDate: FimoString;
  featured: FimoBoolean;
  // ...
}
```

Content fields live at the top level. Fimo-owned metadata that is not part of the user schema lives under `__fimo`, so a schema can safely define fields named `contentType` or `translationProgress`.

## Localized content

Content entries are stored per locale. Generated hooks read the active Fimo locale automatically.

When a project has multiple configured locales, create and update each localized content variant explicitly. Use the default locale first, then create non-default variants with the same `documentId` and the target `locale` through the content tools or `fimo entries` commands.

**Generated API:**

```ts
// low-level fetch helpers
getById(id: string): Promise<BlogPost>
getBySlug(slug: string): Promise<BlogPost | null>
getByField(fieldName: string, value: string): Promise<BlogPost | null>
get<TFields extends BlogPostFields | undefined>(params?: BlogPostQuery<TFields>): Promise<BlogPostResult<TFields>[]>
create(payload: Partial<BlogPost>): Promise<BlogPost>
update(id: string, payload: Partial<BlogPost>): Promise<BlogPost>
remove(id: string): Promise<void>

// react-query hooks
useGetById(id)                    // → { data: BlogPost | undefined, isLoading, ... }
useGetBySlug(slug)                // → { data: BlogPost | null | undefined, ... } — ideal for /:slug detail routes
useGetByField(fieldName, value)   // → { data: BlogPost | null | undefined, ... }
useGet<TFields>(params?)          // → { data: BlogPostResult<TFields>[] | undefined, isLoading, ... }
useCreate() / useUpdate() / useRemove()

// Suspense variants (same signatures, throw to a <Suspense> boundary instead of returning isLoading)
useSuspenseGetById(id) / useSuspenseGetBySlug(slug) / useSuspenseGetByField(fieldName, value) / useSuspenseGet(params?)
```

Access pattern — the hooks **unwrap** the API envelope, so `get()` / `useGet()` resolve to a `BlogPost[]` directly (not a `{ data, meta }` wrapper):

```tsx
const { data: posts, isLoading } = useGet({ where: { featured: true }, sort: '-publishedAt', limit: 10 });
if (isLoading || !posts) return null;
posts.map((post) => /* ... */); // BlogPost[]
```

Query params supported: `limit` (1-100, default 20), `offset` (default 0), `search`, `sort`, `where`, and `fields`. Use these canonical names in new code.

`where` filters on the server. Use scalar values for equality and operator objects for ranges, lists, text matches, or null checks. Keep boolean, string, and number values typed in the object:

```ts
BlogPost.useGet({
  where: {
    featured: true,
    category: 'tech',
    views: { $gte: 100 },
    title: { $contains: 'React' },
    coverImage: { $null: false },
    __fimo: { contentType: { $eq: 'BlogPost' } },
  },
  sort: ['-publishedAt', 'title'],
  limit: 12,
});
```

Operators: scalar equality, `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$contains`, `$startsWith`, `$null`.

Use `fields` to keep list payloads small. The API always keeps `id`, and returns only the requested fields beyond that:

```tsx
const { data: summaries = [] } = BlogPost.useGet({
  fields: ['slug', 'title', 'excerpt', 'coverImage'] as const,
  sort: '-publishedAt',
  limit: 12,
});
// summaries: Array<Pick<BlogPost, 'id' | 'slug' | 'title' | 'excerpt' | 'coverImage'>>
```

The generated hooks do **not** surface pagination meta (`total`, `hasMore`, `limit`, `offset`). If you need it, read it from a raw fetch to `/entries/<typeName>` (see the **Read path** section below), which returns the full `{ data, meta }` envelope.

## Fimo primitives (what the field values are)

The entry objects a hook returns are **not** plain JS values. The generated client wraps each _trackable_ field in a `fimo/ui` primitive that carries source metadata for inline editing. Which fields wrap, and which stay plain:

| Schema field type | Field value you get         | Notes                                               |
| ----------------- | --------------------------- | --------------------------------------------------- |
| `string`          | `FimoString`                | `extends String` — **not** a primitive `string`     |
| `richtext`        | `FimoRichText`              | Tiptap JSONContent + source metadata                |
| `boolean`         | `FimoBoolean`               | class; `.valueOf()` → `boolean`                     |
| `media`           | `FimoMedia` / `FimoMedia[]` | shape + rendering in `references/assets.md`         |
| `number`          | `number`                    | plain — not wrapped                                 |
| `json`            | `Record<string, any>`       | plain — not wrapped                                 |
| `date`            | `any` (raw ISO date string) | not wrapped (`FimoDate` is not emitted — see below) |

Rules of thumb:

- **Pass the whole primitive to the matching `fimo/ui` component** — `<Text value={post.title} />`, `<Image value={post.cover} />`, `<RichText value={post.body} />`, `<Boolean value={p.inStock} />`. Don't unwrap first; the component reads the source metadata so the field stays inline-editable in the dashboard.
- **`FimoString extends String`**, so `typeof post.title === 'object'` and `post.title === 'Hi'` is `false`. It stringifies fine inside JSX and template literals; call `.toString()` only when something genuinely needs a primitive `string`.
- **Never hand-construct** a `FimoString` / `FimoMedia` / etc. — that bypasses source tracking. For a literal string use `t()`; for a literal image use `<StaticImage>`.
- `t()` also returns a `FimoString` (see `references/labels.md`).

`FimoMedia` and `FimoBoolean` shapes:

```ts
class FimoMedia {
  readonly url: string;
  readonly alt: string;
  readonly name: string;
  readonly mime: string;
  readonly width?: number;
  readonly height?: number;
}

class FimoBoolean {
  readonly value: boolean;
  valueOf(): boolean;
}
```

> **`FimoDate`:** exported from `fimo/ui` (it's the `<Date>` component's value type), but the generated schema client does **not** wrap `date` fields in it today — they arrive as a raw ISO string. `<Date value={post.someDate} />` accepts that at runtime either way.

## UI code pattern

```tsx
import { useGet } from '@/schemas/BlogPost';
import { Text, RichText, Image, Date } from 'fimo/ui';

export function BlogList() {
  const { data: posts, isLoading } = useGet({ limit: 10 });
  if (isLoading || !posts) return null;
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Text value={post.title} as="h2" />
          <Image value={post.coverImage} width={800} height={400} fit="cover" />
          <RichText value={post.body} className="prose" />
          <Date value={post.publishDate} />
        </li>
      ))}
    </ul>
  );
}
```

For the `<Text>` / `<RichText>` / `<Image>` / `<Date>` components and the rules of thumb, see `references/ui.md`.

## Read path (published app, no auth)

```ts
const res = await fetch(`${import.meta.env.VITE_API_URL}/entries/<typeName>?fields=slug,title&limit=12`);
const { data, meta } = await res.json();
// data: Entry[] — fields flattened at top level (id, slug, title, ...)
// meta: { limit, offset, total, hasMore }
```

Prefer the generated React Query hooks from `@/schemas/{Uid}` over hand-rolled fetch — they handle caching and types (returning a typed `BlogPost[]`). Reach for this raw fetch only when you need the pagination `meta`, which the hooks don't surface.

## Forms vs. schemas

Schemas = **editor-managed content** (blog posts, pages). Forms = **end-user input** (contact, signup). See `references/forms.md` for forms.
